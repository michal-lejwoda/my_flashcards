from django.http import Http404
from rest_framework.exceptions import NotFound
from rest_framework.generics import get_object_or_404
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework.viewsets import GenericViewSet
from wagtail.models import Page

from my_flashcards.exercises.api.serializers import LanguageCategoryPageDetailSerializer, \
    LanguageCategoryPageListSerializer, MainGroupListSerializer, MainGroupPageDetailSerializer, SubGroupListSerializer, \
    GroupExerciseListSerializer, MainGroupWithSubGroupsListSerializer, SubGroupWithGroupExercisesListSerializer, \
    PageSerializer, SubGroupWithSubGroupsPageDetailSerializer, MainGroupWithGroupExercisePageDetailSerializer, \
    MatchExerciseSerializer, MatchExerciseTextWithImageSerializer
from my_flashcards.exercises.models import LanguageCategoryPage, MainGroup, SubGroupWithSubGroups, \
    MainGroupWithGroupExercises, MainGroupWithSubGroups, SubGroupWithGroupExercises, ExerciseBase

exercise_serializers = {
    "MatchExercise": MatchExerciseSerializer,
    "MatchExerciseTextWithImage": MatchExerciseTextWithImageSerializer
}

group_serializator = {
    "LanguageCategoryPage": LanguageCategoryPageDetailSerializer,
    "MainGroupWithSubGroups": MainGroupWithSubGroupsListSerializer,
    "MainGroupWithGroupExercises": MainGroupWithGroupExercisePageDetailSerializer,
    "SubGroupwithSubGroups": SubGroupWithSubGroupsPageDetailSerializer,
    "SubGroupWithGroupExercises": SubGroupWithGroupExercisesListSerializer,
}


class LanguageCategoryViewSet(ListModelMixin, RetrieveModelMixin, GenericViewSet):
    serializer_class = LanguageCategoryPageListSerializer
    queryset = Page.objects.type(LanguageCategoryPage).live().specific()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return LanguageCategoryPageDetailSerializer
        return LanguageCategoryPageListSerializer


class SubGroupwithSubGroupsViewSet(RetrieveModelMixin, GenericViewSet):
    serializer_class = SubGroupListSerializer
    queryset = Page.objects.type(SubGroupWithSubGroups).live().specific()

class SubGroupwithGroupExercisesViewSet(RetrieveModelMixin, GenericViewSet):
    serializer_class = SubGroupWithGroupExercisesListSerializer
    queryset = Page.objects.type(SubGroupWithGroupExercises).live().specific()

class MainGroupwithSubGroupsViewSet(RetrieveModelMixin, GenericViewSet):
    serializer_class = MainGroupWithSubGroupsListSerializer
    queryset = Page.objects.type(MainGroupWithSubGroups).live().specific()

class MainGroupwithGroupExerciseViewSet(RetrieveModelMixin, GenericViewSet):
    serializer_class = GroupExerciseListSerializer
    queryset = Page.objects.type(MainGroupWithGroupExercises).live().specific()


class PageBySlugViewSet(RetrieveModelMixin, GenericViewSet):
    serializer_class = PageSerializer
    lookup_field = 'slug'

    def get_serializer_class(self):
        slug = self.kwargs.get('slug')
        page = get_object_or_404(Page.objects.live().specific(), slug=slug)
        try:
            return group_serializator[page.__class__.__name__]
        except KeyError:
            raise NotFound(f"No serializer found for page type: {page.__class__.__name__}")

    def get_object(self):
        slug = self.kwargs.get('slug')
        page = get_object_or_404(Page.objects.live().specific(), slug=slug)
        return page


class ExerciseViewSet(RetrieveModelMixin, GenericViewSet):
    def get_object(self):
        slug = self.kwargs.get('slug')
        pk = self.kwargs.get('pk')

        if not slug or not pk:
            raise NotFound("Both 'id' and 'slug' must be provided in the URL.")

        try:
            page = Page.objects.live().specific().get(id=pk, slug=slug)
        except Page.DoesNotExist:
            raise NotFound("No page found matching both id and slug.")

        return page

    def get_serializer_class(self):
        page = self.get_object()
        try:

            # subclasses = ExerciseBase.__subclasses__()
            # print("subco", subclasses)
            print("teasdads", exercise_serializers[page.__class__.__name__])
            return exercise_serializers[page.__class__.__name__]
        except KeyError:
            raise NotFound(f"No serializer found for page type: {page.__class__.__name__}")
