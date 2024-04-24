from rest_framework import status, permissions
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.decorators import action
from rest_framework.mixins import ListModelMixin, CreateModelMixin
from rest_framework.mixins import RetrieveModelMixin
from rest_framework.mixins import UpdateModelMixin
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from django.utils.translation import gettext_lazy as _

from my_flashcards.users.models import User

from .serializers import UserSerializer, RegistrationSerializer, ChangeEmailSerializer, ChangePasswordSerializer, \
    DeleteUserSerializer, ChangePasswordWithTokenSerializer
from ...flashcards.tasks import send_reset_password_to_mail


class UserViewSet(RetrieveModelMixin, ListModelMixin, UpdateModelMixin, GenericViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    lookup_field = "username"

    def get_queryset(self, *args, **kwargs):
        assert isinstance(self.request.user.id, int)
        return self.queryset.filter(id=self.request.user.id)

    @action(detail=False)
    def me(self, request):
        serializer = UserSerializer(request.user, context={"request": request})
        return Response(status=status.HTTP_200_OK, data=serializer.data)

    @action(detail=False, methods=['POST'])
    def change_email(self, request):
        serializer = ChangeEmailSerializer(data=request.data, user=request.user)
        if serializer.is_valid():
            new_email = serializer.validated_data['email']
            request.user.email = new_email
            request.user.save()
            return Response({"message": _("Email has been successfully changed")},status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['POST'])
    def change_password(self, request):
        serializer = ChangePasswordSerializer(data=request.data, user=request.user)
        if serializer.is_valid():
            new_password = serializer.validated_data['new_password']
            user = request.user
            user.set_password(new_password)
            user.save()
            return Response({"message": _("Password has been successfully changed")}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'], permission_classes = [AllowAny])
    def send_mail_with_reset_link(self, request):
        send_reset_password_to_mail(request.data['email'])
        return Response({"message": _("If the email exists then a message with a link has been sent to it ")}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['POST'])
    def reset_password(self, request):
        serializer = ChangePasswordWithTokenSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data.get('user')
            new_password = serializer.validated_data.get('new_password1')
            user.set_password(new_password)
            user.save()
            return Response({'detail': _("Password has been successfully changed")}, status=status.HTTP_200_OK)
        else:
            return Response({'error': _("Password change has failed")},
                            status=status.HTTP_400_BAD_REQUEST)


    @action(detail=False, methods=['POST'])
    def delete_user(self, request):
        serializer = DeleteUserSerializer(data=request.data, user=request.user)
        if serializer.is_valid():
            request.user.delete()
            return Response({"message": _("Your account has been deleted")}, status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class CustomAuthToken(ObtainAuthToken, GenericViewSet):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})


class RegistrationViewSet(GenericViewSet, CreateModelMixin):
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            test = serializer.save()
            return Response(test, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)
