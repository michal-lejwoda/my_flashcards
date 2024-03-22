from rest_framework import serializers

from my_flashcards.flashcards.models import Deck, Word


class WordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = '__all__'
        # error_messages = {
        #     'front_side': {
        #         'required': 'To pole jest wymagane.',
        #         'blank': 'To pole nie może być puste.',
        #         'max_length': 'To pole może zawierać maksymalnie 200 znaków.'
        #     }
        # }
    #TODO BAck here
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['front_side'].error_messages['required'] = 'To pole jest wymagane.'
        self.fields['front_side'].error_messages['blank'] = 'To pole nie może być puste.'
        self.fields['front_side'].error_messages['max_length'] = 'To pole może zawierać maksymalnie {max_length} znaków.'
        self.fields['back_side'].error_messages['required'] = 'To pole jest wymagane.'
        self.fields['back_side'].error_messages['blank'] = 'To pole nie może być puste.'
        self.fields['back_side'].error_messages[
            'max_length'] = 'To pole może zawierać maksymalnie {max_length} znaków.'


    def validate_front_side(self, value):
        if value == None:
            raise serializers.ValidationError("Pole jest wymagane")
        if len(value) < 2:
            raise serializers.ValidationError("Pole musi posiadać co najmniej 2 znaki")
        return value

    def validate_back_side(self, value):
        if len(value) < 2:
            raise serializers.ValidationError("Pole musi posiadać co najmniej 2 znaki")
        return value
    def validate(self, data):
        # Dodatkowe niestandardowe walidacje można tutaj umieścić
        if data.get('front_side') == data.get('back_side'):
            raise serializers.ValidationError("Obie strony są takie same")
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

