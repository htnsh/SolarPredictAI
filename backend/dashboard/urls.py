from django.urls import path
from . import views

urlpatterns = [
    path('predict/', views.predict_solar_power, name='predict_solar_power'),
    path('info/', views.get_prediction_info, name='get_prediction_info'),
    path('test-predict/', views.test_predict_solar_power, name='test_predict_solar_power'),
]
