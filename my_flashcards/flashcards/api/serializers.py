from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from my_flashcards.flashcards.models import Deck, Word


class WordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = '__all__'

    def validate_front_side(self, value):
        if value is None:
            raise serializers.ValidationError(_("The field is required"))
        if len(value) < 2:
            raise serializers.ValidationError(_("The field must contain at least 2 characters"))
        return value

    def validate_back_side(self, value):
        if len(value) < 2:
            raise serializers.ValidationError(_("The field must contain at least 2 characters"))
        return value
    def validate(self, data):
        # Dodatkowe niestandardowe walidacje można tutaj umieścić
        if data.get('front_side') == data.get('back_side'):
            raise serializers.ValidationError(_("Both sites are the same"))
        return data

class DeckSerializer(serializers.ModelSerializer):

    class Meta:
        model = Deck
        exclude = ['words']

class SingleDeckSerializer(serializers.ModelSerializer):
    words = WordSerializer(many=True, read_only=True)
    class Meta:
        model = Deck
        fields = '__all__'

