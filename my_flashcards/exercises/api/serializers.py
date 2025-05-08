from rest_framework import serializers
from wagtail.images.api.fields import ImageRenditionField
from my_flashcards.exercises.models import LanguageCategoryPage


class LanguageCategoryPageSerializer(serializers.ModelSerializer):
    image = ImageRenditionField('fill-600x400')
    children_count = serializers.SerializerMethodField()

    class Meta:
        model = LanguageCategoryPage
        fields = ['id', 'title', 'image', 'children_count']

    def get_children_count(self, obj):
        print("get_children_count", obj.get_children().live())
        return obj.get_children().live().count()



