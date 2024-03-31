from my_flashcards.flashcards.models import Deck, Word, UserHistory
from my_flashcards.users.models import User


class TestUserHistoryModel:
    def test_add_correct_flashcard(self, user: User, user_history: UserHistory) -> None:
        word = Word.objects.create(front_side=f"front_test", back_side=f"Definition_test", user=user, level=1)
        user_history.add_correct_flashcard(word)

        # deck.
        assert len(user_history.correct_flashcards.all()) == 11

    def test_remove_correct_flashcard(self, user_history: UserHistory):
        # print(deck)
        word = user_history.correct_flashcards.all()[0]
        user_history.remove_correct_flashcard(word)
        assert len(user_history.correct_flashcards.all()) == 9
