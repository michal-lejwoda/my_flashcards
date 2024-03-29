import pytest

from my_flashcards.flashcards.models import Deck, Word
from my_flashcards.users.models import User
from my_flashcards.users.tests.factories import UserFactory


@pytest.fixture(autouse=True)
def _media_storage(settings, tmpdir) -> None:
    settings.MEDIA_ROOT = tmpdir.strpath


@pytest.fixture()
def user(db) -> User:
    return UserFactory()


@pytest.mark.django_db(transaction=True)
def users():
    created_users = []
    for _ in range(10):
        user = UserFactory.create()
        created_users.append(user)
    return created_users


@pytest.fixture()
def decks(user):
    # user = User.objects.create_user(username='test_user', email='test@example.com', password='test_password')
    for i in range(10):
        deck = Deck.objects.create(name="example_deck{}".format(i), user=user)
        words =[]
        for j in range(10):
            word = Word.objects.create(front_side=f"front_side{i}{j}", back_side=f"back_side{i}{j}", user=user, level=1)
            words.append(word)
        deck.words.add(*words)
    return Deck.objects.all()
@pytest.fixture()
def test_user():
    # Utwórz użytkownika
    user = User.objects.create_user(username='test_user', email='test@example.com', password='test_password')
    return user

@pytest.fixture
def words(user):
    words_list = []
    for i in range(1, 11):
        word = Word.objects.create(front_side=f"front{i}", back_side=f"Definition{i}", user=user, level=1)
        words_list.append(word)
    return words_list

@pytest.fixture
def deck(words, user):
    deck = Deck.objects.create(name="example_deck", user=user)
    deck.words.add(*words)
    return deck
