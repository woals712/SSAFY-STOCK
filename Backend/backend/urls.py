#backend/djangoreactapi/urls.py
from django.contrib import admin
from django.urls import path, include
#from get_market_price import views as get_market_price_view


from django.conf.urls import url,include 
from django.contrib import admin 
from rest_framework import routers 
from get_market_price.views import DailyPriceSet, CompanyInfoSet, DetailView, Predict, StrategyView,DetailView2
from get_market_price import views
from django.conf.urls import url, include

router = routers.DefaultRouter()
router.register(r'DailyPrice', DailyPriceSet)
router.register(r'CompanyInfo', CompanyInfoSet)
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('post.urls')),
    #path('getinfo/',get_market_price_view.main_view),
    path('predict/',include('predict.urls')),
    #path('predict/',include('predict.urls')),
    path('backtest/', include('backtest.urls')),
    path('strategy/', include('strategy.urls')),
    
    url(r'^admin/', admin.site.urls),
    url(r'^',include(router.urls)),
    url(r'^DailyPrice/<int:code>',DetailView),
    #url(r'^DailyPrice/(?P<code>\d+)&(?P<date>\d+)/$', DailyPriceSet),
    path('DailyPrice', views.DetailView.as_view()),
    path('DailyPrice2', views.DetailView2.as_view()),
    path('Predict', views.Predict.as_view()),
    path('Strategy', views.StrategyView.as_view()),
    path('Backtest', views.BacktestView.as_view())
]
