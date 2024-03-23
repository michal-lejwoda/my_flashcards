from django.core.validators import MinLengthValidator
from django.db import models
from django_extensions.db.models import TimeStampedModel
from django.utils.translation import gettext_lazy as _
from my_flashcards.users.models import User


class WithVisitCounter(models.Model):
    popularity = models.IntegerField(editable=False, default=0)

    class Meta:
        abstract = True


class Tag(WithVisitCounter, models.Model):
    slug = models.SlugField(unique=True, verbose_name=_('Slug'))
    name = models.CharField(max_length=100, verbose_name=_('Name'))

    def __str__(self):
        return "{}".format(self.name)


class Word(TimeStampedModel):
    front_side = models.CharField(max_length=200,
                                  validators=[MinLengthValidator(2,message=_('The field must contain at least 2 characters'))],
                                  verbose_name=_('Front side'))
    back_side = models.CharField(max_length=200,
                                 validators=[MinLengthValidator(2, message=_('The field must contain at least 2 characters'))],
                                 verbose_name=_('Back side'))
    next_learn = models.DateTimeField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None, null=True)

    def __str__(self):
        return "{} {}".format(self.front_side, self.user.username)


# Create your models here.
class Deck(WithVisitCounter, TimeStampedModel):
    name = models.CharField(max_length=100, blank=True)
    slug = models.SlugField(unique=True, blank=True)
    words = models.ManyToManyField(Word, blank=True, verbose_name=_('Words'))

    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None, null=True)
    is_public = models.BooleanField(default=False, verbose_name=_('Is public'))

    def __str__(self):
        return "{} {}".format(self.name, self.user)
