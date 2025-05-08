import django.utils.text
from django.db import models
from wagtail.admin.panels import FieldPanel
from wagtail import blocks

from wagtail.fields import StreamField
from wagtail.models import Page
from wagtail.images.blocks import ImageChooserBlock
from django.utils.translation import gettext as _


LANGUAGE_CHOICES = [
    ('de', _('German')),
    ('en', _('English')),
    ('pl', _('Polish')),
]

class LanguageCategoryPage(Page):
    language = models.CharField(
        max_length=2,
        choices=LANGUAGE_CHOICES
    )
    image = models.ImageField()

    content_panels = Page.content_panels + [
        FieldPanel('language'),
    ]

class ExercisePage(Page):
    language = models.CharField(
        max_length=2,
        choices=LANGUAGE_CHOICES,
        default='de'
    )

    content_panels = Page.content_panels + [
        FieldPanel('language'),
    ]

    class Meta:
        abstract = True

class Group(Page):
    image = models.ImageField()

class ExamPage(Page):
    description = models.TextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('description'),
    ]

class MatchExercise(Page):

    description = models.TextField(help_text="Opisz ćwiczenie")

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


class MatchExerciseTextWithImage(Page):
    description = models.TextField()
    pairs = StreamField(
        [
            ('pair', blocks.ListBlock(
                blocks.StructBlock([
                    ('left_item', blocks.CharBlock(max_length=255)),
                    ('right_item', ImageChooserBlock())
                ])
            ))
        ],
        blank=True,
        use_json_field=True
    )

    content_panels = Page.content_panels + [
        FieldPanel('description'),
        FieldPanel('pairs'),
    ]

class FillInTheBlanksExercise(Page):
    description = models.TextField(help_text="Opis ćwiczenia")



    content = StreamField([
        ('paragraph', blocks.RichTextBlock()),
        ('blank', blocks.ChoiceBlock(choices=[
            ('option_1', 'Opcja 1'),
            ('option_2', 'Opcja 2'),
            ('option_3', 'Opcja 3'),
        ], blank=True)),
    ], blank=True,use_json_field=True)

    content_panels = Page.content_panels + [
        FieldPanel('description'),
        FieldPanel('content'),
    ]

class GapFillFullTextExercise(Page):
    description = models.TextField()
    image = models.ImageField(null=True, blank=True)
    text = models.TextField(help_text="Użyj placeholderów jak {{gap1}}, {{gap2}} itd.")

    gaps = StreamField([
        ('gap', blocks.StructBlock([
            ('placeholder', blocks.CharBlock(help_text="Nazwa luki, np. gap1")),
            ('options', blocks.ListBlock(blocks.CharBlock(), min_num=2, max_num=5)),
            ('correct_answer', blocks.CharBlock(help_text="Poprawna odpowiedź")),
        ]))
    ], blank=True, use_json_field=True)

    content_panels = Page.content_panels + [
        FieldPanel('description'),
        FieldPanel('text'),
        FieldPanel('gaps'),
    ]


