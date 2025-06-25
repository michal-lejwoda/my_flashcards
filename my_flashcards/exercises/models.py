from django.contrib.auth import get_user_model
from django.db import models
from wagtail.admin.panels import FieldPanel
from wagtail.models import Page


from my_flashcards.exercises.choices import LANGUAGE_CHOICES, CHILDREN_CHOICES
from my_flashcards.exercises.exercises_models import GroupExercise
from my_flashcards.exercises.mixins import UniqueSlugAcrossGroupPagesMixin

User = get_user_model()

def audio_upload_path(instance, filename):
    return f"audio/{filename}"


#Abstract classes
class GroupBase(Page, UniqueSlugAcrossGroupPagesMixin):
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
    path_slug = models.CharField(max_length=255, editable=False, blank=True, null=True, unique=True)
    content_panels = Page.content_panels + [
        FieldPanel('background_image'),
        FieldPanel('background_image_with_text'),
        FieldPanel('is_displayed'),
        FieldPanel('is_multi'),
        FieldPanel('path_slug',read_only=True),
    ]

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):

        self.path_slug = self.generate_path_slug()
        super().save(*args, **kwargs)

    def generate_path_slug(self):
        base_slug = self._build_base_path_slug()
        path_slug = base_slug
        counter = 1

        while Page.objects.filter(path_slug=path_slug).exclude(pk=self.pk).exists():
            path_slug = f"{base_slug}-{counter}"
            counter += 1

        return path_slug

    def _build_base_path_slug(self):
        parts = []
        current = self.get_parent()
        while current and hasattr(current, 'slug'):
            if current.slug in ["root", "home"]:
                current = current.get_parent()
                continue
            parts.insert(0, current.slug)
            current = current.get_parent()
        parts.append(self.slug)
        return "/".join(parts)

class LanguageCategoryPage(Page, UniqueSlugAcrossGroupPagesMixin):
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
        FieldPanel('slug')

    ]
    subpage_types = ['MainGroupWithSubGroups', 'MainGroupwithGroupExercises',]


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
    subpage_types = ['SubGroupWithGroupExercises',
                     'SubGroupWithSubGroups'
                    ]
    content_panels = GroupBase.content_panels + [
        FieldPanel('child_type'),
    ]

GroupBase.UNIQUE_SLUG_CLASSES = [
    MainGroupWithSubGroups,
    SubGroupWithGroupExercises,
    GroupExercise,
]
