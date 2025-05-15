from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework.viewsets import GenericViewSet
from wagtail.models import Page

from my_flashcards.exercises.api.serializers import LanguageCategoryPageDetailSerializer, \
    LanguageCategoryPageListSerializer, MainGroupListSerializer, MainGroupPageDetailSerializer
from my_flashcards.exercises.models import LanguageCategoryPage, MainGroup


# Create your views here.

class LanguageCategoryViewSet(ListModelMixin, RetrieveModelMixin, GenericViewSet):
    serializer_class = LanguageCategoryPageListSerializer
    queryset = Page.objects.type(LanguageCategoryPage).live().specific()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return LanguageCategoryPageDetailSerializer
        return LanguageCategoryPageListSerializer


class MainGroupViewSet(ListModelMixin, RetrieveModelMixin, GenericViewSet):
    serializer_class = MainGroupListSerializer
    queryset = Page.objects.type(MainGroup).live().specific()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return MainGroupPageDetailSerializer
        return MainGroupListSerializer



