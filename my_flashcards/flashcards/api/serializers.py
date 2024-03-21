from rest_framework import serializers

from my_flashcards.flashcards.models import Deck


class DeckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deck
        fields = '__all__'
