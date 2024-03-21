from django.db.models.signals import post_save
from django.dispatch import receiver
from slugify import slugify

from my_flashcards.flashcards.models import Deck


@receiver(post_save, sender=Deck)
def create_slug(sender, instance, created, **kwargs):
    if not instance.slug:
        slug = slugify(instance.name)
        instance_id = instance.id
        free_slug = f"{slug}-{instance.user}"
        if Deck.objects.filter(slug=free_slug).exists():
            free_slug = f"{slug}-{instance.user.id}-{instance_id}"
            counter = 1
            while Deck.objects.filter(slug=free_slug).exists():
                free_slug = f"{slug}-{instance.user}-{instance_id}-{counter}"
                counter += 1
        instance.slug = free_slug
        instance.save()
