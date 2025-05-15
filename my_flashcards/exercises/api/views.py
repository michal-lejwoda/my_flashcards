from rest_framework.generics import GenericAPIView
from rest_framework.mixins import ListModelMixin
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet
from wagtail.models import Page

from my_flashcards.exercises.models import LanguageCategoryPage
from my_flashcards.exercises.api.serializers import LanguageCategoryPageSerializer


# Create your views here.

class LanguageCategoryListAPIView(ListModelMixin, GenericViewSet):
    serializer_class = LanguageCategoryPageSerializer
    queryset = LanguageCategoryPage.objects.all()


    def get_queryset(self):
        print("get_queryset")
        languages = Page.objects.type(LanguageCategoryPage).live().specific()
        print(languages)
        return languages
#
