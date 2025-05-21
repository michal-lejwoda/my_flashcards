from rest_framework.fields import SerializerMethodField
from wagtail.images.api.fields import ImageRenditionField
from wagtail.models import Page

from my_flashcards.exercises.models import LanguageCategoryPage, MainGroup, SubGroup, GroupExercise, \
    MainGroupWithSubGroups, SubGroupWithGroupExercises, ExerciseBase
from rest_framework import serializers



group_urls = {
    "LanguageCategoryPage": "maingroup-with-subgroups",
    "MainGroupWithSubGroups": "maingroup-with-subgroups",
    "SubGroupwithSubGroups": "subgroup-with-subgroups",
    "SubGroupWithGroupExercises": "subgroup-with-groupexercises",
    "MainGroupWithGroupExercises": "maingroup-with-groupexercise"
}

class LanguageCategoryPageListSerializer(serializers.ModelSerializer):
    flag_image = ImageRenditionField('fill-600x400')
    url = SerializerMethodField()

    def get_url(self, obj):
        return "/api/languages/{}".format(obj.id)

    class Meta:
        model = LanguageCategoryPage
        fields = ['id', 'title', 'language', 'flag_image', 'url']



class LanguageCategoryPageDetailSerializer(serializers.ModelSerializer):
    children = SerializerMethodField()

    def get_children(self, obj):
        children = obj.get_children().live().specific()
        return MainGroupListSerializer(children, many=True).data

    class Meta:
        model = LanguageCategoryPage
        fields = ['id', 'title', 'language', 'children']



class MainGroupListSerializer(serializers.ModelSerializer):
    background_image = ImageRenditionField('fill-600x400')
    background_image_with_text = ImageRenditionField('fill-600x400')
    url = serializers.SerializerMethodField()

    def get_url(self, obj):
        name = group_urls[obj.__class__.__name__]
        return "/api/{}/{}".format(name, obj.id)


    class Meta:
        model = MainGroup
        fields = ['id', 'title','background_image', 'url', 'background_image_with_text']

class MainGroupPageDetailSerializer(serializers.ModelSerializer):
    children = SerializerMethodField()

    def get_children(self, obj):
        children = obj.get_children().live().specific()
        return SubGroupListSerializer(children, many=True).data
    class Meta:
        model = MainGroup
        fields = ['id', 'title', 'children']

class SubGroupListSerializer(serializers.ModelSerializer):
    background_image = ImageRenditionField('fill-600x400')
    background_image_with_text = ImageRenditionField('fill-600x400')
    url = serializers.SerializerMethodField()

    def get_url(self, obj):
        name = group_urls[obj.__class__.__name__]
        return "/api/{}/{}".format(name, obj.id)

    class Meta:
        model = SubGroup
        fields = ['id', 'title', 'background_image', 'background_image_with_text', 'url']



class SubGroupPageDetailSerializer(serializers.ModelSerializer):
    children = SerializerMethodField()

    def get_children(self, obj):
        children = obj.get_children().live().specific()
        return SubGroupListSerializer(children, many=True).data


class SubGroupWithSubGroupsPageDetailSerializer(serializers.ModelSerializer):
    def get_children(self, obj):
        children = obj.get_children().live()
        return SubGroupListSerializer(children, many=True).data


class GroupExerciseListSerializer(serializers.ModelSerializer):
    children = SerializerMethodField()

    def get_children(self, obj):
        children = obj.get_children().live().specific()
        return ExerciseListSerializer(children, many=True).data

    class Meta:
        model = GroupExercise
        fields = ['introduction', 'title', 'children']


class MainGroupWithGroupExercisePageDetailSerializer(serializers.ModelSerializer):
    children = SerializerMethodField()

    def get_children(self, obj):
        children = obj.get_children().live().specific()
        return GroupExerciseListSerializer(children, many=True).data


class MainGroupWithSubGroupsListSerializer(serializers.ModelSerializer):
    children = SerializerMethodField()

    def get_children(self, obj):
        children = obj.get_children().live().specific()
        return SubGroupListSerializer(children, many=True).data

    class Meta:
        model = MainGroupWithSubGroups
        fields = ['id', 'title', 'children']


class SubGroupWithGroupExercisesListSerializer(serializers.ModelSerializer):
    children = SerializerMethodField()

    def get_children(self, obj):
        children = obj.get_children().live().specific()
        return GroupExerciseListSerializer(children, many=True).data

    class Meta:
        model = SubGroupWithGroupExercises
        fields = ['id', 'title', 'children']

class ExerciseListSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    title = serializers.CharField()
    url = serializers.SerializerMethodField()

    def get_url(self, obj):
        return "/api/exercises/{}".format(obj.id)

    class Meta:
        model = ExerciseBase
        fields = ['id', 'title', 'url']

class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ['id', 'title', 'slug']
