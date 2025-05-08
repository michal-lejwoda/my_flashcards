from rest_framework import serializers


class LanguageCategoryPageSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField()

