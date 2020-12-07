from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import datetime
from mplfinance.original_flavor import candlestick_ohlc
import matplotlib.dates as mdates
import pymysql
#from . import Analyzer
import pandas as pd
import json

import os, sys
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
import Analyzer

# Create your views here.

class Strategy :
    def efficient(company,start_date,end_date):
        mk = Analyzer.MarketDB()
        stocks = company
        df = pd.DataFrame()
        for s in stocks:
            df[s] = mk.get_daily_price(s, start_date, end_date)['close']

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

        dfx = pd.DataFrame(df['Risk'], columns=["Risk"])
        dfy = pd.DataFrame(df['Returns'], columns=["Returns"])
        data=pd.concat([dfx,dfy])
        dfx.to_json(orient="records")
        dfy.to_json(orient="records")
        result = {"risk":dfx,  "returns": dfy, "max": max_sharpe, "min": min_risk}
        # df.plot.scatter(x='Risk', y='Returns', c='Sharpe', cmap='viridis',
        #                 edgecolors='k', figsize=(11, 7), grid=True)  # ⑤
        # plt.scattr(x=max_sharpe['Risk'], y=max_sharpe['Returns'], c='r',
        #             marker='*', s=300)  # ⑥
        # plt.scatter(x=min_risk['Risk'], y=min_risk['Returns'], c='r',
        #             marker='X', s=200)  # ⑦
        # plt.title('Portfolio Optimization')
        # plt.xlabel('Risk')
        # plt.ylabel('Expected Returns')
        # plt.show()
        # sharpe_com = max_sharpe.columns.tolist()
        # sharpe_val = max_sharpe.values.tolist()
        # cmp = sharpe_val[0][3:]
        # key = max(cmp)
        # arr1=0
        # for i in range(7):
        #     if (sharpe_val[0][i] == key):
        #         arr1=str(sharpe_com[i])+' '+str(sharpe_val[0][i])
        #         break
        # print(sharpe_com)
        # print(sharpe_val)
        # risk_com = min_risk.columns.tolist()
        # risk_val = min_risk.values.tolist()
        # cmp = risk_val[0][3:]
        # key = max(cmp)
        # arr2 = 0
        # for i in range(7):
        #     if (risk_val[0][i] == key):
        #         arr2 = str(risk_com[i]) + ' ' + str(risk_val[0][i])
        #         break
        # print(risk_com)
        # print(risk_val)
        # arr='위험률 대비 최고 수익 종목은 '+arr1+', 수익률 대비 최저 손실 종목은 '+arr2+'입니다.'
        # arr=max_sharpe
        # arr2=min_risk
        return result
    def following(company,date):
        mk = Analyzer.MarketDB()
        df = mk.get_daily_price(company, date)

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

        for i in range(len(df.close)):
            if df.PB.values[i] > 0.8 and df.MFI10.values[i] > 80: 
                buy.append([df.index.values[i], df.close.values[i]])
            elif df.PB.values[i] < 0.2 and df.MFI10.values[i] < 20: 
                sell.append([df.index.values[i], df.close.values[i]])
               
        #데이터 만드는 파트
        df2 = pd.DataFrame(df['PB'],columns=["PB"])
        df2["days"] = df2.index
        df3 = pd.DataFrame(df['MFI10'],columns=['MFI10'])
        df3["days"] = df3.index
        df2.to_json(orient="records")
        df3.to_json(orient="records")
        data = pd.merge(df2,df3,on="days")
        cl = pd.DataFrame(df['close'],columns=["close"])
        cl["days"] = cl.index
        upp = pd.DataFrame(df['upper'],columns=['upper'])
        upp["days"] = upp.index
        maa = pd.DataFrame(df['MA20'],columns=['MA20']) #Moving Average
        maa["days"] = maa.index
        lo = pd.DataFrame(df['lower'],columns=['lower'])
        lo["days"] = lo.index
        cl.to_json(orient="records")
        upp.to_json(orient="records")
        maa.to_json(orient="records")
        lo.to_json(orient="records")
        tmp1 = pd.merge(cl,upp,on="days")
        tmp2 = pd.merge(maa,lo,on="days")
        band = pd.merge(tmp1,tmp2,on="days")
        arr=str(buy)+str(sell)
        #result = {"chart" : data, "point":arr, "bandchart":band}
        result = {"chart" : data, "buy":buy,"sell":sell, "bandchart":band}
        return result

    def reverse(company,date):
        mk = Analyzer.MarketDB()
        df = mk.get_daily_price(company, date)

        df['MA20'] = df['close'].rolling(window=20).mean()
        df['stddev'] = df['close'].rolling(window=20).std()
        df['upper'] = df['MA20'] + (df['stddev'] * 2)
        df['lower'] = df['MA20'] - (df['stddev'] * 2)
        df['PB'] = (df['close'] - df['lower']) / (df['upper'] - df['lower'])

        df['II'] = (2 * df['close'] - df['high'] - df['low']) / (df['high'] - df['low']) * df['volume']
        df['IIP21'] = df['II'].rolling(window=21).sum() / df['volume'].rolling(window=21).sum() * 100
        df = df.dropna()

        buy=[]
        sell=[]
        for i in range(0, len(df.close)):
            if df.PB.values[i] < 0.05 and df.IIP21.values[i] > 0:
                buy.append([df.index.values[i], df.close.values[i]])
            elif df.PB.values[i] > 0.95 and df.IIP21.values[i] < 0:
                sell.append([df.index.values[i], df.close.values[i]])
        arr=str(buy)+str(sell)

        
        #데이터 만드는 파트
        pbc = pd.DataFrame(df['PB'],columns=["PB"])
        pbc["days"] = pbc.index
        iip = pd.DataFrame(df['IIP21'],columns=['IIP21'])
        iip["days"] = iip.index
        pbc.to_json(orient="records")
        iip.to_json(orient="records")
        cl = pd.DataFrame(df['close'],columns=["close"])
        cl["days"] = cl.index
        upp = pd.DataFrame(df['upper'],columns=['upper'])
        upp["days"] = upp.index
        maa = pd.DataFrame(df['MA20'],columns=['MA20']) #Moving Average
        maa["days"] = maa.index
        lo = pd.DataFrame(df['lower'],columns=['lower'])
        lo["days"] = lo.index
        cl.to_json(orient="records")
        upp.to_json(orient="records")
        maa.to_json(orient="records")
        lo.to_json(orient="records")
        tmp1 = pd.merge(cl,upp,on="days")
        tmp2 = pd.merge(maa,lo,on="days")
        band = pd.merge(tmp1,tmp2,on="days")
        arr=str(buy)+str(sell)
        #result = {"PBchart" : pbc, "point":arr, "bandchart":band, "IIPchart" :iip}
        result = {"PBchart" : pbc, "buy":buy,"sell":sell, "bandchart":band, "IIPchart" :iip}
        return result



    def triple(company,date):
        mk = Analyzer.MarketDB()
        df = mk.get_daily_price(company, date)

        ema60 = df.close.ewm(span=60).mean()
        ema130 = df.close.ewm(span=130).mean()
        macd = ema60 - ema130
        signal = macd.ewm(span=45).mean()
        macdhist = macd - signal
        df = df.assign(ema130=ema130, ema60=ema60, macd=macd, signal=signal, macdhist=macdhist).dropna()
        #print(df)
        df['number'] = df.index.map(mdates.date2num) # 문제지점
        #ohlc = df[['number', 'open', 'high', 'low', 'close']]
        ohlc = df[['number', 'open', 'high', 'low', 'close']]
        #print(df['date'])
        ndays_high = df.high.rolling(window=14, min_periods=1).max()
        ndays_low = df.low.rolling(window=14, min_periods=1).min()

        fast_k = (df.close - ndays_low) / (ndays_high - ndays_low) * 100
        slow_d = fast_k.rolling(window=3).mean()
        df = df.assign(fast_k=fast_k, slow_d=slow_d).dropna()
        buy=[]
        sell=[]
        for i in range(1, len(df.close)):
            if df.ema130.values[i - 1] < df.ema130.values[i] and df.slow_d.values[i - 1] >= 20 and df.slow_d.values[i] < 20:
                buy.append([df.number.index[i], 250000])
            elif df.ema130.values[i - 1] > df.ema130.values[i] and df.slow_d.values[i - 1] <= 80 and df.slow_d.values[i] > 80:
                sell.append([df.number.index[i], 250000])
                
        #데이터 만드는 파트
        ml = pd.DataFrame(df['macdhist'],columns=["macdhist"])
        ml["days"] = ml.index
        ma = pd.DataFrame(df['macd'],columns=['macd'])
        ma["days"] = ma.index
        si = pd.DataFrame(df['signal'],columns=['signal'])
        si["days"] = si.index
        ml.to_json(orient="records")
        ma.to_json(orient="records")
        si.to_json(orient="records")

        fa = pd.DataFrame(df['fast_k'],columns=["fast_k"])
        fa["days"] = fa.index
        sl = pd.DataFrame(df['slow_d'],columns=['slow_d'])
        sl["days"] = sl.index
        fa.to_json(orient="records")
        sl.to_json(orient="records")
        
        tmp3 = pd.merge(fa,sl,on="days")
        
        tmp1 = pd.merge(ml,ma,on="days")
        tmp2 = pd.merge(tmp1,si,on="days")

        arr=str(buy)+str(sell)
        ema = pd.DataFrame(df['ema130'],columns=["ema130"])
        ema.to_json(orient="records")

        #result = {"candle" : ohlc, "macdchart":tmp2, "kdchart":tmp3, "point":arr}
        result = {"candle" : ohlc, "macdchart":tmp2, "kdchart":tmp3, "buy":buy, "sell":sell, "ema130" : ema}
        return result

    def dualmomentum(start_date,middle_date,end_date):
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
                df['returns'] = df['returns'].mean()
                #return df['returns'].mean()
                return df

        dm = DualMomentum()
        rm = dm.get_rltv_momentum(start_date, middle_date, 10)
        arr1=rm['returns'].mean()
        am = dm.get_abs_momentum(rm, middle_date, end_date)
        arr = str(arr1) + '   ' +str(am['returns'].mean())
        print(am)
        result = {"dual":arr, "rm" : rm, "am" : am}
        return result