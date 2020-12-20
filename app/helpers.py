from .models import Building
from rest_framework.response import Response


def get_building_name(id):
    try:
        query_set = Building.objects.get(id=id)
        return query_set
    except Building.DoesNotExist as e:
        return Response({"error": "Building oject not found"}, status=404)
