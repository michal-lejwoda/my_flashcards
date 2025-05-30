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
    content_panels = Page.content_panels + [
        FieldPanel('background_image'),
        FieldPanel('background_image_with_text'),
    ]

    class Meta:
        abstract = True


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
