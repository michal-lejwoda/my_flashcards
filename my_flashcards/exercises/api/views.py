from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, CreateModelMixin
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from wagtail.models import Page

from my_flashcards.exercises.api.serializers import (LanguageCategoryPageDetailSerializer, \
                                                     LanguageCategoryPageListSerializer, SubGroupListSerializer, \
                                                     GroupExerciseListSerializer, MainGroupWithSubGroupsListSerializer,
                                                     SubGroupWithGroupExercisesListSerializer, \
                                                     PageSerializer, SubGroupWithSubGroupsPageDetailSerializer,
                                                     MainGroupWithGroupExercisePageDetailSerializer, \
                                                     MatchExerciseSerializer, MatchExerciseTextWithImageSerializer,
                                                     FillInTextExerciseWithChoicesSerializer, \
                                                     FillInTextExerciseWithPredefinedBlocksSerializer, \
                                                     FillInTextExerciseWithPredefinedBlocksWithImageDecorationSerializer, \
                                                     FillInTextExerciseWithChoicesWithImageDecorationSerializer,
                                                     ConjugationExerciseSerializer, \
                                                     ListenExerciseWithOptionsToChooseSerializer,
                                                     ListenWithManyOptionsToChooseToSingleExerciseSerializer, \
                                                     ChooseExerciseDependsOnSingleTextSerializer, \
                                                     ChooseExerciseDependsOnMultipleTextsSerializer,
                                                     MultipleExercisesSerializer)
from my_flashcards.exercises.models import LanguageCategoryPage, SubGroupWithSubGroups, \
    MainGroupWithGroupExercises, MainGroupWithSubGroups, SubGroupWithGroupExercises, PageWithPathSlugManager

exercise_serializers = {
    "MatchExercise": MatchExerciseSerializer,
    "MatchExerciseTextWithImage": MatchExerciseTextWithImageSerializer,
    "FillInTextExerciseWithChoices": FillInTextExerciseWithChoicesSerializer,
    "FillInTextExerciseWithPredefinedBlocks": FillInTextExerciseWithPredefinedBlocksSerializer,
    "FillInTextExerciseWithPredefinedBlocksWithImageDecoration": FillInTextExerciseWithPredefinedBlocksWithImageDecorationSerializer,
    "FillInTextExerciseWithChoicesWithImageDecoration": FillInTextExerciseWithChoicesWithImageDecorationSerializer,
    "ConjugationExercise": ConjugationExerciseSerializer,
    "ListenExerciseWithOptionsToChoose": ListenExerciseWithOptionsToChooseSerializer,
    "ListenWithManyOptionsToChooseToSingleExercise": ListenWithManyOptionsToChooseToSingleExerciseSerializer,
    "ChooseExerciseDependsOnMultipleTexts": ChooseExerciseDependsOnMultipleTextsSerializer,
    "ChooseExerciseDependsOnSingleText": ChooseExerciseDependsOnSingleTextSerializer,
    "MultipleExercises": MultipleExercisesSerializer
}

group_serializator = {
    "LanguageCategoryPage": LanguageCategoryPageDetailSerializer,
    "MainGroupWithSubGroups": MainGroupWithSubGroupsListSerializer,
    "MainGroupWithGroupExercises": MainGroupWithGroupExercisePageDetailSerializer,
    "SubGroupwithSubGroups": SubGroupWithSubGroupsPageDetailSerializer,
    "SubGroupWithGroupExercises": SubGroupWithGroupExercisesListSerializer,
}

subgroups = {
    "LanguageCategoryPage": "MAIN_GROUP",
    "MainGroupWithSubGroups": "SUB_GROUP",
    "SubGroupwithSubGroups": "SUB_GROUP",
    "SubGroupWithGroupExercises": "GROUP_EXERCISES",
    "MainGroupWithGroupExercises": "GROUP_EXERCISES"
}

class LanguageCategoryViewSet(ListModelMixin, RetrieveModelMixin, GenericViewSet):
    authentication_classes = []
    permission_classes = [AllowAny]
    serializer_class = LanguageCategoryPageListSerializer
    queryset = Page.objects.type(LanguageCategoryPage).live().specific()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return LanguageCategoryPageDetailSerializer
        return LanguageCategoryPageListSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            paginated_response = self.get_paginated_response(serializer.data)
            paginated_response.data['children'] = 'LANGUAGE_GROUP'
            return paginated_response

        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'children': 'LANGUAGE_GROUP',
            'count': len(serializer.data),
            'next': None,
            'previous': None,
            'results': serializer.data
        })


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
    authentication_classes = []
    permission_classes = [AllowAny]
    serializer_class = PageSerializer
    lookup_field = 'path_slug'

    def get_serializer_class(self):
        slug = self.kwargs.get('path_slug')
        page = PageWithPathSlugManager.find_page_by_path_slug(slug)

        if not page:
            raise NotFound(f"Page with path_slug '{slug}' not found")

        try:
            return group_serializator[page.__class__.__name__]
        except KeyError:
            raise NotFound(f"No serializer found for page type: {page.__class__.__name__}")

    def get_object(self):
        slug = self.kwargs.get('path_slug')
        page = PageWithPathSlugManager.find_page_by_path_slug(slug)
        if not page:
            raise NotFound(f"Page with path_slug '{slug}' not found")
        return page

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(instance, context=self.get_serializer_context())
        return Response({
            'children': subgroups[instance.__class__.__name__],
            'data': serializer.data
        })


class ExerciseViewSet(RetrieveModelMixin, CreateModelMixin, GenericViewSet):
    authentication_classes = []
    permission_classes = [AllowAny]
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
            return exercise_serializers[page.__class__.__name__]
        except KeyError:
            raise NotFound(f"No serializer found for page type: {page.__class__.__name__}")

    def create(self, request, *args, **kwargs):
        page = self.get_object()
        exercise_type = request.data.get('type')
        if exercise_type == "MultipleExercises":
            answers = request.data.get('exercises')
        else:
            answers = request.data.get('answers')
        try:
            result = page.check_answer(request.user, answers)
            return Response(result, status=status.HTTP_200_OK)
        except NotImplementedError:
            return Response({'detail': 'This exercise does not implement answer checking.'},
                            status=status.HTTP_400_BAD_REQUEST)
