from django.db import models
from django.utils.translation import gettext as _
from modelcluster.fields import ParentalKey
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError
from slugify import slugify
from wagtail import blocks
from wagtail.admin.panels import FieldPanel, InlinePanel
from wagtail.fields import StreamField
from wagtail.images.blocks import ImageChooserBlock
from wagtail.models import Page, Orderable

User = get_user_model()
#subpage_function
def get_exercise_subpage_type():
    from wagtail.models import Page
    subclasses = ExerciseBase.__subclasses__()
    return [f"{cls._meta.app_label}.{cls.__name__}" for cls in subclasses
            if issubclass(cls, Page) and not cls._meta.abstract]

# rest
LANGUAGE_CHOICES = [
    ('de', _('German')),
    ('en', _('English')),
    ('pl', _('Polish')),
]

CHILDREN_CHOICES = [
    ('MAIN_GROUP', 'Main group'),
    ('SUB_GROUP', 'Sub group'),
    ('GROUP_EXERCISE', 'Group exercise'),
    ('EXERCISE', 'Exercise'),
]
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


class ExerciseBase(Page):
    description = models.TextField()

    content_panels = Page.content_panels + [
        FieldPanel('description'),
    ]
    subpage_types = ['MatchExercise']

    def check_answer(self, user, user_answers):
        raise NotImplementedError("Classes should implement this method")

    def save_attempt(self, user, answers, score, max_score):
        attempt, created = ExerciseAttempt.objects.update_or_create(
            user=user,
            exercise=self,
            defaults={
                'score': score,
                'max_score': max_score,
                'completed': True
            }
        )
        return attempt



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

#Important First exercises then Group Exercise
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
    def check_answer(self, user, user_answers):
        correct_answers = []
        for block in self.pairs:
            if block.block_type == 'pair':
                for pair in block.value:
                    left_item = pair.get('left_item')
                    right_item = pair.get('right_item')
                    correct_answers.append({
                        'left_item': left_item,
                        'right_item': right_item
                    })
        score = 0
        result_answers = []
        for answer in user_answers:
            if answer in correct_answers:
                answer['correct'] = True
                result_answers.append(answer)
                score += 1
            else:
                answer['correct'] = False
                result_answers.append(answer)
        max_score = len(correct_answers)
        return {"score": score, "max_score": max_score, "result_answers": result_answers}

class MatchExerciseTextWithImage(ExerciseBase):
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

class GroupExercise(Page):
    introduction = models.TextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('introduction'),
        # InlinePanel('exercise_links', label='Exercises'),
    ]

    parent_page_types = ['SubGroupWithGroupExercises', 'MainGroupwithGroupExercises']
    subpage_types = get_exercise_subpage_type()


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


class ExerciseAttempt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='exercise_attempts')
    exercise = models.ForeignKey('ExerciseBase', on_delete=models.CASCADE, related_name='attempts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    score = models.IntegerField(default=0)
    max_score = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']


class MatchExerciseAnswer(models.Model):
    attempt = models.ForeignKey(ExerciseAttempt, on_delete=models.CASCADE, related_name='answers')
    left_item_index = models.IntegerField()
    right_item_index = models.IntegerField()
    is_correct = models.BooleanField(default=False)

GroupBase.UNIQUE_SLUG_CLASSES = [
    MainGroupWithSubGroups,
    SubGroupWithGroupExercises,
    GroupExercise,
]
