from django.urls import path
from . import views

urlpatterns = [
    path('predict/', views.predict_solar_power, name='predict_solar_power'),
    path('info/', views.get_prediction_info, name='get_prediction_info'),
    path('user-predictions/', views.get_user_predictions, name='get_user_predictions'),
    path('user-latest-prediction/', views.get_user_latest_prediction, name='get_user_latest_prediction'),
    path('user-stats/', views.get_user_prediction_stats, name='get_user_prediction_stats'),
    path('delete-prediction/<str:prediction_id>/', views.delete_prediction, name='delete_prediction'),
    path('todays-power/', views.get_todays_power_generation, name='get_todays_power_generation'),
    path('recommendations/', views.get_recommendations, name='get_recommendations'),
    path('export-report/', views.export_report, name='export_report'),
    path('test/', views.test_view, name='test_view'),
]
