from django.conf import settings
from rest_framework.routers import DefaultRouter
from rest_framework.routers import SimpleRouter

from my_flashcards.exercises.api.views import LanguageCategoryViewSet, SubGroupwithSubGroupsViewSet, \
    SubGroupwithGroupExercisesViewSet, MainGroupwithSubGroupsViewSet
from my_flashcards.flashcards.api.views import DeckViewSet, SingleDeckViewSet, FileUploadViewSet, \
    CreateDeckFromMultipleDecksViewSet, WordViewSet, LearnViewSet, LearnWordViewSet
from my_flashcards.users.api.views import UserViewSet, CustomAuthToken, RegistrationViewSet

router = DefaultRouter() if settings.DEBUG else SimpleRouter()

router.register("users", UserViewSet)
router.register("decks", DeckViewSet, basename="decks")
router.register("file_upload", FileUploadViewSet, basename="file_upload")
router.register("single_deck", SingleDeckViewSet, basename="single_deck")
router.register("multiple_decks", CreateDeckFromMultipleDecksViewSet, basename="multiple_decks")
router.register("word", WordViewSet, basename="word")
router.register("learn_word", LearnWordViewSet, basename="learn_word")
router.register("learn", LearnViewSet, basename="learn")
router.register("register", RegistrationViewSet, basename="register")
router.register("languages", LanguageCategoryViewSet, basename="languages")
router.register("subgroup-with-subgroups",SubGroupwithSubGroupsViewSet, basename="subgroup-with-subgroups")
router.register("subgroup-with-groupexercises",SubGroupwithGroupExercisesViewSet,basename="subgroup-with-groupexercises")
router.register("maingroup-with-subgroups",MainGroupwithSubGroupsViewSet, basename="maingroup-with-subgroups")
router.register("maingroup-with-groupexercise", MainGroupwithSubGroupsViewSet, basename="maingroup-with-groupexercise")

app_name = "api"
urlpatterns = router.urls
