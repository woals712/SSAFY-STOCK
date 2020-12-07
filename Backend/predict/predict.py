from django.shortcuts import render
from django.http import HttpResponse
from tensorflow.keras import Sequential
from tensorflow.keras.layers import Dense, LSTM, Dropout
import numpy as np
import matplotlib.pyplot as plt
from . import Analyzer
from rest_framework.response import Response

import json
import pandas as pd


# Create your views here.
class Prediction :
    def predict( company, start_date, end_date):
        mk = Analyzer.MarketDB()
        raw_df = mk.get_daily_price(company, start_date, end_date)

        window_size = 10
        data_size = 5

        def MinMaxScaler(data):
            """최솟값과 최댓값을 이용하여 0 ~ 1 값으로 변환"""
            numerator = data - np.min(data, 0)
            denominator = np.max(data, 0) - np.min(data, 0)
            return numerator / (denominator + 1e-7)

        dfx = raw_df[['open', 'high', 'low', 'volume', 'close']]
        dfx = MinMaxScaler(dfx)
        dfy = dfx[['close']]

        x = dfx.values.tolist()
        y = dfy.values.tolist()

        data_x = []
        data_y = []
        for i in range(len(y) - window_size):
            _x = x[i: i + window_size]  # 다음 날 종가(i+windows_size)는 포함되지 않음
            _y = y[i + window_size]  # 다음 날 종가
            data_x.append(_x)
            data_y.append(_y)
        print(_x, "->", _y)

        train_size = int(len(data_y) * 0.7)
        train_x = np.array(data_x[0: train_size])
        train_y = np.array(data_y[0: train_size])

        test_size = len(data_y) - train_size
        test_x = np.array(data_x[train_size: len(data_x)])
        test_y = np.array(data_y[train_size: len(data_y)])

        # 모델 생성
        model = Sequential()
        model.add(LSTM(units=10, activation='relu', return_sequences=True, input_shape=(window_size, data_size)))
        model.add(Dropout(0.1))
        model.add(LSTM(units=10, activation='relu'))
        model.add(Dropout(0.1))
        model.add(Dense(units=1))
        model.summary()


        print("model 끝")
        model.compile(optimizer='adam', loss='mean_squared_error')
        model.fit(train_x, train_y, epochs=60, batch_size=30)
        pred_y = model.predict(test_x)
        


        print("pred_y 끝")
        # Visualising the results
        # plt.figure()
        # plt.plot(test_y, color='red', label='real SEC stock price')
        # plt.plot(pred_y, color='blue', label='predicted SEC stock price')
        # plt.title('SEC stock price prediction')
        # plt.xlabel('time')
        # plt.ylabel('stock price')
        # plt.legend()
        # plt.show()
        a= str(raw_df.close[-1] * pred_y[-1] / dfy.close[-1])
        '''
        print("test_y:")
        print(test_y)
        print(pred_y)
        print("pred_y")
        ltest_y = test_y.tolist()
        lpred_y = pred_y.tolist()
        result = {'test_y' : ltest_y, 'pred_y' : lpred_y, 'value' : a}
        result = json.dumps(result)
        '''

        print("test:")
        df2 = pd.DataFrame(test_y,columns=["tdata"])
        df2["day"] = df2.index

        df3 = pd.DataFrame(pred_y,columns=["pdata"])
        df3["day"] = df3.index
        
        df2.to_json(orient="records")
        df3.to_json(orient="records")
        rdata = pd.merge(df2,df3,on="day")
        result = {"chart" : rdata, "price" : a}
        print(result)

        # 참고할만한 사이트 https://www.python2.net/questions-297553.htm
        return result
        #return rdata
