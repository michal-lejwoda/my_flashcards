import os

from django.conf import settings
from rest_framework import status
from rest_framework.mixins import CreateModelMixin, ListModelMixin, RetrieveModelMixin
from rest_framework.parsers import FileUploadParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet, ViewSet

from my_flashcards.flashcards.api.serializers import DeckSerializer, SingleDeckSerializer
from my_flashcards.flashcards.models import Deck
from rest_framework.pagination import PageNumberPagination

from my_flashcards.flashcards.tasks import get_words_from_file


# TODO REmove maybe later
# class DeckPagination(PageNumberPagination):
#     page_size = 10  # Ustaw ilość elementów na stronie
#     page_size_query_param = 'page_size'
#     max_page_size = 1000  # Maksymalna ilość elementów na stronie
# Create your views here.
class DeckViewSet(CreateModelMixin, ListModelMixin, GenericViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = DeckSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        return Deck.objects.filter(user=self.request.user)


class SingleDeckViewSet(RetrieveModelMixin, GenericViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SingleDeckSerializer

    # pagination_class = PageNumberPagination

    def get_queryset(self):
        return Deck.objects.filter(user=self.request.user)


class FileUploadViewSet(ViewSet):
    parser_classes = [MultiPartParser]

    def create(self, request):
        file_obj = request.FILES.get('file')
        if file_obj:
            try:
                # Odczytanie zawartości pliku do ciągu bajtów
                file_data = file_obj.read()
                             # .read().decode('utf-8'))

                # Przekazanie danych pliku jako argument do apply_async()
                id = get_words_from_file.apply_async(args=[file_data]).id
                print("test_id")
                print(id)

                return Response({"message": "Plik został pomyślnie przesłany"}, status=status.HTTP_200_OK)
            except Exception as e:
                print(e)
                print(f"Błąd podczas odczytu pliku: {e}")
                return Response({"error": "Błąd podczas odczytu pliku"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"error": "Nie znaleziono pliku"}, status=status.HTTP_400_BAD_REQUEST)
