from api import models, serializers
from rest_framework import viewsets
from rest_framework.decorators import action
from .forms import UserForm
from rest_framework.pagination import PageNumberPagination
from django.http import HttpResponse
import practice 
import pandas as pd
import os
from rest_framework.response import Response


class SmallPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 50


class StoreViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.StoreSerializer
    pagination_class = SmallPagination

    def get_queryset(self):
        print('=====================================')
        name = self.request.query_params.get("name", "")
        queryset = (
            models.Store.objects.all().filter(store_name__contains=name).order_by("id")
        )
        return queryset


def usersearch(request):
    # data=pd.read_pickle(os.path.join("../../data", "dump.pkl"))
    like = request.POST['like']
    age = int(request.POST['age'])
    gender = int(request.POST['gender'])
    latitude = float(request.POST['latitude'])
    longitude = float(request.POST['longitude'])
    arr1=[like,age,gender,latitude,longitude]
    ## 추천 알고리즘 넣고
    arr=practice.main(like,age,gender,latitude,longitude)
    for i in arr[1]:
        if len(arr[0]) < 10:
            if i not in arr[0]:
                arr[0].append(i)
        else:
            break
    store_list=[]
    for x in arr[0]:
        qs = models.Store.objects.filter(id=x)
        store_list += list(qs.values())
    print(store_list)
    ## 배열 형식 음식점 [[150,0.8],[]]
    return HttpResponse(store_list)

# class UserViewSet(viewsets.ModelViewSet):
#     serializer_class = serializers.UserSerializer
#     pagination_class = SmallPagination
#     queryset=models.User

#     @action(detail=True, methods=['post'])
#     def set_public(self, request, pk):
#         print("안녕",self)
#         # queryset = (
#         #     models.User.objects.all().order_by("id")
#         # )
#         return queryset


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.ReviewSerializer
    pagination_class = SmallPagination
    def get_queryset(self):
        store= self.request.query_params.get("store")
        # print("테스트 " ,store)
        queryset = (
            models.Review.objects.all().filter(store=store).order_by("reg_time")
        )
        return queryset

class ReviewViewSet_findStore(viewsets.ModelViewSet):
    serializer_class = serializers.ReviewSerializer
    pagination_class = SmallPagination

    def get_queryset(self):
        store= self.request.query_params.get("store","")
        # store= self.kwargs['store']
        if store:
            queryset = Review.objects.all().filter(store=store).order_by("reg_time")
        
        return queryset
