from django.utils import timezone
from django.db import models

class User(models.Model):
    id = models.IntegerField(primary_key=True)
    like = models.CharField(max_length=50)
    age = models.IntegerField(null=True)
    gender = models.IntegerField(null=True)
    latitude = models.FloatField(max_length=10, null=True)
    longitude = models.FloatField(max_length=10, null=True)


class Store(models.Model):
    id = models.IntegerField(primary_key=True)
    store_name = models.CharField(max_length=50)
    branch = models.CharField(max_length=20, null=True)
    area = models.CharField(max_length=50, null=True)
    tel = models.CharField(max_length=20, null=True)
    address = models.CharField(max_length=200, null=True)
    latitude = models.FloatField(max_length=10, null=True)
    longitude = models.FloatField(max_length=10, null=True)
    category = models.CharField(max_length=200, null=True)

    @property
    def category_list(self):
        return self.category.split("|") if self.category else []
    
class Review(models.Model):
    id = models.IntegerField(primary_key=True)
    rid=models.IntegerField(null=True)
    store = models.IntegerField(null=True)
    score =  models.FloatField(max_length=10, null=True)
    content = models.CharField(max_length=500, null=True)
    reg_time = models.CharField(max_length=200, null=True)