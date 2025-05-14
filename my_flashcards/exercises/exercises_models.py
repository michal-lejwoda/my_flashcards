from django.db import models
from wagtail.admin.panels import FieldPanel
from wagtail.fields import StreamField
# from wagtail.images.blocks import ImageChooserBlock
from wagtail.models import Page
from wagtail import blocks, images
#
# class ExamPage(Page):
#     description = models.TextField(blank=True)
#
#     content_panels = Page.content_panels + [
#         FieldPanel('description'),
#     ]
#
# from my_flashcards.exercises.models import ExerciseBase
# class MatchExercise(ExerciseBase):
#     description = models.TextField(help_text="Opisz ćwiczenie")
#
#     pairs = StreamField([
#         ('pair',  blocks.ListBlock(
#             blocks.StructBlock([
#                 ('left_item', blocks.CharBlock(max_length=255)),
#                 ('right_item', blocks.CharBlock(max_length=255))
#             ])
#         ))
#     ], blank=True, use_json_field=True)
#
#     content_panels = Page.content_panels + [
#         FieldPanel('description'),
#         FieldPanel('pairs'),
#     ]


#
#
# class MatchExerciseTextWithImage(Page):
#     description = models.TextField()
#     pairs = StreamField(
#         [
#             ('pair', blocks.ListBlock(
#                 blocks.StructBlock([
#                     ('left_item', blocks.CharBlock(max_length=255)),
#                     ('right_item', ImageChooserBlock())
#                 ])
#             ))
#         ],
#         blank=True,
#         use_json_field=True
#     )
#
#     content_panels = Page.content_panels + [
#         FieldPanel('description'),
#         FieldPanel('pairs'),
#     ]
#
# class FillInTheBlanksExercise(Page):
#     description = models.TextField(help_text="Opis ćwiczenia")
#
#
#
#     content = StreamField([
#         ('paragraph', blocks.RichTextBlock()),
#         ('blank', blocks.ChoiceBlock(choices=[
#             ('option_1', 'Opcja 1'),
#             ('option_2', 'Opcja 2'),
#             ('option_3', 'Opcja 3'),
#         ], blank=True)),
#     ], blank=True,use_json_field=True)
#
#     content_panels = Page.content_panels + [
#         FieldPanel('description'),
#         FieldPanel('content'),
#     ]
#
# class GapFillFullTextExercise(Page):
#     description = models.TextField()
#     image = models.ImageField(null=True, blank=True)
#     text = models.TextField(help_text="Użyj placeholderów jak {{gap1}}, {{gap2}} itd.")
#
#     gaps = StreamField([
#         ('gap', blocks.StructBlock([
#             ('placeholder', blocks.CharBlock(help_text="Nazwa luki, np. gap1")),
#             ('options', blocks.ListBlock(blocks.CharBlock(), min_num=2, max_num=5)),
#             ('correct_answer', blocks.CharBlock(help_text="Poprawna odpowiedź")),
#         ]))
#     ], blank=True, use_json_field=True)
#
#     content_panels = Page.content_panels + [
#         FieldPanel('description'),
#         FieldPanel('text'),
#         FieldPanel('gaps'),
#     ]
#
