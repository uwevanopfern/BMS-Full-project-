# pylint: disable=import-error
# pylint: disable=no-name-in-module
# pylint: disable=no-member
from rest_framework import serializers

from . import models


class UserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(
        style={'input-type': 'password'}, write_only=True)

    class Meta:
        model = models.User
        fields = (
            'id', 'email', 'name', 'password', 'password2', 'building', 'buildingId', 'building_name',
            'building_acronym', 'is_manager', 'is_employee')
        extra_kwargs = {'password': {'write_only': True}, 'building': {'write_only': True},
                        'buildingId': {'read_only': True}, 'password2': {'write_only': True},
                        'building_name': {'read_only': True}, 'building_acronym': {'read_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        password2 = validated_data.pop('password2', None)
        user = self.Meta.model(**validated_data)
        if password != password2:
            raise serializers.ValidationError(
                {'password': 'Passwords must match.'})
        if password is not None:
            user.set_password(password)
        user.save()
        return user


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Booking
        fields = (
            'id', 'client_name', 'client_email', 'client_phone', 'client_address', 'business_desc', 'room', 'roomID',
            'room_name', 'room_number', 'buildingAcronym', 'is_confirmed')
        extra_kwargs = {'room': {'write_only': True}, 'roomID': {'read_only': True}, 'room_name': {'read_only': True},
                        'room_number': {'read_only': True}, 'buildingAcronym': {'read_only': True}}


class RoomSerializer(serializers.ModelSerializer):
    bookings = BookingSerializer(many=True, read_only=True)

    class Meta:
        model = models.Room
        fields = (
            'id', 'block', 'floor', 'name', 'is_occupied', 'price', 'buildingID', 'number', 'block_name',
            'floor_name', 'bookings', 'total_bookings')
        extra_kwargs = {'block_name': {'read_only': True}, 'floor_name': {'read_only': True},
                        'total_bookings': {'read_only': True}}


class BlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Block
        fields = ('id', 'floor', 'name', 'number', 'floor_name')
        extra_kwargs = {'floor_name': {'read_only': True},
                        'total_rooms': {'read_only': True}}


class FloorSerializer(serializers.ModelSerializer):
    """read_only means to display(read) only and don't save it"""
    blocks = BlockSerializer(many=True, read_only=True)
    occupied_rooms = RoomSerializer(many=True, read_only=True)
    available_rooms = RoomSerializer(many=True, read_only=True)

    class Meta:
        model = models.Floor
        fields = (
            'id', 'building', 'building_acronym', 'building_name', 'name', 'number', 'blocks', 'occupied_rooms',
            'available_rooms', 'total_blocks',
            'total_rooms')
        extra_kwargs = {'building_acronym': {'read_only': True}, 'building_name': {'read_only': True},
                        'building': {'write_only': True}, 'blocks': {'read_only': True},
                        'occupied_rooms': {'read_only': True}, 'available_rooms': {'read_only': True},
                        'total_blocks': {'read_only': True}, 'total_rooms': {'read_only': True}}


class BuildingSerializer(serializers.ModelSerializer):
    managers = UserSerializer(many=True, read_only=True)
    employees = UserSerializer(many=True, read_only=True)
    floors = FloorSerializer(many=True, read_only=True)

    class Meta:
        model = models.Building
        fields = (
            'id', 'name', 'acronym', 'email', 'contact', 'address', 'website', 'avatar', 'managers', 'employees',
            'floors', 'total_managers', 'total_employees', 'total_floors')


class PaymentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.PaymentType
        fields = ('id', 'name', 'description')


class MembershipTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.MembershipType
        fields = ('id', 'name', 'description')


class BillingSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Billing
        fields = (
            'id', 'tenant', 'invoice_no', 'building', 'ebm_invoice', 'ebm_receipt_create_on', 'sub_total', 'tax_rate', 'tax_amount',
            'total', 'is_paid', 'tenantID', 'tenant_name')
        extra_kwargs = {'tenantID': {'read_only': True},
                        'tenant_name': {'read_only': True}}


class TenantSerializer(serializers.ModelSerializer):
    all_billings = BillingSerializer(many=True, read_only=True)
    paid_bills = BillingSerializer(many=True, read_only=True)
    unpaid_bills = BillingSerializer(many=True, read_only=True)

    class Meta:
        model = models.Tenant
        fields = (
            'id', 'room', 'tenant_names', 'tenant_tin', 'tenant_main_email', 'tenant_main_phone', 'payment_date', 'payment_method',
            'membership_type', 'membership_end_time', 'rental_amount', 'business_desc', 'contract', 'roomID', 'room_name',
            'room_number', 'buildingAcronym', 'buildingID', 'total_paid_bills', 'total_unpaid_bills', 'all_billings', 'paid_bills',
            'unpaid_bills')
        extra_kwargs = {'roomID': {'read_only': True}, 'room_name': {'read_only': True},
                        'buildingID': {'read_only': True}, 'room_number': {'read_only': True},
                        'buildingAcronym': {'read_only': True}}


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Contact
        fields = ('id', 'name', 'email', 'phone', 'message')
