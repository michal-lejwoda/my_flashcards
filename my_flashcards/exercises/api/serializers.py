from rest_framework.fields import SerializerMethodField
from wagtail.images.api.fields import ImageRenditionField
from my_flashcards.exercises.models import LanguageCategoryPage, MainGroup, SubGroup, GroupExercise
from rest_framework import serializers

group_urls = {
    "MainGroupWithSubGroups": "maingroup-with-subgroups",
    "SubGroupwithSubGroups": "subgroup-with-subgroups",
    "SubGroupWithGroupExercises": "subgroup-with-groupexercises",
    "MainGroupWithGroupExercises": "maingroup-with-groupexercise"
}

class LanguageCategoryPageListSerializer(serializers.ModelSerializer):
    flag_image = ImageRenditionField('fill-600x400')

    class Meta:
        model = LanguageCategoryPage
        fields = ['id', 'title', 'language', 'flag_image']



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

    class Meta:
        model = SubGroup
        fields = ['id', 'title', 'background_image', 'background_image_with_text']



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
    class Meta:
        model = GroupExercise
        fields = ['introduction', 'exercise_links']


class MainGroupWithGroupExercisePageDetailSerializer(serializers.ModelSerializer):
    children = SerializerMethodField()

    def get_children(self, obj):
        children = obj.get_children().live().specific()
        return GroupExerciseListSerializer(children, many=True).data
