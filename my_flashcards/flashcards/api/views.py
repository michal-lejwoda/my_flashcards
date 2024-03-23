from celery.result import AsyncResult
from django.db import IntegrityError
from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.mixins import CreateModelMixin, ListModelMixin, RetrieveModelMixin, DestroyModelMixin
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet, ViewSet

from my_flashcards.flashcards.api.serializers import DeckSerializer, SingleDeckSerializer, WordSerializer
from my_flashcards.flashcards.models import Deck, Word
from my_flashcards.flashcards.tasks import get_words_from_file
from django.utils.translation import gettext_lazy as _


# TODO REmove maybe later
# class DeckPagination(PageNumberPagination):
#     page_size = 10  # Ustaw ilość elementów na stronie
#     page_size_query_param = 'page_size'
#     max_page_size = 1000  # Maksymalna ilość elementów na stronie
# Create your views here.
# TODO REmove This custom
class ErrorHandlingMixin:
    def handle_response(self, message, status_code):
        return Response(
            {"message": message},
            status=status_code
        )


class CustomPagination(PageNumberPagination):
    page_size = 3
    page_size_query_param = 'page_size'


class DeckViewSet(CreateModelMixin, ListModelMixin, GenericViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = DeckSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        return Deck.objects.filter(user=self.request.user)


class SingleDeckViewSet(RetrieveModelMixin, GenericViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SingleDeckSerializer

    def get_queryset(self):
        return Deck.objects.filter(user=self.request.user)

    @action(detail=True, methods=['DELETE'], permission_classes=[IsAuthenticated],
            url_path='delete_word_from_deck/(?P<word_id>[^/.]+)')
    def delete_word_from_deck(self, request, pk=None, word_id=None):
        try:
            deck = Deck.objects.get(pk=pk, user=self.request.user)
            word = Word.objects.get(pk=word_id, user=self.request.user)
            deck.words.remove(word)
            return self.handle_word_has_been_removed_from_deck()
        except Deck.DoesNotExist:
            return self.handle_deck_not_found()
        except Word.DoesNotExist:
            return self.handle_word_not_found()

    @action(detail=True, methods=['POST'], permission_classes=[IsAuthenticated])
    def create_word_for_deck(self, request, pk=None):
        try:
            deck = Deck.objects.get(pk=pk)
            serializer = WordSerializer(data=request.data)
            if serializer.is_valid():
                word = Word.objects.create(front_side=serializer.validated_data['front_side'],
                                           back_side=serializer.validated_data['back_side'], user=self.request.user)
                deck.words.add(word)
                return self.handle_created_data()
            else:
                return self.handle_display_errors(serializer.errors)
        except Deck.DoesNotExist:
            return self.handle_deck_not_found()
        except IntegrityError:
            return self.handle_integrity_error()

    def handle_created_data(self):
        return Response(status=status.HTTP_201_CREATED)
    def handle_display_errors(self, errors):
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)
    def handle_word_has_been_removed_from_deck(self):
        return Response({"message": _("The word has been removed from the deck")},
                        status=status.HTTP_200_OK)

    def handle_deck_not_found(self):
        return Response(
            {"message": _("Deck does not exist")},
            status=status.HTTP_404_NOT_FOUND
        )

    def handle_word_not_found(self):
        return Response(
            {"message": _("Word does not exist")},
            status=status.HTTP_404_NOT_FOUND
        )

    def handle_integrity_error(self):
        return Response(
            {"message": _("Incorrect data")},
            status=status.HTTP_400_BAD_REQUEST
        )


class FileUploadViewSet(ViewSet):
    parser_classes = [MultiPartParser]

    def create(self, request):
        file_obj = request.FILES.get('file')
        if file_obj:
            try:
                file_data = file_obj.read()
                task_id = get_words_from_file.apply_async(args=[file_data]).id
                return self.handle_file_was_uploaded(task_id)
            except Exception:
                return self.handle_error_while_reading_file()
        else:
            self.handle_file_not_found()

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

    def handle_file_was_uploaded(self, task_id: str):
        return Response({"status": "SUCCESS", "message": _("The file was successfully uploaded"), "task_id": task_id},
                        status=status.HTTP_200_OK)

    def handle_error_while_reading_file(self):
        return Response({"status": "FAILED", "message": _("Error while reading a file")},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def handle_file_not_found(self):
        return Response({"status": "FAILED", "message": _("File not found")}, status=status.HTTP_400_BAD_REQUEST)
class CreateDeckFromMultipleDecksViewSet(ViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SingleDeckSerializer

    def create(self, request):
        data = request.data
        decks_ids = data.get('decks')
        words = Deck.objects.filter(id__in=decks_ids, user=request.user).distinct().values_list('words', flat=True)
        new_deck = Deck.objects.create(user=request.user, name=data.get('name'))
        new_deck.words.add(*words)
        # TODO Don't have to use it if blank
        # new_deck.save()
        serializer = self.serializer_class(new_deck)
        return Response(serializer.data, status=status.HTTP_200_OK)


class WordViewSet(ListModelMixin, DestroyModelMixin, GenericViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = WordSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        queryset = Word.objects.filter(user=self.request.user)
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(Q(front_side__icontains=search_query) | Q(
                back_side__icontains=search_query))  # nazwa to pole, po którym chcesz wyszukiwać
        return queryset
