from celery.result import AsyncResult
from django.db import IntegrityError, transaction
from django.db.models import Q
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from rest_framework import status, pagination
from rest_framework.decorators import action
from rest_framework.mixins import CreateModelMixin, ListModelMixin, RetrieveModelMixin, DestroyModelMixin
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet, ViewSet

from my_flashcards.flashcards.api.serializers import DeckSerializer, SingleDeckSerializer, WordSerializer, \
    UserHistorySerializer, DeckSerializerWithAllFields, CreateUserHistorySerializer, WordSerializerWithDeck
from my_flashcards.flashcards.errors import ErrorHandlingMixin
from my_flashcards.flashcards.models import Deck, Word, UserHistory
from my_flashcards.flashcards.tasks import get_words_from_file
class CustomPagination(pagination.PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

    def __init__(self, page_size_query_param=None, *args, **kwargs):
        if page_size_query_param:
            self.page_size_query_param = page_size_query_param
        super().__init__(*args, **kwargs)

    def get_paginated_response(self, data):
        search_query = self.request.query_params.get('search')
        print(search_query)
        total_pages = self.page.paginator.num_pages
        last_page_link = None
        first_page_link = None
        if total_pages > 0:
            first_page_link = self.request.build_absolute_uri(
                f"?page=1&page_size={self.page_size}"
            )
            last_page_link = self.request.build_absolute_uri(
                f"?page={total_pages}&page_size={self.page_size}"
            )
            if search_query:
                first_page_link += f"&search={search_query}"
                last_page_link += f"&search={search_query}"

        next_link = self.get_next_link()
        previous_link = self.get_previous_link()

        # if next_link:
        #     next_link = f"{next_link}&page_size={self.page_size}"
        # if previous_link:
        #     previous_link = f"{previous_link}&page_size={self.page_size}"
        return Response(
            {
                'links': {
                    'next': next_link,
                    'previous': previous_link,
                    'last_page_link': last_page_link,
                    'first_page_link': first_page_link,
                },
                'count': self.page.paginator.count,
                'current_page': self.page.number,
                'total_pages': self.page.paginator.num_pages,
                'results': data
            })


class DeckViewSet(CreateModelMixin, ListModelMixin, GenericViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = DeckSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        queryset = Deck.objects.filter(user=self.request.user)
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(Q(name__icontains=search_query))
        return queryset


class SingleDeckViewSet(ErrorHandlingMixin, RetrieveModelMixin, GenericViewSet):
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
            return self.handle_response(_("The word has been removed from the deck"), status.HTTP_200_OK)
        except Deck.DoesNotExist:
            return self.handle_response(_("Deck does not exist"), status.HTTP_404_NOT_FOUND)
        except Word.DoesNotExist:
            return self.handle_response(_("Word does not exist"), status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['POST'], permission_classes=[IsAuthenticated])
    def create_word_for_deck(self, request, pk=None):
        try:
            deck = Deck.objects.get(pk=pk)
            serializer = WordSerializer(data=request.data)
            if serializer.is_valid():
                word = Word.objects.create(front_side=serializer.validated_data['front_side'],
                                           back_side=serializer.validated_data['back_side'], user=self.request.user)
                deck.words.add(word)
                return self.handle_response(_("Word created"), status.HTTP_201_CREATED)
            else:
                # TODO Back here
                return self.handle_response(serializer.errors, status.HTTP_400_BAD_REQUEST)
        except Deck.DoesNotExist:
            return self.handle_response(_("Deck does not exist"), status.HTTP_404_NOT_FOUND)
        except IntegrityError:
            return self.handle_response(_("Incorrect data"), status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'], permission_classes=[IsAuthenticated])
    def create_deck_with_words(self, request):
        try:
            with transaction.atomic():
                serializer = DeckSerializer(data=request.data, context={'request': request})
                if serializer.is_valid():
                    deck = serializer.save(user=request.user)
                    for row in request.data['rows']:
                        word_serializer = WordSerializer(data=row)
                        if word_serializer.is_valid():
                            word = word_serializer.save(user=request.user)
                            deck.words.add(word)
                    deck.save()
                    serializer_with_all_fields = DeckSerializerWithAllFields(deck)
                    return Response(serializer_with_all_fields.data)
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FileUploadViewSet(ErrorHandlingMixin, ViewSet):
    parser_classes = [MultiPartParser]

    def create(self, request):
        file_obj = request.FILES.get('file')
        if file_obj:
            try:
                file_data = file_obj.read()
                task_id = get_words_from_file.apply_async(args=[file_data]).id
                return self.handle_response(
                    message={"message": _("The file was successfully uploaded"), "task_id": task_id},
                    status=status.HTTP_200_OK)
            except:
                return self.handle_response(message={_("Error while reading a file")},
                                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return self.handle_response(message={"message": _("File not found")}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['GET'], permission_classes=[IsAuthenticated])
    def get_task(self, request):
        task_id = request.query_params.get('task_id')
        if task_id:
            try:
                result = AsyncResult(task_id)
                if result.successful():
                    return self.handle_response(message={"status": _("SUCCESS"), "result": result.get()},
                                                status=status.HTTP_200_OK)
                elif result.failed():
                    return self.handle_response(message={"status": _("FAILED"), "error": str(result.result)},
                                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                else:
                    return self.handle_response(message={"status": _("PENDING"), "error": "Task is still pending."},
                                                status=status.HTTP_202_ACCEPTED)
            except:
                return Response(message={"status": _("ERROR"), "error": _("File problems")},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(message={"status": _("ERROR"), "error": _("Missing task_id parameter")},
                            status=status.HTTP_400_BAD_REQUEST)


class CreateDeckFromMultipleDecksViewSet(ViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SingleDeckSerializer

    def create(self, request):
        data = request.data
        decks_ids = data.getlist('decks')
        words = Deck.objects.filter(id__in=decks_ids, user=request.user).distinct().values_list('words', flat=True)
        new_deck = Deck.objects.create(user=request.user, name=data.get('name'))
        new_deck.words.add(*words)
        serializer = self.serializer_class(new_deck)
        return Response(serializer.data, status=status.HTTP_200_OK)


class WordViewSet(ListModelMixin, DestroyModelMixin, RetrieveModelMixin, GenericViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = WordSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        queryset = Word.objects.filter(user=self.request.user)
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(Q(front_side__icontains=search_query) | Q(
                back_side__icontains=search_query))
        return queryset

    @action(detail=False, methods=['GET'], permission_classes=[IsAuthenticated])
    def find_word_in_decks(self, request):
        paginator = CustomPagination(request)
        search_query = self.request.query_params.get('search', None)
        queryset = Word.objects.filter(Q(front_side__icontains=search_query) | Q(back_side__icontains=search_query), user=self.request.user)
        paginated_queryset = paginator.paginate_queryset(queryset, request)
        serializer = WordSerializerWithDeck(paginated_queryset, many=True)
        return paginator.get_paginated_response(serializer.data)


class LearnViewSet(CreateModelMixin, GenericViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = UserHistorySerializer

    def get(self, request, *args, **kwargs):
        pass

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data['user'] = self.request.user.id
        deck = Deck.objects.get(id=data.get('deck'))
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        user_history_instance = serializer.instance
        if data['type'] == 'LEARN':
            result = self.get_learned_data(deck, user_history_instance)
            create_user_history = CreateUserHistorySerializer(result)
            # words = WordSerializer(result, many=True)
            return Response(create_user_history.data, status=status.HTTP_200_OK)
        elif data['type'] == 'BROWSE':
            result = self.get_browse_data()
            deck_serializer = DeckSerializer(result)
        elif data['type'] == 'BROWSE_AND_LEARN':
            result = self.get_browse_and_learn_data()
            deck_serializer = DeckSerializer(result)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        # if deck_serializer.is_valid():
        #     # Jeśli dane są poprawne, uzyskaj zserializowane dane
        #     serialized_data = deck_serializer.data
        #
        #     # Zwróć zserializowane dane jako odpowiedź
        #     return Response(serialized_data, status=status.HTTP_200_OK)
        # else:
        #     # Jeśli dane są niepoprawne, obsłuż błąd
        #     errors = deck_serializer.errors
        #     return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        # print("type(user_history_instance)")
        # print(type(user_history_instance))
        # user_history_instance.correct_flashcards.add(*learned_data)
        # TODO Back here
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def get_learned_data(self, deck: Deck, user_history_instance: UserHistory) -> UserHistory:
        words = Word.objects.filter(deck=deck).filter(Q(next_learn__gt=timezone.now()) & Q(is_correct=True))
        user_history_instance.correct_flashcards.add(*words)
        correct_data = deck.words.exclude(id__in=user_history_instance.correct_flashcards.values_list('id', flat=True))
        return {"user_history": user_history_instance.id, "words": correct_data}

    def get_learn_data(self, deck: Deck):
        # words = Word.objects.filter(deck=deck, next_learn__lte =timezone.now())
        words = Word.objects.filter(deck=deck).filter(Q(next_learn__lte=timezone.now()) | Q(is_correct=False))
        return words

    def get_browse_data(self):
        return 'get_browse_data'

    def get_browse_and_learn_data(self):
        return 'get_browse_and_learn_data'
