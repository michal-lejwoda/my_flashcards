from rest_framework import serializers
from wagtail.images.api.fields import ImageRenditionField
from my_flashcards.exercises.models import LanguageCategoryPage


class LanguageCategoryPageSerializer(serializers.ModelSerializer):
    image = ImageRenditionField('fill-600x400')
    class Meta:
        model = LanguageCategoryPage
        fields = ['id', 'title', 'image']

