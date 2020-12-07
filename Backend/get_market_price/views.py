#from rest_framework import viewsets
#from .serializers import DailyPriceSerializer
#from .models import DailyPrice

from .models import DailyPrice, CompanyInfo
from rest_framework import viewsets
from rest_framework import permissions
from .serializers import DailyPriceSerializer,CompanyInfoSerializer
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from datetime import datetime
from datetime import timedelta

#from django.core import serializers
import os, sys
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
from predict import predict as prd
from strategy import test_st as st
from backtest import views as bt
from datetime import datetime
import pymysql


class DailyPriceSet(viewsets.ModelViewSet):
    
    #queryset = serializers.serialize("json",DailyPrice.objects.all())
    queryset = DailyPrice.objects.all()
    serializer_class = DailyPriceSerializer
    print("타입 : ", type(serializer_class.data))
    print(serializer_class)
    # def get_queryset(self):
    #     qs = super().get_queryset()

    #     search = self.request.query_params.get('search','')
    #     print("SEARCH!!")
    #     if search :
    #         print("code : ", code)
    #         qs = qs.filter(code=code)

    #     return qs

class DetailView2(APIView) :
    def get(self, request):
        if 'code' in request.GET: # 해당 종목 전체 데이터 출력
            code = request.GET['code']
            if 'date' in request.GET: # 해당 종목의 해당 날짜 데이터 출력
                date = request.GET['date']
                queryset = DailyPrice.objects.get(code=code,date=date)
                serializer = DailyPriceSerializer(queryset)
                #print("개수 : ",queryset.count())
                return Response(serializer.data)
            #raise exception.ParseError("Code Error")

            if 'start_date' in request.GET: #날짜제한 검색
                start_date = request.GET['start_date']
                if 'end_date' in request.GET:
                    end_date = request.GET['end_date']
                    #results = DailyPrice.objects.active()
                    #results = results.filter()
                    queryset = DailyPrice.objects.filter(code=code,date__gte=start_date, date__lte=end_date)
                    serializer = DailyPriceSerializer(queryset,many=True)
                    return Response(serializer.data)
        #code = request.GET['code']
        #print(code)

        queryset = DailyPrice.objects.filter(code=code)
        serializer = DailyPriceSerializer(queryset,many=True)
        return Response(serializer.data)
    
class DetailView(APIView) :
    def get(self, request):
        if 'company' in request.GET: # 해당 종목 전체 데이터 출력
            #code = request.GET['code']
            company = request.GET['company']

            conn = pymysql.connect(host='k3a106.p.ssafy.io',port=3306,user='ssafy',password='1234', db='Investar', charset='utf8')

            cursor = conn.cursor()
            print(company)
            cursor.execute(f"select * from company_info where company='{company}'")
            result = cursor.fetchone()

            conn.close()

            code = result[0]

            if 'date' in request.GET: # 해당 종목의 해당 날짜 데이터 출력
                date = request.GET['date']
                queryset = DailyPrice.objects.get(code=code,date=date).order_by(-date)
                serializer = DailyPriceSerializer(queryset)
                #print("개수 : ",queryset.count())
                return Response(serializer.data)
            #raise exception.ParseError("Code Error")

            if 'start_date' in request.GET: #날짜제한 검색
                start_date = request.GET['start_date']
                if 'end_date' in request.GET:
                    end_date = request.GET['end_date']
                    #results = DailyPrice.objects.active()
                    #results = results.filter()
                    queryset = DailyPrice.objects.filter(code=code,date__gte=start_date, date__lte=end_date).order_by(-date)
                    serializer = DailyPriceSerializer(queryset,many=True)
                    
                    ret = {'table': serializer.data}
                    ret['code'] = result[0]
                    ret['company'] = result[1]
                    ret['last_update'] = result[2]

                    return Response(ret)

        queryset = DailyPrice.objects.filter(code=code)
        serializer = DailyPriceSerializer(queryset,many=True)

        ret = {'table': serializer.data}
        ret['code'] = result[0]
        ret['company'] = result[1]
        ret['last_update'] = result[2]

        return Response(ret)

class CompanyInfoSet(viewsets.ModelViewSet):
    queryset = CompanyInfo.objects.all()
    serializer_class = CompanyInfoSerializer
    

class Predict(APIView) :
    def get(self,request) :     
        if 'company' in request.GET: # 해당 종목 전체 데이터 출력
            company = request.GET['company']
        if 'start_date' in request.GET: #날짜제한 검색
            start_date = request.GET['start_date']
        if 'end_date' in request.GET:
            end_date = request.GET['end_date']
        data = prd.Prediction.predict(company,start_date,end_date)
        return Response(data)
    


class StrategyView(APIView) :
    def get(self,request) :     
        if 'type' in request.GET: # 어떤 전략인지 선택.
            type = request.GET['type']

            if type == 'efficient' : # 효율 투자 전략이면
                if 'company[]' in request.GET:
                    company = request.GET.getlist('company[]')
                    if ('start_date' in request.GET) and ('end_date' in request.GET):
                        start_date = request.GET['start_date']
                        end_date = request.GET['end_date']
                        data = st.Strategy.efficient(company, start_date, end_date)
                        return Response(data)
                    else:
                        start_date = datetime.today() - timedelta(days=365)
                        start_date = start_date.strftime('%Y-%m-%d')
                        end_date = datetime.today().strftime('%Y-%m-%d')
                        data = st.Strategy.efficient(company, start_date, end_date)
                        return Response(data)

                else:
                    return Response({'err':'Please enter company'})


            if type == 'following' : # following이면
                if 'company' in request.GET:
                    company = request.GET['company']
                if 'date' in request.GET:
                    date = request.GET['date']
                    data = st.Strategy.following(company,date)
                    return Response(data)
        
            if type == 'reverse' : # reverse 매매
                if 'company' in request.GET:
                    company = request.GET['company']
                if 'date' in request.GET:
                    date = request.GET['date']
                    data = st.Strategy.reverse(company,date)
                    return Response(data)
            if type == 'triple' : # triple 매매
                if 'company' in request.GET:
                    company = request.GET['company']
                if 'date' in request.GET:
                    date = request.GET['date']
                    data = st.Strategy.triple(company,date)
                    return Response(data)

            if type == 'dual' : # triple 매매
                if 'start_date' in request.GET:
                    start_date = request.GET['start_date']
                if 'middle_date' in request.GET:
                    middle_date = request.GET['middle_date']
                if 'end_date' in request.GET:
                    end_date = request.GET['end_date']
                    data = st.Strategy.dualmomentum(start_date,middle_date,end_date)
                    return Response(data)
        
class BacktestView(APIView):
    def get(self, request):
        if 'code' in request.GET and 'cash' in request.GET:
            code = request.GET['code']
            cash = request.GET['cash']
            company = request.GET['company']

            if 'sDate' in request.GET:
                sDate = request.GET['sDate']
            else:
                sDate = datetime(2017, 1, 1)

            if  'eDate' in request.GET:
                eDate = request.GET['eDate']
            else:
                eDate = datetime(2019, 12, 1)

            conn = pymysql.connect(host='k3a106.p.ssafy.io',port=3306,user='ssafy',password='1234', db='Investar', charset='utf8')

            cursor = conn.cursor()
            cursor.execute(f"select * from company_info where company='{company}'")
            result = cursor.fetchone()

            conn.close()
            
            data = bt.backtest(result[0], cash, sDate, eDate)
            data['code'] = result[0]
            data['company'] = result[1]
            data['last_update'] = result[2]

            return Response(data)
        else:
            return Response({'err':'need data both code and cash'})
