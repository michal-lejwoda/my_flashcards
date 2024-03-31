import json
from typing import List

import pytest
from django.db import transaction
from rest_framework.test import APIRequestFactory, force_authenticate

from my_flashcards.flashcards.api.views import DeckViewSet, SingleDeckViewSet, CreateDeckFromMultipleDecksViewSet, \
    WordViewSet
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

    def test_delete_word_from_deck(self, user: User, words: Word, deck: Deck, api_rf: APIRequestFactory):
        view = SingleDeckViewSet.as_view({'delete': 'delete_word_from_deck'})
        request = api_rf.delete("/fake-url/")
        request.user = user
        response = view(request, pk=deck.pk, word_id=words[0].id)
        assert response.status_code == 200

    def test_create_word_for_deck(self, user: User, deck: Deck, api_rf: APIRequestFactory):
        view = SingleDeckViewSet.as_view({'post': 'create_word_for_deck'})
        request = api_rf.post("/fake-url/", data={
            "front_side": "uprzejmy",
            "back_side": "courteous"
        })
        request.user = user
        response = view(request, pk=deck.pk)
        assert response.status_code == 201

    def test_create_word_for_deck_if_request_body_dont_have_all_fields(self, user: User, deck: Deck,
                                                                       api_rf: APIRequestFactory):
        view = SingleDeckViewSet.as_view({'post': 'create_word_for_deck'})
        request = api_rf.post("/fake-url/", data={
            "front_side": "uprzejmy",
        })
        request.user = user
        response = view(request, pk=deck.pk)
        assert response.status_code == 400

    def test_create_word_for_deck_if_deck_does_not_exist(self, user: User, deck: Deck, api_rf: APIRequestFactory):
        view = SingleDeckViewSet.as_view({'post': 'create_word_for_deck'})
        request = api_rf.post("/fake-url/", data={
            "front_side": "uprzejmy",
        })
        request.user = user
        response = view(request, pk=-11)
        assert response.status_code == 404

    def test_create_word_for_deck_if_word_is_added_to_deck(self, user: User, deck: Deck, api_rf: APIRequestFactory):
        view = SingleDeckViewSet.as_view({'post': 'create_word_for_deck'})
        request = api_rf.post("/fake-url/", data={
            "front_side": "uprzejmy",
            "back_side": "courteous"
        })
        request.user = user
        view(request, pk=deck.pk)
        assert len(deck.words.all()) == 11

    def test_create_word_for_deck_if_word_is_not_added_when_dont_have_all_body(self, user: User, deck: Deck,
                                                                               api_rf: APIRequestFactory):
        view = SingleDeckViewSet.as_view({'post': 'create_word_for_deck'})
        request = api_rf.post("/fake-url/", data={
            "front_side": "uprzejmy",
        })
        request.user = user
        view(request, pk=deck.pk)
        assert len(deck.words.all()) == 10

    # TODO BAck HEre with FileUploadViewSet


class TestCreateDeckFromMultipleDecksViewSet:
    @pytest.fixture()
    def api_rf(self) -> APIRequestFactory:
        return APIRequestFactory()
    def test_check_if_deck_is_created(self, user: User, decks: List[Deck], api_rf: APIRequestFactory):
        view = CreateDeckFromMultipleDecksViewSet.as_view({'post': 'create'})
        temp = []
        for i in decks[:4]:
            temp.append(i.id)
        request = api_rf.post("/fake-url/", data={
            "name": "first_test_deck",
            "decks": temp
        })
        request.user = user
        response = view(request)
        assert len(response.data.get('words')) == 40

class CustomAPIRequestFactory(APIRequestFactory):
    def get(self, path, data=None, secure=False, **extra):
        request = super().get(path, data, secure=secure, **extra)
        query_params = request.GET.copy() if request.GET else {}
        if data is not None:
            query_params.update(data)
        request.query_params = query_params
        return request


class TestWordViewSet:
    @pytest.fixture()
    def api_rf(self) -> CustomAPIRequestFactory:
        return CustomAPIRequestFactory()

    def test_get_queryset_search_with_word_apple(self, user: User, decks: List[Deck], api_rf: CustomAPIRequestFactory):
        view = WordViewSet()
        request = api_rf.get("/fake-url/", {'search': 'apple'})
        request.user = user
        view.request = request
        view.get_queryset()
        assert len(view.get_queryset()) == 0

    def test_get_queryset_search_with_word_front_side(self, user: User, decks: List[Deck], api_rf: CustomAPIRequestFactory):
        view = WordViewSet()
        request = api_rf.get("/fake-url/", {'search': 'front_side'})
        request.user = user
        view.request = request
        view.get_queryset()
        assert len(view.get_queryset()) == 100
