from django.urls import path
from . import views
urlpatterns=[
    path('efficient/',views.efficient,name='efficient'),
    path('bollinger/following',views.following,name='following'),
    path('bollinger/reverse',views.reverse,name='reverse'),
    path('triple/',views.triple,name='triple'),
    path('dualmomentum/',views.dualmomentum,name='dualmomentum'),

]