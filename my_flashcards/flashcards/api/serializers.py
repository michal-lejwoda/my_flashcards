from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from my_flashcards.flashcards.models import Deck, Word, UserHistory

class DeckSerializerOnlyWithName(serializers.ModelSerializer):
    class Meta:
        model = Deck
        fields = ['id','name']
class WordSerializerWithDeck(serializers.ModelSerializer):
    deck_words = DeckSerializerOnlyWithName(many=True, read_only=True)

    class Meta:
        model = Word
        fields = ['id','front_side', 'back_side', 'deck_words']


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

class DeckSerializerWithAllFields(serializers.ModelSerializer):
    words = WordSerializer(many=True)
    class Meta:
        model = Deck
        fields = '__all__'
class DeckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deck
        exclude = ['words']

    def validate_name(self, value):
        user = self.context['request'].user
        if Deck.objects.filter(name=value, user=user).exists():
            raise serializers.ValidationError("Deck o tej nazwie już istnieje dla tego użytkownika.")
        return value

class SingleDeckSerializer(serializers.ModelSerializer):
    words = WordSerializer(many=True, read_only=True)

    class Meta:
        model = Deck
        fields = '__all__'


class UserHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserHistory
        fields = '__all__'

    def validate_deck(self, value):
        if not value:
            raise serializers.ValidationError(_("Field 'deck is required"))
        return value

class CreateUserHistorySerializer(serializers.Serializer):
    words = WordSerializer(many=True)
    user_history = UserHistorySerializer()
