from django.conf import settings
from rest_framework.routers import DefaultRouter
from rest_framework.routers import SimpleRouter

from my_flashcards.flashcards.api.views import DeckViewSet, SingleDeckViewSet, FileUploadViewSet, \
    CreateDeckFromMultipleDecksViewSet, WordViewSet, LearnViewSet
from my_flashcards.users.api.views import UserViewSet, CustomAuthToken, RegistrationViewSet

router = DefaultRouter() if settings.DEBUG else SimpleRouter()

router.register("users", UserViewSet)
router.register("decks", DeckViewSet, basename="decks")
router.register("file_upload", FileUploadViewSet, basename="file_upload")
router.register("single_deck", SingleDeckViewSet, basename="single_deck")
router.register("multiple_decks", CreateDeckFromMultipleDecksViewSet, basename="multiple_decks")
router.register("word", WordViewSet, basename="word")
router.register("learn", LearnViewSet, basename="learn")
router.register("register", RegistrationViewSet, basename='register')


app_name = "api"
urlpatterns = router.urls
