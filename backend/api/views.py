from api import models, serializers
from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from haversine import haversine, Unit


class SmallPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 50


class StoreViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.StoreSerializer
    pagination_class = SmallPagination

    def get_queryset(self):
        name = self.request.query_params.get("name", "")
        queryset = (
            models.Store.objects.all().filter(store_name__contains=name).order_by("id")
        )
        return queryset

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.UserSerializer
    pagination_class = SmallPagination

    def get_queryset(self):
        name = self.request.query_params.get("name", "")
        queryset = (
            models.User.objects.all().order_by("id")
        )
        return queryset

class NearInfoView(View):
    def get(self, request):
        try:
            longitude = float(request.GET.get('longitude', None))
            latitude  = float(request.GET.get('latitude', None))
            
            #몇키로 이내 필터링할건지 값( 입력값으로 받아도 될듯)
            NearValue = 2

            #포지션이 내 위치
            position  = (latitude,longitude)

            #1km에 해당하는게 0.01, 0.015라는 의미임
            condition = (
                Q(latitude__range  = (latitude - 0.01, latitude + 0.01)) |
                Q(longitude__range = (longitude - 0.015, longitude + 0.015))
            )

            store_infos = (
                storeInfo
                .objects
                .filter(condition)
            )

            
            near_store_infos = [info for info in store_infos
                                      if haversine(position, (info.latitude, info.longitude)) <= NearValue]

     