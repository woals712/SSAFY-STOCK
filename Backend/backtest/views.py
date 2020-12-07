from django.shortcuts import render
import backtrader as bt
from datetime import datetime

def backtest(code, cash, sDate, eDate):
    tmp = []
    class MyStrategy(bt.Strategy):
        def __init__(self):
            self.dataclose = self.datas[0].close
            self.order = None
            self.buyprice = None
            self.buycomm = None
            self.rsi = bt.indicators.RSI_SMA(self.data.close, period=21)
            global tmp

        def notify_order(self, order):
            if order.status in [order.Submitted, order.Accepted]:
                return
            if order.status in [order.Completed]:
                if order.isbuy():
                    tmp.append(
                        {
                            'date': f'{self.datas[0].datetime.date(0).isoformat()}', 
                            'buy': 'BUY', 
                            'price': f'{order.executed.price:,.0f}',
                            'size': f'{order.executed.size:,.0f}',
                            'comm': f'{order.executed.comm:,.0f}',
                            'value': f'{cerebro.broker.getvalue():,.0f}'
                        }
                    )
                    self.buyprice = order.executed.price
                    self.buycomm = order.executed.comm
                else:
                    tmp.append(
                        {
                            'date': f'{self.datas[0].datetime.date(0).isoformat()}', 
                            'buy': 'SELL', 
                            'price': f'{order.executed.price:,.0f}',
                            'size': f'{order.executed.size:,.0f}',
                            'comm': f'{order.executed.comm:,.0f}',
                            'value': f'{cerebro.broker.getvalue():,.0f}'
                        }
                    )
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
            print(f'[{dt.isoformat()}] {txt}')

    cerebro = bt.Cerebro()
    cerebro.addstrategy(MyStrategy)
    data = bt.feeds.YahooFinanceData(dataname=code+'.KS', fromdate=sDate, todate=eDate)
    cerebro.adddata(data)
    cerebro.broker.setcash(int(cash))
    cerebro.broker.setcommission(commission=0.0014)
    cerebro.addsizer(bt.sizers.PercentSizer, percents=90)

    ret = {'bf_end_price':int(cash)}
    cerebro.run()
    ret['af_end_price'] = cerebro.broker.getvalue()
    ret['table'] = tmp
    return ret

