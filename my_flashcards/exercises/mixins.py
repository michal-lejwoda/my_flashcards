from wagtail.admin.panels import FieldPanel
from wagtail.fields import StreamField
from wagtail.models import Page
from slugify import slugify
from django.db import models

from my_flashcards.exercises.blocks import HeaderImageBlock, TextContentBlock, AudioContentBlock, TwoColumnBlock, \
    SpacerBlock

class AutoNumberedQuestionsMixin:
    def save(self, *args, **kwargs):
        self._auto_number_questions()
        super().save(*args, **kwargs)

    def _auto_number_questions(self):
        question_counter = 1
        for block in self.exercises:
            if block.block_type == 'options':
                block.value['question_id'] = str(question_counter)
                question_counter += 1

class UniqueSlugAcrossGroupPagesMixin:
    UNIQUE_SLUG_CLASSES = []

    def generate_unique_slug(self, base_slug):
        slug = base_slug
        i = 1
        while Page.objects.filter(slug=slug).exclude(id=self.id).specific().filter(
            lambda p: isinstance(p, tuple(self.UNIQUE_SLUG_CLASSES))
        ):
            slug = f"{base_slug}-{i}"
            i += 1
        return slug

    def clean(self):
        if not self.slug:
            base_slug = slugify(self.title)
            self.slug = self.generate_unique_slug(base_slug)
        else:
            self.slug = self.generate_unique_slug(self.slug)

        super().clean()

class LayoutMixin(models.Model):
    before_layout_config = StreamField([
        ('header_image', HeaderImageBlock()),
        ('text_content', TextContentBlock()),
        ('audio_content', AudioContentBlock()),
        ('two_column', TwoColumnBlock()),
        ('spacer', SpacerBlock()),
    ], use_json_field=True, blank=True)

    after_layout_config = StreamField([
        ('header_image', HeaderImageBlock()),
        ('text_content', TextContentBlock()),
        ('audio_content', AudioContentBlock()),
        ('two_column', TwoColumnBlock()),
        ('spacer', SpacerBlock()),
    ], use_json_field=True, blank=True)

    layout_panels = [
        FieldPanel('before_layout_config'),
        FieldPanel('after_layout_config'),
    ]

    class Meta:
        abstract = True
