from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
#import datetime
from mplfinance.original_flavor import candlestick_ohlc
import matplotlib.dates as mdates
import pymysql
from . import Analyzer



# Create your views here.
def efficient(request):
    mk = Analyzer.MarketDB()
    stocks = ['삼성전자', 'SK하이닉스', '현대자동차', 'NAVER']
    df = pd.DataFrame()
    for s in stocks:
        df[s] = mk.get_daily_price(s, '2016-01-04', '2018-04-27')['close']

    daily_ret = df.pct_change()
    annual_ret = daily_ret.mean() * 252
    daily_cov = daily_ret.cov()
    annual_cov = daily_cov * 252

    port_ret = []
    port_risk = []
    port_weights = []
    sharpe_ratio = []

    for _ in range(20000):
        weights = np.random.random(len(stocks))
        weights /= np.sum(weights)

        returns = np.dot(weights, annual_ret)
        risk = np.sqrt(np.dot(weights.T, np.dot(annual_cov, weights)))

        port_ret.append(returns)
        port_risk.append(risk)
        port_weights.append(weights)
        sharpe_ratio.append(returns / risk)  # ①

    portfolio = {'Returns': port_ret, 'Risk': port_risk, 'Sharpe': sharpe_ratio}
    for i, s in enumerate(stocks):
        portfolio[s] = [weight[i] for weight in port_weights]
    df = pd.DataFrame(portfolio)
    df = df[['Returns', 'Risk', 'Sharpe'] + [s for s in stocks]]  # ②

    max_sharpe = df.loc[df['Sharpe'] == df['Sharpe'].max()]  # ③
    min_risk = df.loc[df['Risk'] == df['Risk'].min()]  # ④

    df.plot.scatter(x='Risk', y='Returns', c='Sharpe', cmap='viridis',
                    edgecolors='k', figsize=(11, 7), grid=True)  # ⑤
    # plt.scatter(x=max_sharpe['Risk'], y=max_sharpe['Returns'], c='r',
    #             marker='*', s=300)  # ⑥
    # plt.scatter(x=min_risk['Risk'], y=min_risk['Returns'], c='r',
    #             marker='X', s=200)  # ⑦
    # plt.title('Portfolio Optimization')
    # plt.xlabel('Risk')
    # plt.ylabel('Expected Returns')
    # plt.show()
    sharpe_com = max_sharpe.columns.tolist()
    sharpe_val = max_sharpe.values.tolist()
    cmp = sharpe_val[0][3:]
    key = max(cmp)
    arr1=0
    for i in range(7):
        if (sharpe_val[0][i] == key):
            arr1=str(sharpe_com[i])+' '+str(sharpe_val[0][i])
            break
    print(sharpe_com)
    print(sharpe_val)
    risk_com = min_risk.columns.tolist()
    risk_val = min_risk.values.tolist()
    cmp = risk_val[0][3:]
    key = max(cmp)
    arr2 = 0
    for i in range(7):
        if (risk_val[0][i] == key):
            arr2 = str(risk_com[i]) + ' ' + str(risk_val[0][i])
            break
    print(risk_com)
    print(risk_val)
    arr='위험률 대비 최고 수익 종목은 '+arr1+', 수익률 대비 최저 손실 종목은 '+arr2+'입니다.'
    return HttpResponse(arr)
def following(request):
    mk = Analyzer.MarketDB()
    df = mk.get_daily_price('NAVER', '2019-01-02')

    df['MA20'] = df['close'].rolling(window=20).mean()
    df['stddev'] = df['close'].rolling(window=20).std()
    df['upper'] = df['MA20'] + (df['stddev'] * 2)
    df['lower'] = df['MA20'] - (df['stddev'] * 2)
    df['PB'] = (df['close'] - df['lower']) / (df['upper'] - df['lower'])
    df['TP'] = (df['high'] + df['low'] + df['close']) / 3
    df['PMF'] = 0
    df['NMF'] = 0
    for i in range(len(df.close) - 1):
        if df.TP.values[i] < df.TP.values[i + 1]:
            df.PMF.values[i + 1] = df.TP.values[i + 1] * df.volume.values[i + 1]
            df.NMF.values[i + 1] = 0
        else:
            df.NMF.values[i + 1] = df.TP.values[i + 1] * df.volume.values[i + 1]
            df.PMF.values[i + 1] = 0
    df['MFR'] = (df.PMF.rolling(window=10).sum() /
                 df.NMF.rolling(window=10).sum())
    df['MFI10'] = 100 - 100 / (1 + df['MFR'])
    df = df[19:]
    sell=[]
    buy=[]
    # plt.figure(figsize=(9, 8))
    # plt.subplot(2, 1, 1)
    # plt.title('NAVER Bollinger Band(20 day, 2 std) - Trend Following')
    # plt.plot(df.index, df['close'], color='#0000ff', label='Close')
    # plt.plot(df.index, df['upper'], 'r--', label='Upper band')
    # plt.plot(df.index, df['MA20'], 'k--', label='Moving average 20')
    # plt.plot(df.index, df['lower'], 'c--', label='Lower band')
    # plt.fill_between(df.index, df['upper'], df['lower'], color='0.9')
    for i in range(len(df.close)):
        if df.PB.values[i] > 0.8 and df.MFI10.values[i] > 80:  # ①
            buy.append([df.index.values[i], df.close.values[i]])
            # plt.plot(df.index.values[i], df.close.values[i], 'r^')  # ②
        elif df.PB.values[i] < 0.2 and df.MFI10.values[i] < 20:  # ③
            sell.append([df.index.values[i], df.close.values[i]])
            # plt.plot(df.index.values[i], df.close.values[i], 'bv')  # ④
    # plt.legend(loc='best')
    #
    # plt.subplot(2, 1, 2)
    # plt.plot(df.index, df['PB'] * 100, 'b', label='%B x 100')  # ⑤
    # plt.plot(df.index, df['MFI10'], 'g--', label='MFI(10 day)')  # ⑥
    # plt.yticks([-20, 0, 20, 40, 60, 80, 100, 120])  # ⑦
    # for i in range(len(df.close)):
    #     if df.PB.values[i] > 0.8 and df.MFI10.values[i] > 80:
    #         # plt.plot(df.index.values[i], 0, 'r^')
    #     elif df.PB.values[i] < 0.2 and df.MFI10.values[i] < 20:
    # #         plt.plot(df.index.values[i], 0, 'bv')
    # # plt.grid(True)
    # plt.legend(loc='best')
    # plt.show()
    arr=str(buy)+str(sell)
    return HttpResponse(arr)

def reverse(request):
    mk = Analyzer.MarketDB()
    df = mk.get_daily_price('SK하이닉스', '2018-11-01')

    df['MA20'] = df['close'].rolling(window=20).mean()
    df['stddev'] = df['close'].rolling(window=20).std()
    df['upper'] = df['MA20'] + (df['stddev'] * 2)
    df['lower'] = df['MA20'] - (df['stddev'] * 2)
    df['PB'] = (df['close'] - df['lower']) / (df['upper'] - df['lower'])

    df['II'] = (2 * df['close'] - df['high'] - df['low']) / (df['high'] - df['low']) * df['volume']
    df['IIP21'] = df['II'].rolling(window=21).sum() / df['volume'].rolling(window=21).sum() * 100
    df = df.dropna()

    # plt.figure(figsize=(9, 9))
    # plt.subplot(3, 1, 1)
    # plt.title('SK Hynix Bollinger Band(20 day, 2 std) - Reversals')
    # plt.plot(df.index, df['close'], 'm', label='Close')
    # plt.plot(df.index, df['upper'], 'r--', label='Upper band')
    # plt.plot(df.index, df['MA20'], 'k--', label='Moving average 20')
    # plt.plot(df.index, y['lower'], 'c--', label='Lower band')
    # plt.fill_between(df.index, df['upper'], df['lower'], color='0.9')
    buy=[]
    sell=[]
    for i in range(0, len(df.close)):
        if df.PB.values[i] < 0.05 and df.IIP21.values[i] > 0:
            buy.append([df.index.values[i], df.close.values[i]])
            # plt.plot(df.index.values[i], df.close.values[i], 'r^')
        elif df.PB.values[i] > 0.95 and df.IIP21.values[i] < 0:
            sell.append([df.index.values[i], df.close.values[i]])
            # plt.plot(df.index.values[i], df.close.values[i], 'bv')

    # plt.legend(loc='best')
    # plt.subplot(3, 1, 2)
    # plt.plot(df.index, df['PB'], 'b', label='%b')
    # plt.grid(True)
    # plt.legend(loc='best')
    #
    # plt.subplot(3, 1, 3)
    arr=str(buy)+str(sell)
    return HttpResponse(arr)

def triple(request):
    mk = Analyzer.MarketDB()
    df = mk.get_daily_price('엔씨소프트', '2017-01-01')

    ema60 = df.close.ewm(span=60).mean()
    ema130 = df.close.ewm(span=130).mean()
    macd = ema60 - ema130
    signal = macd.ewm(span=45).mean()
    macdhist = macd - signal
    df = df.assign(ema130=ema130, ema60=ema60, macd=macd, signal=signal,macdhist=macdhist).dropna()

    print(df['date'])
    df['number'] = df.index.map(mdates.date2num)
    ohlc = df[['number','open','high','low','close']]

    print(df['number'])
    
    ndays_high = df.high.rolling(window=14, min_periods=1).max()
    ndays_low = df.low.rolling(window=14,min_periods=1).min()

    fast_k = (df.close - ndays_low) / (ndays_high - ndays_low) * 100
    slow_d = fast_k.rolling(window=3).mean()
    df = df.assign(fast_k=fast_k,slow_d=slow_d).dropna()
    buy=[]
    sell=[]
    # plt.figure(figsize=(9, 9))
    # p1 = plt.subplot(3, 1, 1)
    # plt.title('Triple Screen Trading (NCSOFT)')
    # plt.grid(True)
    # candlestick_ohlc(p1, ohlc.values, width=.6, colorup='red', colordown='blue')
    # p1.xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m'))
    # plt.plot(df.number, df['ema130'], color='c', label='EMA130')
    for i in range(1, len(df.close)):
        if df.ema130.values[i - 1] < df.ema130.values[i] and df.slow_d.values[i - 1] >= 20 and df.slow_d.values[i] < 20:
            buy.append([df.number.values[i], 250000])
            # plt.plot(df.number.values[i], 250000, 'r^')
        elif df.ema130.values[i - 1] > df.ema130.values[i] and df.slow_d.values[i - 1] <= 80 and df.slow_d.values[i] > 80:
            sell.append([df.number.values[i], 250000])
            # plt.plot(df.number.values[i], 250000, 'bv')
    # plt.legend(loc='best')
    #
    # p2 = plt.subplot(3, 1, 2)
    # plt.grid(True)
    # p2.xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m'))
    # plt.bar(df.number, df['macdhist'], color='m', label='MACD-Hist')
    # plt.plot(df.number, df['macd'], color='b', label='MACD')
    # plt.plot(df.number, df['signal'], 'g--', label='MACD-Signal')
    # plt.legend(loc='best')
    #
    # p3 = plt.subplot(3, 1, 3)
    # plt.grid(True)
    # p3.xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m'))
    # plt.plot(df.number, df['fast_k'], color='c', label='%K')
    # plt.plot(df.number, df['slow_d'], color='k', label='%D')
    # plt.yticks([0, 20, 80, 100])
    # plt.legend(loc='best')
    # plt.show()


    '''
    ohlc = df[['number','open','high','low','close']]
    number = pd.DataFrame(df['number'],columns=["number"])
    op = pd.DataFrame(df['open'],columns=["open"])
    hi = pd.DataFrame(df['high'],columns=["high"])
    low = pd.DataFrame(df['low'],columns=["low"])
    clo = pd.DataFrame(df['close'],columns=["close"])

    number["days"] = number.index
    op["days"] = op.index
    hi["days"] = hi.index
    low["days"] = low.index
    clo["days"] = clo.index

    
    number.to_json(orient="records")
    op.to_json(orient="records")
    hi.to_json(orient="records")
    low.to_json(orient="records")
    clo.to_json(orient="records")
    
    tmp1 = pd.merge(number,op,on="days")
    tmp2 = pd.merge(hi,low,on="days")
    tmp3 = pd.merge(tmp1,tmp2,on="days")
    candle = pd.merge(tmp3,clo,on="days")

    print(candle)
    print(df)
    print(ohlc)
    '''
    arr=str(buy)+str(sell)
    return HttpResponse(arr)

def dualmomentum(request):
    class DualMomentum:
        def __init__(self):
            """생성자: KRX 종목코드(codes)를 구하기 위한 MarkgetDB 객체 생성"""
            self.mk = Analyzer.MarketDB()

        def get_rltv_momentum(self, start_date, end_date, stock_count):
            """특정 기간 동안 수익률이 제일 높았던 stock_count 개의 종목들 (상대 모멘텀)
                - start_date  : 상대 모멘텀을 구할 시작일자 ('2020-01-01')
                - end_date    : 상대 모멘텀을 구할 종료일자 ('2020-12-31')
                - stock_count : 상대 모멘텀을 구할 종목수
            """
            connection = pymysql.connect(host='k3a106.p.ssafy.io',port=3306,user='ssafy',password='1234',
            db='Investar', charset='utf8')
            cursor = connection.cursor()

            # 사용자가 입력한 시작일자를 DB에서 조회되는 일자로 보정
            sql = f"select max(date) from daily_price where date <= '{start_date}'"
            cursor.execute(sql)
            result = cursor.fetchone()
            # if (result[0] is None):
            #     print("start_date : {} -> returned None".format(sql))
            #     return
            start_date = result[0].strftime('%Y-%m-%d')

            # 사용자가 입력한 종료일자를 DB에서 조회되는 일자로 보정
            sql = f"select max(date) from daily_price where date <= '{end_date}'"
            cursor.execute(sql)
            result = cursor.fetchone()
            # if (result[0] is None):
            #     print("end_date : {} -> returned None".format(sql))
            #     return
            end_date = result[0].strftime('%Y-%m-%d')

            # KRX 종목별 수익률을 구해서 2차원 리스트 형태로 추가
            rows = []
            columns = ['code', 'company', 'old_price', 'new_price', 'returns']
            for _, code in enumerate(self.mk.codes):
                sql = f"select close from daily_price " \
                      f"where code='{code}' and date='{start_date}'"
                cursor.execute(sql)
                result = cursor.fetchone()
                if (result is None):
                    continue
                old_price = int(result[0])
                sql = f"select close from daily_price " \
                      f"where code='{code}' and date='{end_date}'"
                cursor.execute(sql)
                result = cursor.fetchone()
                if (result is None):
                    continue
                new_price = int(result[0])
                returns = (new_price / old_price - 1) * 100
                rows.append([code, self.mk.codes[code], old_price, new_price,
                             returns])

            # 상대 모멘텀 데이터프레임을 생성한 후 수익률순으로 출력
            df = pd.DataFrame(rows, columns=columns)
            df = df[['code', 'company', 'old_price', 'new_price', 'returns']]
            df = df.sort_values(by='returns', ascending=False)
            df = df.head(stock_count)
            df.index = pd.Index(range(stock_count))
            connection.close()
            # print(df)
            # print(f"\nRelative momentum ({start_date} ~ {end_date}) : " \
            #       f"{df['returns'].mean():.2f}% \n")
            return df

        def get_abs_momentum(self, rltv_momentum, start_date, end_date):
            """특정 기간 동안 상대 모멘텀에 투자했을 때의 평균 수익률 (절대 모멘텀)
                - rltv_momentum : get_rltv_momentum() 함수의 리턴값 (상대 모멘텀)
                - start_date    : 절대 모멘텀을 구할 매수일 ('2020-01-01')
                - end_date      : 절대 모멘텀을 구할 매도일 ('2020-12-31')
            """
            stockList = list(rltv_momentum['code'])
            
            connection = pymysql.connect(host='k3a106.p.ssafy.io',port=3306,user='ssafy',password='1234',
            db='Investar', charset='utf8')
            cursor = connection.cursor()

            # 사용자가 입력한 매수일을 DB에서 조회되는 일자로 변경
            sql = f"select max(date) from daily_price " \
                  f"where date <= '{start_date}'"
            cursor.execute(sql)
            result = cursor.fetchone()
            # if (result[0] is None):
            #     print("{} -> returned None".format(sql))
            #     return
            start_date = result[0].strftime('%Y-%m-%d')

            # 사용자가 입력한 매도일을 DB에서 조회되는 일자로 변경
            sql = f"select max(date) from daily_price " \
                  f"where date <= '{end_date}'"
            cursor.execute(sql)
            result = cursor.fetchone()
            # if (result[0] is None):
            #     print("{} -> returned None".format(sql))
            #     return
            end_date = result[0].strftime('%Y-%m-%d')

            # 상대 모멘텀의 종목별 수익률을 구해서 2차원 리스트 형태로 추가
            rows = []
            columns = ['code', 'company', 'old_price', 'new_price', 'returns']
            for _, code in enumerate(stockList):
                sql = f"select close from daily_price " \
                      f"where code='{code}' and date='{start_date}'"
                cursor.execute(sql)
                result = cursor.fetchone()
                if (result is None):
                    continue
                old_price = int(result[0])
                sql = f"select close from daily_price " \
                      f"where code='{code}' and date='{end_date}'"
                cursor.execute(sql)
                result = cursor.fetchone()
                if (result is None):
                    continue
                new_price = int(result[0])
                returns = (new_price / old_price - 1) * 100
                rows.append([code, self.mk.codes[code], old_price, new_price,
                             returns])

            # 절대 모멘텀 데이터프레임을 생성한 후 수익률순으로 출력
            df = pd.DataFrame(rows, columns=columns)
            df = df[['code', 'company', 'old_price', 'new_price', 'returns']]
            df = df.sort_values(by='returns', ascending=False)
            connection.close()
            # print(df)
            # print(f"\nAbasolute momentum ({start_date} ~ {end_date}) : " \
            #       f"{df['returns'].mean():.2f}%")
            return df['returns'].mean()

    dm = DualMomentum()
    rm = dm.get_rltv_momentum('2019-05-15', '2019-08-15', 10)
    arr1=rm['returns'].mean()
    am = dm.get_abs_momentum(rm, '2019-08-15', '2019-11-15')
    arr = str(arr1) + '   ' +str(am)
    return HttpResponse(arr)