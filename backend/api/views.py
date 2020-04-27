from api import models, serializers
from rest_framework import viewsets
from rest_framework.decorators import action
from .forms import UserForm
from rest_framework.pagination import PageNumberPagination
from django.http import HttpResponse
import tfidf_cosine 
import pandas as pd
import os
from rest_framework.response import Response
import json


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
    # print("리퀘스트", request.body)
    json_data = json.loads(request.body)    
    # data=pd.read_pickle(os.path.join("../../data", "dump.pkl"))
    # print("json", json_data)
    like = json_data['likeFood']
    # print("likeFood", like)
    age = json_data['age']
    age=int(age)
    gender = json_data['gender']
    if(json_data['gender']==1):
        gender="남"
    else:
        gender="여"
    latitude = json_data['latitude']
    latitude=float(latitude)
    longitude = json_data['longitude']
    longitude=float(longitude)
    ## 추천 알고리즘 넣고
    store_list=tfidf_cosine.filtering(gender, age, latitude, longitude, like)
    return HttpResponse(store_list)



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
