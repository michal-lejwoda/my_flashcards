import contextlib

from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class FlashcardsConfig(AppConfig):
    name = "my_flashcards.flashcards"
    verbose_name = _("Flashcards")

    def ready(self):
        with contextlib.suppress(ImportError):
            import my_flashcards.flashcards.signals  # noqa: F401
