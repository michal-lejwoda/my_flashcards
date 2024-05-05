from django.db.models import Case, When, Value, BooleanField
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from my_flashcards.flashcards.choices import POSSIBLE_RESULTS
from my_flashcards.flashcards.models import Deck, Word, UserHistory

class DeckSerializerOnlyWithName(serializers.ModelSerializer):
    class Meta:
        model = Deck
        fields = ['id','name']
class WordSerializerWithDeck(serializers.ModelSerializer):
    # deck_words = DeckSerializerOnlyWithName(many=True, read_only=True)

    class Meta:
        model = Word
        fields = ['id','front_side', 'back_side', 'deck_words']

class WordUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = ['is_correct', 'next_learn', 'level']


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
        if data.get('front_side') == data.get('back_side'):
            raise serializers.ValidationError(_("Both sites are the same"))
        return data

class DeckSerializerWithAllFields(serializers.ModelSerializer):
    words = WordSerializer(many=True)
    class Meta:
        model = Deck
        fields = '__all__'
class DeckSerializer(serializers.ModelSerializer):
    num_of_words_to_learn = serializers.SerializerMethodField()
    num_of_wrong_words = serializers.SerializerMethodField()
    class Meta:
        model = Deck
        exclude = ['words']

    def get_num_of_words_to_learn(self, obj):
        # return obj.words.filter(is_correct=True, next_learn__lte=timezone.now()).count()
        words = obj.words.annotate(
            to_learn=Case(
                When(is_correct=True, next_learn__lte=timezone.now(), then=Value(True)),
                default=Value(False),
                output_field=BooleanField()
            )
        ).filter(to_learn=True).count()
        return words

    def get_num_of_wrong_words(self, obj):
        # return obj.words.filter(is_correct=False).count()
        words = obj.words.annotate(
            wrong_words=Case(
                When(is_correct=False, then=Value(True)),
                default=Value(False),
                output_field=BooleanField()
            )
        ).filter(wrong_words=True).count()
        return words

    def validate_name(self, value):
        user = self.context['request'].user
        if Deck.objects.filter(name=value, user=user).exists():
            raise serializers.ValidationError("Deck o tej nazwie już istnieje dla tego użytkownika.")
        return value

class SingleDeckSerializerAllWords(serializers.ModelSerializer):
    words = WordSerializer(many=True)
    class Meta:
        model = Deck
        fields = ['id', 'words']
class SingleDeckSerializer(serializers.ModelSerializer):
    words_to_learn = serializers.SerializerMethodField(read_only=True)
    wrong_words_to_learn = serializers.SerializerMethodField(read_only=True)
    #TODO backe here
    class Meta:
        model = Deck
        exclude = ('words',)

    def get_words_to_learn(self, obj):
        words = obj.words.annotate(
            to_learn=Case(
                When(is_correct=True, next_learn__lte=timezone.now(), then=Value(True)),
                default=Value(False),
                output_field=BooleanField()
            )
        ).filter(to_learn=True)
        serializer = WordSerializer(instance=words, many=True)
        return serializer.data

    def get_wrong_words_to_learn(self, obj):
        words = obj.words.annotate(
                wrong_words=Case(
                When(is_correct=False, then=Value(True)),
                default=Value(False),
                output_field=BooleanField()
            )
        ).filter(wrong_words=True)
        serializer = WordSerializer(instance=words, many=True)
        return serializer.data


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
