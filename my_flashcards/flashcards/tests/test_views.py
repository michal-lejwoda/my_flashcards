import pytest
from rest_framework.test import APIRequestFactory

from my_flashcards.flashcards.api.views import DeckViewSet, SingleDeckViewSet
from my_flashcards.flashcards.models import Deck, Word
from my_flashcards.users.models import User


def test_check_number_of_words_in_deck(deck):
    assert deck.words.count() == 10

class TestDeckViewSet:
    @pytest.fixture()
    def api_rf(self) -> APIRequestFactory:
        return APIRequestFactory()
    def test_get_queryset(self, user: User, deck: Deck, api_rf: APIRequestFactory):
        view = DeckViewSet()
        request = api_rf.get("/fake-url/")
        request.user = user
        view.request = request
        assert len(view.get_queryset()) == 1

class TestSingleDeckViewSet:
    @pytest.fixture()
    def api_rf(self) -> APIRequestFactory:
        return APIRequestFactory()

    def test_get_queryset(self, user: User, deck: Deck, api_rf: APIRequestFactory):
        view = SingleDeckViewSet()
        request = api_rf.get("/fake-url/")
        request.user = user
        view.request = request
        assert len(view.get_queryset()) == 1

    def test_delete_word_from_deck(self, user: User, words: Word, deck: Deck, api_rf: APIRequestFactory ):
        view = SingleDeckViewSet.as_view({'delete': 'delete_word_from_deck'})
        request = api_rf.delete("/fake-url/")
        request.user = user
        response = view(request, pk=deck.pk, word_id=words[0].id)
        assert response.status_code == 200
