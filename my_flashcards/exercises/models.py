from django.db import models
from django.utils.translation import gettext as _
from modelcluster.fields import ParentalKey
# # from docutils.utils.math.tex2mathml_extern import blahtexml
from wagtail.admin.panels import FieldPanel, InlinePanel
from wagtail.fields import StreamField
# from wagtail.images.blocks import ImageChooserBlock
from wagtail.models import Page, Orderable
from wagtail import blocks, images
# # from wagtailimages import Image

LANGUAGE_CHOICES = [
    ('de', _('German')),
    ('en', _('English')),
    ('pl', _('Polish')),
]

#Abstract classes
class GroupBase(Page):
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


class ExerciseBase(Page):
    description = models.TextField()

    content_panels = Page.content_panels + [
        FieldPanel('description'),
    ]
    subpage_types = ['MatchExercise']


#Normal classes
class LanguageCategoryPage(Page):
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

    content_panels = Page.content_panels + [
        FieldPanel('language'),
        FieldPanel('flag_image'),
    ]
    subpage_types = ['MainGroup']


class MainGroup(GroupBase):
    parent_page_types = ['LanguageCategoryPage']
    subpage_types = ['SubGroup']

class SubGroup(GroupBase):
    subpage_types = ['SubGroup', 'GroupExercise']



class GroupExercise(Page):
    introduction = models.TextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('introduction'),
        InlinePanel('exercise_links', label='Exercises'),
    ]

    parent_page_types = ['SubGroup']
    # subpage_types = ['GroupExerciseItem']


class GroupExerciseItem(Orderable):
    group = ParentalKey(
        GroupExercise,
        on_delete=models.CASCADE,
        related_name='exercise_links',
    )
    exercise = models.ForeignKey(
        'ExerciseBase',
        on_delete=models.CASCADE,
        related_name='+'
    )

    panels = [
        FieldPanel('exercise'),
    ]
    subpage_types = ['MatchExercise']

class MatchExercise(ExerciseBase):

    pairs = StreamField([
        ('pair',  blocks.ListBlock(
            blocks.StructBlock([
                ('left_item', blocks.CharBlock(max_length=255)),
                ('right_item', blocks.CharBlock(max_length=255))
            ])
        ))
    ], blank=True, use_json_field=True)

    content_panels = Page.content_panels + [
        FieldPanel('description'),
        FieldPanel('pairs'),
    ]
# class GroupExercise(Page):
#     pass
#
# class ExerciseAbstract(Page):
#     text = models.CharField()



# class ExercisePage(Page):
#     language = models.CharField(
#         max_length=2,
#         choices=LANGUAGE_CHOICES,
#         default='de'
#     )
#
#     content_panels = Page.content_panels + [
#         FieldPanel('language'),
#     ]
#
#     class Meta:
#         abstract = True
#
# class Group(Page):
#     image = models.ForeignKey(
#         'wagtailimages.Image',
#         null=True,
#         blank=True,
#         on_delete=models.SET_NULL,
#         related_name='+'
#     )
#     is_children_group = models.BooleanField(default=True)
#     is_children_exercise = models.BooleanField(default=False)
#
#     content_panels = Page.content_panels + [
#         FieldPanel('title'),
#         FieldPanel('image'),
#         FieldPanel('is_children_group'),
#         FieldPanel('is_children_exercise'),
#     ]
#
#
# class GroupWithNumberExercises(Page):
#     pass
#
# class MainGroup(Page):
#     background_url = ImageChooserBlock(null=True, blank=True)
#     background_image = ImageChooserBlock(null=True, blank=True)
#
# class GroupExercisePage(Orderable):
#     exercises = models.ManyToManyField(ExercisePage)
#
#
# class ExerciseField(Page):
#     pass
#
#
# # class ExerciseDisplay(Page):
# #     exercise = models.ForeignKey(ExercisePage)
# #     score = models.IntegerField(default=0)
# #     max_points = models.IntegerField(default=0)
# #     user_tried = models.BooleanField(default=False)
#
#
