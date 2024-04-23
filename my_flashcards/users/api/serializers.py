from django.contrib.auth.hashers import check_password
from django.utils.translation import gettext_lazy as _
from django.core.validators import validate_email
from rest_framework import serializers

from my_flashcards.users.models import User

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField()
    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)

    def validate_old_password(self, value):
        if not check_password(value, self.user.password):
            raise serializers.ValidationError("Incorrect old password")
        return value

class ChangeEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)

    def validate_email(self, value):
        try:
            User.objects.get(email=value)
            raise serializers.ValidationError(_("This email address is already used"))
        except User.DoesNotExist:
            return value
    def validate_password(self, value):
        if not check_password(value, self.user.password):
            raise serializers.ValidationError(_("Incorrect password"))
        return value

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
            raise serializers.ValidationError(_("Password is too short(min 4 letters)"))

        if len(password) > 50:
            raise serializers.ValidationError(_("Password is too long(max 50 letters)"))
        return password
    @staticmethod
    def validate_username(username):
        if len(username) < 4:
            raise serializers.ValidationError(_("Username is too short(min 4 letters)"))

        if len(username) > 30:
            raise serializers.ValidationError(_("Username is too long(max 30 letters)"))
        return username

    @staticmethod
    def validate_email(email):
        try:
            validate_email(email)
        except:
            raise serializers.ValidationError({'email': _('Email address is not correct')})
        return email
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password': _("Passwords don't match")})
        return data
    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user.return_dict_data_with_token
