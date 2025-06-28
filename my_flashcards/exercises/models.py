from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
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

class PathSlugIndex(models.Model):
    path_slug = models.SlugField(unique=True)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    def __str__(self):
        return f"{self.path_slug} → {self.content_type}:{self.object_id}"

class PageWithPathSlugManager(PageManager):
    PATH_SLUG_MODELS = [
        'LanguageCategoryPage',
        'MainGroup',
        'SubGroup',
        'SubGroupWithSubGroups',
        'SubGroupWithGroupExercises',
        'MainGroupWithGroupExercises',
        'MainGroupWithSubGroups',

    ]

    def get_by_path_slug(self, path_slug):
        return self.get(path_slug=path_slug)

    def get_by_path_slug_or_404(self, path_slug):
        return get_object_or_404(self.get_queryset(), path_slug=path_slug)

    def find_page_by_path_slug(path_slug):
        try:
            index = PathSlugIndex.objects.select_related('content_type').get(path_slug=path_slug)
            return index.content_object
        except PathSlugIndex.DoesNotExist:
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
        content_type = ContentType.objects.get_for_model(self)
        PathSlugIndex.objects.update_or_create(
            path_slug=self.path_slug,
            defaults={
                "content_type": content_type,
                "object_id": self.id,
            }
        )

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
    # description = models.TextField(blank=True)
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
    main_description = models.TextField(blank=True)
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
    main_description = models.TextField(blank=True)
    child_type = models.CharField(
        max_length=20,
        choices=CHILDREN_CHOICES,
        default='GROUP_EXERCISE'
    )
    parent_page_types = ['LanguageCategoryPage']
    subpage_types = ['GroupExercise']
    content_panels = GroupBase.content_panels + [
        FieldPanel('child_type'),
        FieldPanel('main_description'),
    ]


class MainGroupWithSubGroups(GroupBase):
    main_description = models.TextField(blank=True)
    child_type = models.CharField(
        max_length=20,
        choices=CHILDREN_CHOICES,
        default='SUB_GROUP'
    )
    subpage_types = ['SubGroupWithGroupExercises', 'SubGroupWithSubGroups']
    content_panels = GroupBase.content_panels + [
        FieldPanel('child_type'),
        FieldPanel('main_description'),
    ]


GroupBase.UNIQUE_SLUG_CLASSES = [
    MainGroupWithSubGroups,
    SubGroupWithGroupExercises,
    GroupExercise,
]
