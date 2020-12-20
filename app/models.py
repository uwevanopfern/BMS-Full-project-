# pylint: disable=import-error
# pylint: disable=no-name-in-module
# pylint: disable=no-member
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models


# Create your models here.

class Building(models.Model):
    name = models.CharField(max_length=255, unique=True)
    acronym = models.CharField(max_length=50, unique=True)
    email = models.CharField(max_length=100, unique=True, blank=True)
    contact = models.CharField(max_length=100, blank=True)
    address = models.CharField(max_length=255)
    website = models.CharField(max_length=100, blank=True)
    avatar = models.ImageField(upload_to='avatars', blank=True, null=True)

    @property
    def managers(self):
        return self.user_set.all().filter(is_manager=True)

    @property
    def total_managers(self):
        return self.user_set.filter(is_manager=True).count()

    @property
    def employees(self):
        return self.user_set.all().filter(is_employee=True)

    @property
    def total_employees(self):
        return self.user_set.filter(is_employee=True).count()

    @property
    def floors(self):
        return self.floor_set.all()

    @property
    def total_floors(self):
        return self.floor_set.count

    def __str__(self):
        return self.name


class Floor(models.Model):
    building = models.ForeignKey('Building', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    number = models.IntegerField()

    @property
    def blocks(self):
        return self.block_set.all()

    @property
    def total_blocks(self):
        return self.block_set.count

    @property
    def occupied_rooms(self):
        return self.room_set.all().filter(is_occupied=True)

    @property
    def available_rooms(self):
        return self.room_set.all().filter(is_occupied=False)

    @property
    def total_rooms(self):
        return self.room_set.count

    @property
    def building_name(self):
        return self.building.name

    @property
    def building_acronym(self):
        return self.building.acronym

    def __str__(self):
        return self.name


class Block(models.Model):
    floor = models.ForeignKey('Floor', on_delete=models.CASCADE)
    name = models.CharField(max_length=100, default='Main Block')
    number = models.IntegerField(default=1)

    @property
    def floor_name(self):
        return self.floor.name

    def __str__(self):
        return self.name


class Room(models.Model):
    block = models.ForeignKey(
        'Block', on_delete=models.CASCADE, blank=True, null=True)
    floor = models.ForeignKey('Floor', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    number = models.CharField(max_length=100)
    is_occupied = models.BooleanField(default=False)
    price = models.IntegerField(default=0)

    @property
    def bookings(self):
        return self.booking_set.all()

    @property
    def total_bookings(self):
        return self.booking_set.count

    @property
    def block_name(self):
        return self.block.name

    @property
    def buildingID(self):
        return self.floor.building.id

    @property
    def floor_name(self):
        return self.floor.name

    def __str__(self):
        return self.name


class Booking(models.Model):
    room = models.ForeignKey(
        'Room', on_delete=models.CASCADE, blank=True, null=True)
    client_name = models.CharField(max_length=100)
    client_email = models.CharField(max_length=100, unique=True)
    client_phone = models.CharField(max_length=100)
    client_address = models.CharField(max_length=100)
    business_desc = models.TextField()
    is_confirmed = models.BooleanField(default=False)

    @property
    def buildingAcronym(self):
        return self.room.floor.building.acronym

    @property
    def roomID(self):
        return self.room.id

    @property
    def room_name(self):
        return self.room.name

    @property
    def room_number(self):
        return self.room.number

    def __str__(self):
        return self.client_name


class PaymentType(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class MembershipType(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class Tenant(models.Model):
    room = models.ForeignKey('Room', on_delete=models.CASCADE)
    tenant_names = models.TextField()  # put many names of all tenants in the room
    tenant_tin = models.CharField(max_length=100, unique=True)
    tenant_main_email = models.CharField(
        max_length=100, unique=True, blank=True, null=True)  # main mns who in charge
    tenant_main_phone = models.CharField(
        max_length=200, blank=True, null=True)  # main means who in charge
    # every month or 3 months(term), year e.t.c
    payment_date = models.CharField(max_length=200, blank=True, null=True)
    payment_method = models.CharField(max_length=200, blank=True, null=True)
    membership_type = models.CharField(
        max_length=200, default='Not a member', blank=True, null=True)
    membership_end_time = models.CharField(
        max_length=200, blank=True, null=True)
    rental_amount = models.IntegerField(default=0)
    contract = models.FileField(upload_to='contracts')
    business_desc = models.TextField()

    @property
    def all_billings(self):
        return self.billing_set.all()

    @property
    def paid_bills(self):
        return self.billing_set.all().filter(is_paid=True)

    @property
    def unpaid_bills(self):
        return self.billing_set.all().filter(is_paid=False)

    @property
    def total_paid_bills(self):
        return self.billing_set.all().filter(is_paid=True).count()

    @property
    def total_unpaid_bills(self):
        return self.billing_set.all().filter(is_paid=False).count()

    @property
    def roomID(self):
        return self.room.id

    @property
    def buildingAcronym(self):
        return self.room.floor.building.acronym

    @property
    def buildingID(self):
        return self.room.floor.building.id

    @property
    def room_name(self):
        return self.room.name

    @property
    def room_number(self):
        return self.room.number

    def __str__(self):
        return self.tenant_names


class Billing(models.Model):
    tenant = models.ForeignKey(
        'Tenant', on_delete=models.CASCADE, blank=True, null=True)
    building = models.ForeignKey(
        'Building', on_delete=models.CASCADE, default=0)
    invoice_no = models.TextField(default=0)
    ebm_invoice = models.CharField(max_length=200)
    ebm_receipt_create_on = models.DateField()
    sub_total = models.IntegerField(default=0)
    tax_rate = models.IntegerField(default=0)
    tax_amount = models.IntegerField(default=0)
    total = models.IntegerField(default=0)
    is_paid = models.BooleanField(default=True)

    class Meta:
        ordering = ["-id"]

    @property
    def tenantID(self):
        return self.tenant.id

    @property
    def tenant_name(self):
        return self.tenant.tenant_names

    def __str__(self):
        return self.tenant.tenant_names


class Contact(models.Model):
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=100)
    phone = models.CharField(max_length=100)
    message = models.TextField()

    def __str__(self):
        return self.name


class UserManager(BaseUserManager):
    """ Helps django to work with our custom user model"""

    def create_new(self, email, name, password=None):
        """" Create a new user profile object  """

        if not email:
            raise ValueError('User must have an email address')

        if not name:
            raise ValueError('User must have a name')

        # normalize the email address by lower casing domain part of it, validate if email is in the standard format.
        email = self.normalize_email(email)
        user = self.model(email=email, name=name)

        # set_password encrypt our password
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, name, password):
        """" Create a new super user with given details """

        user = self.create_new(email, name, password)

        user.is_superuser = True
        user.is_staff = True

        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    """ User model"""

    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=True)
    is_employee = models.BooleanField(default=False, blank=True, null=True)
    is_manager = models.BooleanField(default=False, blank=True, null=True)
    building = models.ForeignKey(
        'Building', on_delete=models.CASCADE, blank=True, null=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    @property
    def building_name(self):
        return self.building.name

    @property
    def buildingId(self):
        return self.building.id

    @property
    def building_acronym(self):
        return self.building.acronym

    def get_full_name(self):
        """ Used to get full name of user """
        return self.name

    def get_short_name(self):
        """ Used to get short name of user """

        return self.name

    def __str__(self):
        """ Used to convert django object into a string """

        return self.name
