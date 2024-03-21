# from django.shortcuts import render
# from rest_framework.mixins import CreateModelMixin, ListModelMixin
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.viewsets import GenericViewSet
#
# from my_flashcards.flashcards.models import Deck
#
#
# # Create your views here.
# class DeckViewSet(CreateModelMixin, ListModelMixin, GenericViewSet):
#     permission_classes = [IsAuthenticated]
#
#     def get_queryset(self):
#         return Deck.objects.filter(user=self.request.user)
