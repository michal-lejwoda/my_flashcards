from rest_framework.mixins import CreateModelMixin, ListModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import GenericViewSet

from my_flashcards.flashcards.api.serializers import DeckSerializer
from my_flashcards.flashcards.models import Deck
from rest_framework.pagination import PageNumberPagination

class DeckPagination(PageNumberPagination):
    page_size = 10  # Ustaw ilość elementów na stronie
    page_size_query_param = 'page_size'
    max_page_size = 1000  # Maksymalna ilość elementów na stronie
# Create your views here.
class DeckViewSet(CreateModelMixin, ListModelMixin, GenericViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = DeckSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        return Deck.objects.filter(user=self.request.user)
