from django.db.models.signals import pre_save
from django.dispatch import receiver
from slugify import slugify

from my_flashcards.flashcards.models import Deck


@receiver(pre_save, sender=Deck)
def create_slug(sender, instance, **kwargs):
    if not instance.slug:
        slug = slugify(instance.name)
        instance_id = instance.id
        instance.slug = f"{slug}-{instance_id}"
