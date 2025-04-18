from django.urls import path
from . import views

urlpatterns = [
    path('', views.tracking_home, name='tracking_home'),
    path('search/', views.search_tracking, name='search_tracking'),
    path('code/<str:code>/', views.tracking_detail, name='tracking_detail'),
    path('add-to-profile/<str:code>/', views.add_to_profile, name='add_to_profile'),
    path('admin-panel/', views.admin_panel, name='admin_panel'),
    path('update-tracking-codes/', views.update_tracking_codes, name='update_tracking_codes'),
]