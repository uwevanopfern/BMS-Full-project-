from . import views
from django.urls import path
from django.urls import include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('buildings', views.BuildingViewSet)
router.register('paymentTypes', views.PaymentTypeViewSet)
router.register('membershipTypes', views.MembershipTypeViewSet)
router.register('billings', views.BillingViewSet, basename='Billing')
router.register('tenants', views.TenantViewSet, basename='Tenant')
router.register('contacts', views.ContactViewSet, basename='Contact')

urlpatterns = [
    path('', include(router.urls)),
    path('register_user/', views.register_user),
    path('login_user/', views.login_user),
    path('available-rooms/<int:building_id>/', views.available_building_rooms),
    path('add-floor/', views.add_floor),
    path('floors/<int:building_id>/', views.get_floors_of_building),
    path('floor-details/<int:floor_id>/', views.FloorDetailAPIView.as_view()),
    path('add-block/', views.add_block),
    path('blocks/<int:building_id>/', views.get_blocks_of_building),
    path('block-details/<int:block_id>/', views.BlockDetailAPIView.as_view()),
    path('add-room/', views.add_room),
    path('rooms/<int:building_id>/', views.get_rooms_of_building),
    path('room-details/<int:room_id>/', views.RoomDetailAPIView.as_view()),
    path('add-booking/', views.add_booking),
    path('pending-bookings/<int:building_id>/',
         views.get_pending_bookings_of_building),
    path('confirmed-bookings/<int:building_id>/',
         views.get_confirmed_bookings_of_building),
    path('booking-details/<int:booking_id>/',
         views.BookingDetailAPIView.as_view()),
    path('count-totals/<int:building_id>/<str:key>/', views.count_totals),
    path('test/', views.test),
]
