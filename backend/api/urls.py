from django.conf.urls import url
from rest_framework_swagger.views import get_swagger_view
from rest_framework.routers import DefaultRouter
from api import views
from drf_yasg import openapi

schema_view = get_swagger_view(title='Swagger API')

router = DefaultRouter(
    trailing_slash=False
)
router.register(r"stores", views.StoreViewSet, basename="stores")
router.register(r'user', views.UserViewSet, basename="user")
urlpatterns = [
    url(r'swagger-ui.html', schema_view),

]
## http://127.0.0.1:8000/api/swagger-ui.html 로 접속하면 가능해짐.
## 다음 명령어 실행
## python manage.py runserver

urlpatterns += router.urls
