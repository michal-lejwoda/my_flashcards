from rest_framework.fields import SerializerMethodField
from wagtail.images.api.fields import ImageRenditionField
from my_flashcards.exercises.models import LanguageCategoryPage, MainGroup, SubGroup
from rest_framework import serializers


class LanguageCategoryPageListSerializer(serializers.ModelSerializer):
    flag_image = ImageRenditionField('fill-600x400')

    class Meta:
        model = LanguageCategoryPage
        fields = ['id', 'title', 'language', 'flag_image']



class LanguageCategoryPageDetailSerializer(serializers.ModelSerializer):
    children = SerializerMethodField()

    def get_children(self, obj):
        children = obj.get_children().live().specific().type(MainGroup)
        return MainGroupListSerializer(children, many=True).data

    class Meta:
        model = LanguageCategoryPage
        fields = ['id', 'title', 'language', 'children']



class MainGroupListSerializer(serializers.ModelSerializer):
    background_image = ImageRenditionField('fill-600x400')
    background_image_with_text = ImageRenditionField('fill-600x400')
    class Meta:
        model = MainGroup
        fields = ['id', 'title', 'background_image', 'background_image_with_text']

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


# class GroupSerializer(serializers.ModelSerializer):
#     image = ImageRenditionField('fill-600x400')
#     number_of_types = serializers.SerializerMethodField()
#     number_of_exercises = serializers.SerializerMethodField()
#
#     def get_number_of_types(self, obj):
#         if obj.is_children_group:
#             return obj.get_children().live().count()
#         return None
#
#     def get_number_of_exercises(self, obj):
#         if not obj.is_children_exercise:
#             return None
#
#         total = 0
#         for child in obj.get_children().live():
#             total += child.get_children().live().count()
#         return total
#
#
