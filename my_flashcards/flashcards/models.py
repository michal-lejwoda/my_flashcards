from django.db import models
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django_extensions.db.models import TimeStampedModel
from slugify import slugify

from my_flashcards.users.models import User


class Tag(models.Model):
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=100)
    popularity = models.IntegerField(default=0)
    def __str__(self):
        return "{}".format(self.name)



class Word(TimeStampedModel):
    front_side = models.CharField(max_length=200)
    back_side = models.CharField(max_length=200)
    next_learn = models.DateTimeField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None, null=True)

    def __str__(self):
        return "{} {}".format(self.front_side, self.user.username)


# Create your models here.
class Deck(TimeStampedModel):
    name = models.CharField(max_length=100, blank=True)
    slug = models.SlugField(unique=True, blank=True)
    words = models.ManyToManyField(Word, blank=True)
    popularity = models.IntegerField(default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None, null=True)
    is_public = False

    def __str__(self):
        return "{} {}".format(self.name, self.user.username)

