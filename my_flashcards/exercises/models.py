from django.contrib.auth import get_user_model
from django.db import models
from django.shortcuts import get_object_or_404
from wagtail.admin.panels import FieldPanel
from wagtail.models import Page, PageManager

from my_flashcards.exercises.choices import LANGUAGE_CHOICES, CHILDREN_CHOICES
from my_flashcards.exercises.exercises_models import GroupExercise
from my_flashcards.exercises.mixins import UniqueSlugAcrossGroupPagesMixin

User = get_user_model()


def audio_upload_path(instance, filename):
    return f"audio/{filename}"


class PageWithPathSlugManager(PageManager):
    def get_by_path_slug(self, path_slug):
        return self.get(path_slug=path_slug)

    def get_by_path_slug_or_404(self, path_slug):
        return get_object_or_404(self.get_queryset(), path_slug=path_slug)

    @classmethod
    def find_page_by_path_slug(cls, path_slug):
        from django.apps import apps

        #TODO make it better
        page_models = []
        for model in apps.get_models():
            if (hasattr(model, 'path_slug') and
                hasattr(model, '_meta') and
                not model._meta.abstract):
                page_models.append(model)

        for model in page_models:
            try:
                if hasattr(model.objects, 'live'):
                    page = model.objects.live().get(path_slug=path_slug)
                else:
                    page = model.objects.get(path_slug=path_slug)
                return page
            except model.DoesNotExist:
                continue

        return None

class PageWithPathSlug(Page):
    path_slug = models.CharField(
        max_length=500,
        unique=True,
        blank=True,
        null=True,
        db_index=True,
        help_text="Automatycznie generowana pełna ścieżka strony"
    )

    objects = PageWithPathSlugManager()

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        self.path_slug = self.generate_path_slug()
        super().save(*args, **kwargs)

    def generate_path_slug(self):
        parts = []
        current = self.get_parent()
        while current and hasattr(current, 'slug'):
            if current.slug not in ["root", "home"]:
                parts.insert(0, current.slug)
            current = current.get_parent()

        if self.slug:
            parts.append(self.slug)

        base_path = "/".join(parts)

        path_slug = base_path
        counter = 1

        while (self.__class__.objects
            .filter(path_slug=path_slug)
            .exclude(pk=self.pk)
            .exists()):
            path_slug = f"{base_path}-{counter}"
            counter += 1

        return path_slug


# Abstract classes
class GroupBase(PageWithPathSlug, UniqueSlugAcrossGroupPagesMixin):
    background_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )
    background_image_with_text = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )
    is_displayed = models.BooleanField(default=True)
    is_multi = models.BooleanField(default=False)

    content_panels = Page.content_panels + [
        FieldPanel('background_image'),
        FieldPanel('background_image_with_text'),
        FieldPanel('is_displayed'),
        FieldPanel('is_multi'),
        FieldPanel('path_slug', read_only=True),
    ]

    class Meta:
        abstract = True


class LanguageCategoryPage(PageWithPathSlug, UniqueSlugAcrossGroupPagesMixin):
    language = models.CharField(
        max_length=2,
        choices=LANGUAGE_CHOICES
    )
    flag_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )
    child_type = models.CharField(
        max_length=20,
        choices=CHILDREN_CHOICES,
        default='MAIN_GROUP'
    )

    content_panels = Page.content_panels + [
        FieldPanel('language'),
        FieldPanel('flag_image'),
        FieldPanel('slug'),
        FieldPanel('path_slug', read_only=True),
    ]

    subpage_types = ['MainGroupWithSubGroups', 'MainGroupwithGroupExercises']


class MainGroup(GroupBase):
    parent_page_types = ['LanguageCategoryPage']
    subpage_types = ['SubGroup']


class SubGroup(GroupBase):
    subpage_types = ['SubGroup', 'GroupExercise']


class SubGroupWithSubGroups(GroupBase):
    child_type = models.CharField(
        max_length=20,
        choices=CHILDREN_CHOICES,
        default='SUB_GROUP'
    )
    parent_page_types = ['MainGroupwithSubGroups', 'SubGroupWithSubGroups']
    subpage_types = ['SubGroupWithSubGroups', 'SubGroupWithGroupExercises']
    content_panels = GroupBase.content_panels + [
        FieldPanel('child_type'),
    ]


class SubGroupWithGroupExercises(GroupBase):
    child_type = models.CharField(
        max_length=20,
        choices=CHILDREN_CHOICES,
        default='GROUP_EXERCISE'
    )
    subpage_types = ['GroupExercise']
    content_panels = GroupBase.content_panels + [
        FieldPanel('child_type'),
    ]


class MainGroupWithGroupExercises(GroupBase):
    child_type = models.CharField(
        max_length=20,
        choices=CHILDREN_CHOICES,
        default='GROUP_EXERCISE'
    )
    parent_page_types = ['LanguageCategoryPage']
    subpage_types = ['GroupExercise']
    content_panels = GroupBase.content_panels + [
        FieldPanel('child_type'),
    ]


class MainGroupWithSubGroups(GroupBase):
    child_type = models.CharField(
        max_length=20,
        choices=CHILDREN_CHOICES,
        default='SUB_GROUP'
    )
    subpage_types = ['SubGroupWithGroupExercises', 'SubGroupWithSubGroups']
    content_panels = GroupBase.content_panels + [
        FieldPanel('child_type'),
    ]


GroupBase.UNIQUE_SLUG_CLASSES = [
    MainGroupWithSubGroups,
    SubGroupWithGroupExercises,
    GroupExercise,
]
