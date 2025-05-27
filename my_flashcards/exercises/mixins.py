from wagtail.models import Page
from slugify import slugify

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
