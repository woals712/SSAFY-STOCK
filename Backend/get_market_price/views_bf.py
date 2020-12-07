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

#from django.core import serializers
import os, sys
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
from predict import predict as prd
from strategy import test_st as st


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


class DetailView(APIView) :
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
        
    
    
