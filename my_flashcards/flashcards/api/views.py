from celery.result import AsyncResult
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.mixins import CreateModelMixin, ListModelMixin, RetrieveModelMixin
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet, ViewSet

from my_flashcards.flashcards.api.serializers import DeckSerializer, SingleDeckSerializer
from my_flashcards.flashcards.models import Deck
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
                file_data = file_obj.read()
                task_id = get_words_from_file.apply_async(args=[file_data]).id
                return Response({"status": "SUCCESS", "message": "Plik został pomyślnie przesłany", "task_id": task_id},
                                status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"status": "FAILED", "message": "Błąd podczas odczytu pliku"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"status": "FAILED", "message": "Nie znaleziono pliku"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['GET'], permission_classes=[IsAuthenticated])
    def get_task(self, request):
        task_id = request.query_params.get('task_id')
        if task_id:
            try:
                result = AsyncResult(task_id)
                if result.successful():
                    return Response({"status": "SUCCESS", "result": result.get()}, status=status.HTTP_200_OK)
                elif result.failed():
                    return Response({"status": "FAILED", "error": str(result.result)},
                                    status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                else:
                    return Response({"status": "PENDING", "message": "Task is still pending."},
                                    status=status.HTTP_202_ACCEPTED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"error": "Missing task_id parameter."}, status=status.HTTP_400_BAD_REQUEST)
