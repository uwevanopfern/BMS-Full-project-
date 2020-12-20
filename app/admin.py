from django.contrib import admin
from .models import User, Building, Floor, Block, Room, PaymentType, MembershipType, Contact, Booking, Tenant, Billing

# Register your models here.
admin.site.register(User)
admin.site.register(Building)
admin.site.register(Floor)
admin.site.register(Block)
admin.site.register(Room)
admin.site.register(PaymentType)
admin.site.register(MembershipType)
admin.site.register(Contact)
admin.site.register(Booking)
admin.site.register(Tenant)
admin.site.register(Billing)
