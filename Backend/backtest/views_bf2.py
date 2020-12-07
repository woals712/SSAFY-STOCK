from django.shortcuts import render
import backtrader as bt
from datetime import datetime

def backtest(code, cash, sDate, eDate):
    class MyStrategy(bt.Strategy):
        def __init__(self):
            self.dataclose = self.datas[0].close
            self.order = None
            self.buyprice = None
            self.buycomm = None
            self.rsi = bt.indicators.RSI_SMA(self.data.close, period=21)

        def notify_order(self, order):
            if order.status in [order.Submitted, order.Accepted]:
                return
            if order.status in [order.Completed]:
                if order.isbuy():
                    self.log(f'BUY  : 주가 {order.executed.price:,.0f}, '
                             f'수량 {order.executed.size:,.0f}, '
                             f'수수료 {order.executed.comm:,.0f}, '
                             f'자산 {cerebro.broker.getvalue():,.0f}')
                    self.buyprice = order.executed.price
                    self.buycomm = order.executed.comm
                else:
                    self.log(f'SELL : 주가 {order.executed.price:,.0f}, '
                             f'수량 {order.executed.size:,.0f}, '
                             f'수수료 {order.executed.comm:,.0f}, '
                             f'자산 {cerebro.broker.getvalue():,.0f}')
                self.bar_executed = len(self)
            elif order.status in [order.Canceled]:
                self.log('ORDER CANCELD')
            elif order.status in [order.Margin]:
                self.log('ORDER MARGIN')
            elif order.status in [order.Rejected]:
                self.log('ORDER REJECTED')
            self.order = None

        def next(self):
            if not self.position:
                if self.rsi < 30:
                    self.order = self.buy()
            else:
                if self.rsi > 70:
                    self.order = self.sell()

        def log(self, txt, dt=None):
            dt = self.datas[0].datetime.date(0)
            # print(f'[{dt.isoformat()}] {txt}')

    cerebro = bt.Cerebro()
    cerebro.addstrategy(MyStrategy)
    #data = bt.feeds.YahooFinanceData(dataname='036570.KS', fromdate=datetime(2017, 1, 1), todate=datetime(2019, 12, 1))
    data = bt.feeds.YahooFinanceData(dataname=code+'.KS', fromdate=sDate, todate=eDate)
    cerebro.adddata(data)
    cerebro.broker.setcash(int(cash))
    cerebro.broker.setcommission(commission=0.0014)
    cerebro.addsizer(bt.sizers.PercentSizer, percents=90)

    ret = {'bf_end_price':int(cash)}
    # print(f'Initial Portfolio Value : {cerebro.broker.getvalue():,.0f} KRW')
    #arr='백테스트 시작 전 종가: '+str(cerebro.broker.getvalue())
    cerebro.run()
    # print(f'Final Portfolio Value   : {cerebro.broker.getvalue():,.0f} KRW')
    # cerebro.plot(style='can++zdlestick')  # ⑥
    ret['af_end_price'] = cerebro.broker.getvalue()
    return ret
