from django.urls import resolve
from rest_framework.authtoken.views import ObtainAuthToken

from my_flashcards.flashcards.api.views import DeckViewSet, FileUploadViewSet, SingleDeckViewSet, \
    CreateDeckFromMultipleDecksViewSet, WordViewSet, LearnViewSet
from my_flashcards.users.api.views import RegistrationViewSet


def test_decks_url():
    url = '/api/decks/'
    resolver = resolve(url)
    assert resolver.func.cls == DeckViewSet


def test_file_upload_url():
    url = '/api/file_upload/'
    resolver = resolve(url)
    assert resolver.func.cls == FileUploadViewSet


def test_single_deck_url():
    url = '/api/single_deck/3/'
    resolver = resolve(url)
    assert resolver.func.cls == SingleDeckViewSet


def test_multiple_decks_url():
    url = '/api/multiple_decks/'
    resolver = resolve(url)
    assert resolver.func.cls == CreateDeckFromMultipleDecksViewSet


def test_word_url():
    url = '/api/word/'
    resolver = resolve(url)
    assert resolver.func.cls == WordViewSet


def test_learn_url():
    url = '/api/learn/'
    resolver = resolve(url)
    assert resolver.func.cls == LearnViewSet


def test_register_url():
    url = '/api/register/'
    resolver = resolve(url)
    assert resolver.func.cls == RegistrationViewSet


def test_login_url():
    url = '/api/login/'
    resolver = resolve(url)
    assert resolver.func.cls == ObtainAuthToken
