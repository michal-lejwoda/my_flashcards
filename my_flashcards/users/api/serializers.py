from django.core.validators import validate_email
from rest_framework import serializers

from my_flashcards.users.models import User


class UserSerializer(serializers.ModelSerializer[User]):
    class Meta:
        model = User
        fields = ["username", "name", "url"]

        extra_kwargs = {
            "url": {"view_name": "api:user-detail", "lookup_field": "username"},
        }

class RegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'password2')
        write_only_fields = ('password')
        read_only_fields = ('id',)
        extra_kwargs = {'email': {'required': True}}

    @staticmethod
    def validate_password(password):
        if len(password) < 4:
            raise serializers.ValidationError('Hasło za krótkie (minimum 4 litery)')

        if len(password) > 50:
            raise serializers.ValidationError('Hasło za długie (maksimum 50 liter)')
        return password
    @staticmethod
    def validate_username(username):
        if len(username) < 4:
            raise serializers.ValidationError('Nazwa użytkowanika jest za krótka (minimum 4 litery)')

        if len(username) > 30:
            raise serializers.ValidationError('Nazwa użytkowanika jest za długa (maksimum 30 liter)')
        return username

    @staticmethod
    def validate_email(email):
        try:
            validate_email(email)
        except:
            raise serializers.ValidationError({'email': 'Email jest nie poprawny'})
        return email
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password': 'Hasła się nie zgadzają'})
        return data
    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user.return_dict_data_with_token
