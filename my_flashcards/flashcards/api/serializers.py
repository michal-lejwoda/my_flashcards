from rest_framework import serializers

from my_flashcards.flashcards.models import Deck, Word


class WordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = '__all__'

class DeckSerializer(serializers.ModelSerializer):

    class Meta:
        model = Deck
        exclude = ['words']

class SingleDeckSerializer(serializers.ModelSerializer):
    words = WordSerializer(many=True, read_only=True)
    class Meta:
        model = Deck
        fields = '__all__'

