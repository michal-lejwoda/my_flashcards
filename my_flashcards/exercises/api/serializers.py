from rest_framework import serializers
from wagtail.images.api.fields import ImageRenditionField
from my_flashcards.exercises.models import LanguageCategoryPage


class LanguageCategoryPageSerializer(serializers.ModelSerializer):
    image = ImageRenditionField('fill-600x400')

    class Meta:
        model = LanguageCategoryPage
        fields = ['id', 'title', 'image', 'number_of_childrens']
        def get_number_of_childrens(self,obj):
            return obj.get_children().live().count()


class GroupSerializer(serializers.ModelSerializer):
    image = ImageRenditionField('fill-600x400')
    number_of_types = serializers.SerializerMethodField()
    number_of_exercises = serializers.SerializerMethodField()

    def get_number_of_types(self, obj):
        if obj.is_children_group:
            return obj.get_children().live().count()
        return None

    def get_number_of_exercises(self, obj):
        if not obj.is_children_exercise:
            return None

        total = 0
        for child in obj.get_children().live():
            total += child.get_children().live().count()
        return total


