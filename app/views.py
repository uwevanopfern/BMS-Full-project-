# pylint: disable=import-error
# pylint: disable=no-name-in-module
# pylint: disable=no-member
import uuid
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import filters
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Building, Floor, Block, Room, Booking, PaymentType, MembershipType, Billing, Tenant, Contact
from .helpers import get_building_name
from .serializers import BuildingSerializer, FloorSerializer, BlockSerializer, \
    RoomSerializer, UserSerializer, BookingSerializer, PaymentTypeSerializer, MembershipTypeSerializer, \
    BillingSerializer, TenantSerializer, ContactSerializer


# Create your views here.

class BuildingViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = BuildingSerializer
    queryset = Building.objects.all().order_by('-id')

    filter_backends = (filters.SearchFilter,)
    search_fields = ('name', 'acronym', 'address')


@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_floors_of_building(request, building_id):
    floors = Floor.objects.all().order_by('-id')
    floors_of_building = floors.filter(building__id=building_id)
    serializer = FloorSerializer(floors_of_building, many=True)
    return JsonResponse({"response": serializer.data}, status=200)


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_floor(request):
    if request.method == "POST":
        serializer = FloorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({"response": serializer.data}, status=201)
        else:
            return JsonResponse({"response": serializer.errors}, status=400)


class FloorDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, id):

        try:
            return Floor.objects.get(id=id)
        except Floor.DoesNotExist as e:
            return Response({"error": "Given object not found"}, status=404)

    def get(self, request, floor_id=None):

        instance = self.get_object(floor_id)
        serializer = FloorSerializer(instance)
        return Response(serializer.data)

    def put(self, request, floor_id=None):
        incoming_data = request.data
        instance = self.get_object(floor_id)
        serializer = FloorSerializer(instance, data=incoming_data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)

    def delete(self, request, floor_id=None):
        instance = self.get_object(floor_id)
        instance.delete()
        return Response({"result": "Data deleted"}, status=204)


class BlockViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = BlockSerializer
    queryset = Block.objects.all().order_by('-id')

    filter_backends = (filters.SearchFilter,)
    search_fields = 'name'


@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_blocks_of_building(request, building_id):
    blocks = Block.objects.all().order_by('-id')
    blocks_of_building = blocks.filter(floor__building__id=building_id)
    serializer = BlockSerializer(blocks_of_building, many=True)
    return JsonResponse({"response": serializer.data}, status=200)


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_block(request):
    if request.method == "POST":
        serializer = BlockSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({"response": serializer.data}, status=201)
        else:
            return JsonResponse({"response": serializer.errors}, status=400)


class BlockDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, id):

        try:
            return Block.objects.get(id=id)
        except Block.DoesNotExist as e:
            return Response({"error": "Given object not found"}, status=404)

    def get(self, request, block_id=None):

        instance = self.get_object(block_id)
        serializer = BlockSerializer(instance)
        return Response(serializer.data)

    def put(self, request, block_id=None):
        incoming_data = request.data
        instance = self.get_object(block_id)
        serializer = BlockSerializer(instance, data=incoming_data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)

    def delete(self, request, block_id=None):
        instance = self.get_object(block_id)
        instance.delete()
        return Response({"result": "Data deleted"}, status=204)


@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_rooms_of_building(request, building_id):
    rooms = Room.objects.all().order_by('-id')
    rooms_of_building = rooms.filter(floor__building__id=building_id)
    serializer = RoomSerializer(rooms_of_building, many=True)
    return JsonResponse({"response": serializer.data}, status=200)


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_room(request):
    if request.method == "POST":
        serializer = RoomSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({"response": serializer.data}, status=201)
        else:
            return JsonResponse({"response": serializer.errors}, status=400)


class RoomDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, id):

        try:
            return Room.objects.get(id=id)
        except Room.DoesNotExist as e:
            return Response({"error": "Given object not found"}, status=404)

    def get(self, request, room_id=None):

        instance = self.get_object(room_id)
        serializer = RoomSerializer(instance)
        return Response(serializer.data)

    def put(self, request, room_id=None):
        incoming_data = request.data
        instance = self.get_object(room_id)
        serializer = RoomSerializer(instance, data=incoming_data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)

    def delete(self, request, room_id=None):
        instance = self.get_object(room_id)
        instance.delete()
        return Response({"result": "Data deleted"}, status=204)


@csrf_exempt
@api_view(['POST'])  # Allow only POST request
@permission_classes([IsAuthenticated])
def register_user(request):
    if request.method == "POST":
        serializer = UserSerializer(data=request.data)
        data = {}
        if serializer.is_valid():
            user = serializer.save()
            data['email'] = user.email
            data['name'] = user.name
            data['buildingId'] = user.buildingId
            data['building_name'] = user.building_name
            data['building_acronym'] = user.building_acronym
            data['is_manager'] = user.is_manager
            data['is_employee'] = user.is_employee
            return JsonResponse({"response": data}, status=200)

        else:
            data = serializer.errors
        return JsonResponse({"response": data}, status=400)


@csrf_exempt
@api_view(['POST'])  # Allow only POST request
@permission_classes([IsAuthenticated])
def login_user(request):
    if request.method == "POST":
        data = JSONParser().parse(request)
        username = data['username']
        password = data['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            serializer = UserSerializer(user)
            return JsonResponse({"response": serializer.data})
        else:
            return JsonResponse({"response": 'Invalid credentials, Try again!!'}, status=400)


@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def available_building_rooms(request, building_id):
    # Get rooms which are not occupied to display on
    # landing page to allow clients to be able to book a room
    """
    Explanations about this floor__building__id

    It is actually a relationship
    Room Model belongs to specific floor
    Floor Model belongs to specific building.
    In Room Model we can have access on Floor and In
    Floor Model we can have access on Building Model, that's why there is this notation(floor__building__id)
    :param request:
    :param building_id:
    :return:
    """
    rooms = Room.objects.filter(
        floor__building__id=building_id, is_occupied=False)
    serializer = RoomSerializer(rooms, many=True)
    return JsonResponse({"response": serializer.data}, status=200)


@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pending_bookings_of_building(request, building_id):
    all_bookings = Booking.objects.all().order_by('-id')
    bookings_of_building = all_bookings.filter(
        room__floor__building__id=building_id, is_confirmed=False)
    serializer = BookingSerializer(bookings_of_building, many=True)
    return JsonResponse({"response": serializer.data}, status=200)


@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_confirmed_bookings_of_building(request, building_id):
    all_bookings = Booking.objects.all().order_by('-id')
    bookings_of_building = all_bookings.filter(
        room__floor__building__id=building_id, is_confirmed=True)
    serializer = BookingSerializer(bookings_of_building, many=True)
    return JsonResponse({"response": serializer.data}, status=200)


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_booking(request):
    if request.method == "POST":
        serializer = BookingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({"response": serializer.data}, status=201)
        else:
            return JsonResponse({"response": serializer.errors}, status=400)


class BookingDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, id):

        try:
            return Booking.objects.get(id=id)
        except Booking.DoesNotExist as e:
            return Response({"error": "Given object not found"}, status=404)

    def get(self, request, booking_id=None):

        instance = self.get_object(booking_id)
        serializer = BookingSerializer(instance)
        return Response(serializer.data)

    def patch(self, request, booking_id=None):
        """
        if we want to make partial update (patch)
        we will do the following in serializer initialization
        serializer = TaskSerializer(instance, data=incoming_data, partial=True)
        partial will tell django rest and serializer that update is going to be made is not updating the whole fields
        instead it will update some fields in even model
        """
        incoming_data = request.data
        instance = self.get_object(booking_id)
        serializer = BookingSerializer(
            instance, data=incoming_data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)

    def delete(self, request, booking_id=None):
        instance = self.get_object(booking_id)
        instance.delete()
        return Response({"result": "Data deleted"}, status=204)


@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def count_totals(request, building_id, key):
    if key == 'PENDING_BOOKING':
        all_bookings = Booking.objects.all().order_by('-id')
        total_confirmed_bookings = all_bookings.filter(room__floor__building__id=building_id,
                                                       is_confirmed=False).count()
        return JsonResponse({"total": total_confirmed_bookings}, status=200)
    elif key == 'CONFIRMED_BOOKING':
        all_bookings = Booking.objects.all().order_by('-id')
        total_confirmed_bookings = all_bookings.filter(
            room__floor__building__id=building_id, is_confirmed=True).count()
        return JsonResponse({"total": total_confirmed_bookings}, status=200)

    elif key == 'TENANTS':
        all_tenants = Tenant.objects.all().order_by('-id')
        total_tenants = all_tenants.filter(
            room__floor__building__id=building_id).count()
        return JsonResponse({"total": total_tenants}, status=200)

    elif key == 'PAID_BILLS':
        all_bills = Billing.objects.all().order_by('-id')
        total_bills = all_bills.filter(
            building__id=building_id, is_paid=True).count()
        return JsonResponse({"total": total_bills}, status=200)

    elif key == 'UNPAID_BILLS':
        all_bills = Billing.objects.all().order_by('-id')
        total_bills = all_bills.filter(
            building__id=building_id, is_paid=False).count()
        return JsonResponse({"total": total_bills}, status=200)
    else:
        return JsonResponse({"response": 'Invalid key input'}, status=400)


class PaymentTypeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentTypeSerializer
    queryset = PaymentType.objects.all().order_by('-id')


class MembershipTypeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = MembershipTypeSerializer
    queryset = MembershipType.objects.all().order_by('-id')


class BillingViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = BillingSerializer

    filter_backends = (filters.SearchFilter,)
    search_fields = ('tenant__tenant_names', 'invoice_no', 'ebm_invoice')

    def get_queryset(self, building_id=None):
        building_id = self.request.query_params.get('building_id')
        queryset = Billing.objects.all().filter(
            building__id=building_id).order_by('-id')

        return queryset

    def perform_create(self, serializer):
        building_id = self.request.data['building']
        data = get_building_name(building_id)
        name = (data.acronym)
        # Get key in json object of acronym, they are other keys(columns) of building such as: name, email, address, website, etc...
        name_with_removed_space = name.replace(" ", "")
        upper_case_name = name_with_removed_space.upper()
        building_name = upper_case_name

        total = self.request.data['total']
        tax_rate = self.request.data['tax_rate']
        tax_amount = int(total) * int(tax_rate) / 100
        sub_total = int(total) - int(tax_amount)
        invoice_number = building_name+uuid.uuid4().hex[:8].upper()
        serializer.save(sub_total=sub_total,
                        tax_amount=tax_amount, invoice_no=invoice_number)

    def perform_update(self, serializer):
        total = self.request.data['total']
        tax_rate = self.request.data['tax_rate']
        ebm_invoice = self.request.data['ebm_invoice']
        tax_amount = int(total) * int(tax_rate) / 100
        sub_total = int(total) - int(tax_amount)
        serializer.save(sub_total=sub_total,
                        tax_amount=tax_amount, ebm_invoice=ebm_invoice)


class TenantViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TenantSerializer

    filter_backends = (filters.SearchFilter,)
    search_fields = ('room__name', 'tenant_names',
                     'tenant_tin', 'business_desc')

    def get_queryset(self):
        building_id = self.request.query_params.get('building_id')
        queryset = Tenant.objects.all().filter(
            room__floor__building__id=building_id).order_by('-id')
        return queryset


class ContactViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ContactSerializer
    queryset = Contact.objects.all().order_by('-id')


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def test(request):
    if request.method == "POST":
        data = JSONParser().parse(request)
        building_id = data['building_id']
        data = get_building_name(building_id)
        serializer = BuildingSerializer(data)
        # Get key in json object of acronym, they are other keys(columns) of building such as: name, email, address, website, etc...
        name = serializer.data['acronym']
        name_with_removed_space = name.replace(" ", "")
        upper_case_name = name_with_removed_space.upper()
        return Response(upper_case_name+"ME")
