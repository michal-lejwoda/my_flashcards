from django.conf import settings
from rest_framework.routers import DefaultRouter
from rest_framework.routers import SimpleRouter

from my_flashcards.flashcards.api.views import DeckViewSet
from my_flashcards.users.api.views import UserViewSet, CustomAuthToken, RegistrationViewSet

router = DefaultRouter() if settings.DEBUG else SimpleRouter()

router.register("users", UserViewSet)
router.register("decks", DeckViewSet, basename="decks")
router.register(r'register', RegistrationViewSet, basename='register')
router.register(r'login', CustomAuthToken, basename='login')


app_name = "api"
urlpatterns = router.urls
