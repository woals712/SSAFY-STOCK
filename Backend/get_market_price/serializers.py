from .models import DailyPrice, CompanyInfo
from rest_framework import serializers

class DailyPriceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = DailyPrice
        fields = ('code','date','open','high','low','close','diff','volume')

class DailyPriceDetailSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = DailyPrice
        fields = ('code','date','open','high','low','close','diff','volume')

        
class CompanyInfoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CompanyInfo
        fields = ('code','company','last_update')