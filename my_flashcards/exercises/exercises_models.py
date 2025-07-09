from django.apps import apps
from django.contrib.auth import get_user_model
from django.db import models
from modelcluster.fields import ParentalKey
from wagtail import blocks
from wagtail.admin.panels import FieldPanel, InlinePanel
from wagtail.fields import StreamField
from wagtail.images.blocks import ImageChooserBlock
from wagtail.models import Page, Orderable
from wagtailmedia.blocks import AudioChooserBlock

from my_flashcards.exercises.blocks import HeaderImageBlock, TwoColumnBlock, SpacerBlock, TextContentBlock, \
    AudioContentBlock
from my_flashcards.exercises.checks import MatchExercisesCheck
from my_flashcards.exercises.choices import PERSON_SETS
from my_flashcards.exercises.mixins import AutoNumberedQuestionsMixin, LayoutMixin
from my_flashcards.exercises.structures import BlankOptionBlock, MultipleOptionToChoose, ListenOptionToChoose
from my_flashcards.exercises.utils import check_user_answers, check_user_answers_another_option, \
    get_exercise_subpage_type
from my_flashcards.exercises.validators import validate_mp3

User = get_user_model()

def audio_upload_path(instance, filename):
    return f"audio/{filename}"

class ExerciseBase(Page):
    description = models.TextField()
    type = models.CharField(max_length=255, null=True, default="ExerciseBase")

    content_panels = Page.content_panels + [
        FieldPanel('type'),
        FieldPanel('description'),
    ]
    subpage_types = ['MatchExercise']

    def save(self, *args, **kwargs):
        self.type = self.__class__.__name__
        super().save(*args, **kwargs)

    def check_answer(self, user, user_answers):
        raise NotImplementedError("Classes should implement this method")

    def save_attempt(self, user, answers, score, max_score, detailed_results=None):
        attempt, created = ExerciseAttempt.objects.update_or_create(
            user=user,
            exercise=self,
            defaults={
                'score': score,
                'max_score': max_score,
                'completed': True,
                'raw_user_answers': answers,
                'detailed_results': detailed_results or {}
            }
        )
        return attempt


class MatchExercise(ExerciseBase, MatchExercisesCheck, LayoutMixin):
    pairs = StreamField([
        ('pair',  blocks.ListBlock(
            blocks.StructBlock([
                ('left_item', blocks.CharBlock(max_length=255)),
                ('right_item', blocks.CharBlock(max_length=255))
            ])
        ))
    ], blank=True, use_json_field=True)

    content_panels = ExerciseBase.content_panels + [
        FieldPanel('pairs'),
    ] + LayoutMixin.layout_panels

    def check_answer(self, user, user_answers):
        correct_answers = self.check_pair_exercises(self.pairs)
        result = check_user_answers(user_answers, correct_answers)
        if not user.is_anonymous:
            self.save_attempt(user, user_answers, result['score'], result['max_score'], result)

        return result


class MatchExerciseTextWithImage(ExerciseBase, MatchExercisesCheck, LayoutMixin):
    pairs = StreamField(
        [
            ('pair', blocks.ListBlock(
                blocks.StructBlock([
                    ('left_item', ImageChooserBlock()),
                    ('right_item', blocks.CharBlock(max_length=255))
                ])
            ))
        ],
        blank=True,
        use_json_field=True
    )

    content_panels = ExerciseBase.content_panels + [
        FieldPanel('pairs'),
    ] + LayoutMixin.layout_panels

    def check_answer(self, user, user_answers):
        correct_answers = self.check_pair_exercises(self.pairs)
        print("correct_answers", correct_answers)
        result = check_user_answers(user_answers, correct_answers)
        self.save_attempt(user, user_answers, result['score'], result['max_score'], result)
        return result

class FillInTextExerciseWithChoices(ExerciseBase, LayoutMixin):
    text_with_blanks = models.TextField(
        help_text="Use {{1}}, {{2}}, {{3}} in blanks."
    )
    blanks = StreamField(
        [('blank', BlankOptionBlock())],
        use_json_field=True,
        blank=True,
    )

    content_panels = ExerciseBase.content_panels + [
        FieldPanel('text_with_blanks'),
        FieldPanel('blanks'),
    ] + LayoutMixin.layout_panels

    def check_answer(self, user, user_answers):
        user_answer_map = {a['blank_id']: a['answer'] for a in user_answers}

        result_answers = []
        score = 0

        for block in self.blanks:
            if block.block_type != 'blank':
                continue

            val = block.value
            blank_id = val.get("blank_id")
            correct_answer = val.get("correct_answer")
            user_answer = user_answer_map.get(blank_id)

            is_correct = user_answer == correct_answer
            if is_correct:
                score += 1

            result_answers.append({
                "blank_id": blank_id,
                "provided_answer": user_answer,
                "correct_answer": correct_answer,
                "correct": is_correct
            })

        result = {
            "score": score,
            "max_score": len(result_answers),
            "result_answers": result_answers
        }

        self.save_attempt(user, user_answers, score, len(result_answers), result)

        return result

    # def _save_detailed_answers(self, attempt, user_answers, detailed_results):
    #     if 'result_answers' in detailed_results:
    #         for answer_data in detailed_results['result_answers']:
    #             UserAnswer.objects.create(
    #                 attempt=attempt,
    #                 question_identifier=f"blank_{answer_data['blank_id']}",
    #                 user_response=answer_data['provided_answer'],
    #                 correct_answer=answer_data['correct_answer'],
    #                 is_correct=answer_data['correct'],
    #                 question_type='fill_blank'
    #             )

class FillInTextExerciseWithChoicesWithImageDecoration(FillInTextExerciseWithChoices):
    image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )
    content_panels = FillInTextExerciseWithChoices.content_panels + [
        FieldPanel('image'),
    ]

class FillInTextExerciseWithPredefinedBlocks(ExerciseBase, LayoutMixin):
    text_with_blanks = models.TextField(
        help_text="Use {{1}}, {{2}}, {{3}} in blanks."
    )
    options = StreamField(
        [
            ("options", blocks.ListBlock(
                blocks.StructBlock([
                    ("blank_id", blocks.IntegerBlock(help_text="Blank number (ie. 1 for {{1}})")),
                    ("answer", blocks.CharBlock(label="Option")),
                ]),
                label="List of possible options"
            )),
        ],
        use_json_field=True,
        blank=True,
        max_num=1
    )

    content_panels = ExerciseBase.content_panels + [
        FieldPanel('text_with_blanks'),
        FieldPanel('options')
    ] + LayoutMixin.layout_panels

    def check_answer(self, user, user_answers):
        user_answer_map = {a['blank_id']: a['answer'] for a in user_answers}
        result_answers = []
        score = 0

        for block in self.options:
            if block.block_type != 'options':
                continue

            for val in block.value:
                blank_id = val.get("blank_id")
                correct_answer = val.get("answer")
                user_answer = user_answer_map.get(blank_id)

                is_correct = user_answer == correct_answer
                if is_correct:
                    score += 1

                result_answers.append({
                    "block_id": blank_id,
                    "provided_answer": user_answer,
                    "correct_answer": correct_answer,
                    "correct": is_correct
                })
        #TODO Clean it up
        self.save_attempt(user, user_answers, score, len(result_answers), {
            "score": score,
            "max_score": len(result_answers),
            "result_answers": result_answers
        })
        return {
            "score": score,
            "max_score": len(result_answers),
            "result_answers": result_answers
        }

class ConjugationExercise(ExerciseBase, LayoutMixin):
    instruction = models.TextField(blank=True)
    person_set = models.CharField(
        max_length=50,
        choices=PERSON_SETS,
        blank=True
    )

    conjugation_rows = StreamField([
        ('row', blocks.StructBlock([
            ('person_label', blocks.CharBlock(label="Person")),
            ('correct_form', blocks.CharBlock(label="Form", required=False)),
            ('is_pre_filled', blocks.BooleanBlock(label="Is prefilled?", required=False)),
        ]))
    ], use_json_field=True, blank=True)

    content_panels = ExerciseBase.content_panels + [
        FieldPanel('instruction'),
        FieldPanel('person_set'),
        FieldPanel('conjugation_rows'),
    ] + LayoutMixin.layout_panels

    def check_answer(self, user, user_answers):
        user_answer_map = {a['person_label']: a['answer'] for a in user_answers}
        result_answers = []
        score = 0

        for block in self.conjugation_rows:
            values = block.value
            person_label = values['person_label']
            correct_answer = values["correct_form"]
            is_pre_filled = values["is_pre_filled"]

            if not is_pre_filled:
                user_answer = user_answer_map.get(person_label)

                result = {
                    "person_label": person_label,
                    "provided_answer": user_answer,
                    "correct_answer": correct_answer
                }

                if user_answer == correct_answer:
                    result["correct"] = True
                    score += 1
                else:
                    result["correct"] = False

                result_answers.append(result)

        result = {
            "score": score,
            "max_score": len(result_answers),
            "result_answers": result_answers
        }

        self.save_attempt(user, user_answers, score, len(result_answers), result)

        return result

    def _save_detailed_answers(self, attempt, user_answers, detailed_results):
        if 'result_answers' in detailed_results:
            for answer_data in detailed_results['result_answers']:
                UserAnswer.objects.create(
                    attempt=attempt,
                    question_identifier=f"person_{answer_data['person_label']}",
                    user_response=answer_data['provided_answer'],
                    correct_answer=answer_data['correct_answer'],
                    is_correct=answer_data['correct'],
                    question_type='conjugation'
                )
### TODO MOve to structures
class MultipleOptionToChooseWithAudio(MultipleOptionToChoose):
    audio = AudioChooserBlock(
        help_text="Upload mp3 file",
        required=False
    )
    #TODO CXECK THIS One

class ListenOptionToChooseWithAudio(ListenOptionToChoose):
    audio = models.FileField(
        upload_to=audio_upload_path,
        help_text="Upload mp3 file",
        validators=[validate_mp3]
    )
    #TODO  Check this one

class ListenOptionToChooseWithText(ListenOptionToChoose):
    text = blocks.TextBlock(required=False, help_text="text")
    # TODO  Check this one
###
class ListenExerciseWithOptionsToChoose(ExerciseBase,AutoNumberedQuestionsMixin, LayoutMixin):
    audio = models.FileField(
        upload_to=audio_upload_path,
        help_text="Upload mp3 file",
        validators=[validate_mp3]
    )
    exercises = StreamField(
        [('options', ListenOptionToChoose())],
        use_json_field=True,
        blank=True,
    )
    content_panels = ExerciseBase.content_panels + [
        FieldPanel('audio'),
        FieldPanel('exercises'),
    ] + LayoutMixin.layout_panels

    def check_answer(self, user, user_answers):
        user_answer_map = {a['question_id']: a['answer'] for a in user_answers}
        result =  check_user_answers_another_option(user_answer_map, self.exercises)
        self.save_attempt(user, user_answers, result['score'], result['max_score'], result)
        return result

class ListenWithManyOptionsToChooseToSingleExercise(ExerciseBase, AutoNumberedQuestionsMixin, LayoutMixin):
    exercises = StreamField(
        [('options', MultipleOptionToChooseWithAudio())],
        use_json_field=True,
        blank=True,
    )
    content_panels = ExerciseBase.content_panels + [
        FieldPanel('exercises'),
    ] + LayoutMixin.layout_panels

    def check_answer(self, user, user_answers):
        user_answer_map = {a['question_id']: a['answers'] for a in user_answers}
        result_answers = []
        score = 0
        max_score = 0
        for block in self.exercises:
            max_score += 1
            values = block.value
            question_id = values.get('question_id')
            correct_answers = values.get('correct_answers', [])
            user_answer = user_answer_map.get(question_id)
            if not isinstance(user_answer, list):
                user_answer = [user_answer] if user_answer is not None else []
            is_correct = set(user_answer) == set(correct_answers)
            result_answers.append({
                "person_label": question_id,
                "provided_answer": user_answer,
                "correct_answer": list(correct_answers),
                "correct": is_correct
            })
            if is_correct:
                score += 1
        result = {
            "score": score,
            "max_score": max_score,
            "result_answers": result_answers
        }
        # TODO Comeback here
        self.save_attempt(user, user_answers, score, max_score, result)
        return result

class ChooseExerciseDependsOnMultipleTexts(ExerciseBase, AutoNumberedQuestionsMixin, LayoutMixin):
    exercises = StreamField(
        [('options', ListenOptionToChooseWithText())],
        use_json_field=True,
        blank=True,
    )
    content_panels = ExerciseBase.content_panels + [
        FieldPanel('exercises'),
    ] + LayoutMixin.layout_panels

    def check_answer(self, user, user_answers):
        user_answer_map = {a['question_id']: a['answer'] for a in user_answers}
        return check_user_answers_another_option(user_answer_map, self.exercises)

class ChooseExerciseDependsOnSingleText(ExerciseBase, AutoNumberedQuestionsMixin, LayoutMixin):
    text = models.TextField(blank=True)
    exercises = StreamField(
        [('options', ListenOptionToChoose())],
        use_json_field=True,
        blank=True,
    )

    content_panels = ExerciseBase.content_panels + [
        FieldPanel('text'),
        FieldPanel('exercises'),
    ] + LayoutMixin.layout_panels

    def check_answer(self, user, user_answers):
        user_answer_map = {a['question_id']: a['answer'] for a in user_answers}
        result = check_user_answers_another_option(user_answer_map, self.exercises)
        self.save_attempt(user, user_answers, result['score'], result['max_score'], result)
        return result

#TODO WORK WITH IT
class FlexibleExercisePage(ExerciseBase, LayoutMixin):
    layout_config = StreamField([
        ('header_image', HeaderImageBlock()),
        ('text_content', TextContentBlock()),
        ('audio_content', AudioContentBlock()),
        ('two_column', TwoColumnBlock()),
        ('spacer', SpacerBlock()),
    ], use_json_field=True, blank=True)

    embedded_exercise = models.ForeignKey(
        'ExerciseBase',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='embedded_in_flexible_pages',
        help_text="Main exercise for this page"
    )

    content_panels = ExerciseBase.content_panels + [
        FieldPanel('layout_config'),
        FieldPanel('embedded_exercise'),
    ] + LayoutMixin.layout_panels

    def check_answer(self, user, user_answers):
        if self.embedded_exercise:
            return self.embedded_exercise.specific.check_answer(user, user_answers)
        return {"score": 0, "max_score": 0, "result_answers": []}

class MultipleExercises(ExerciseBase, LayoutMixin):
    introduction = models.TextField(
        blank=True,
        help_text="Introduction to the set of exercises"
    )

    EXECUTION_MODES = [
        ('sequential', 'Sequential'),
        ('random', 'Random order'),
        ('all_at_once', 'All at once'),
    ]

    execution_mode = models.CharField(
        max_length=20,
        choices=EXECUTION_MODES,
        default='sequential',
        help_text="Method of performing exercises"
    )

    show_results_immediately = models.BooleanField(
        default=True,
        help_text="Show results after every exercise"
    )

    passing_score_percentage = models.IntegerField(
        default=70,
        help_text="Minimum percentage of points required to pass (0-100)"
    )

    content_panels = ExerciseBase.content_panels + [
        FieldPanel('introduction'),
        FieldPanel('execution_mode'),
        FieldPanel('show_results_immediately'),
        FieldPanel('passing_score_percentage'),
        InlinePanel('exercise_items', label="Exercises"),
    ] + LayoutMixin.layout_panels

    def check_answer(self, user, user_answers):
        answers = []
        score = 0
        max_score = 0
        for exercise in user_answers:
            model_class = apps.get_model('exercises', exercise['type'])
            instance = model_class.objects.get(id=exercise['id'])
            result = instance.check_answer(user, exercise['answers'])
            score += result['score']
            max_score += result['max_score']
            answers.append(result)
            self.save_attempt(user, user_answers, result['score'], result['max_score'], result)
        result = {"answers": answers, "score": score, "max_score": max_score}
        return result

class MultipleExercisesItem(Orderable):
    multiple_exercises = ParentalKey(
        MultipleExercises,
        on_delete=models.CASCADE,
        related_name='exercise_items',
    )

    exercise = models.ForeignKey(
        'ExerciseBase',
        on_delete=models.CASCADE,
        related_name='multiple_exercise_items'
    )

    is_optional = models.BooleanField(
        default=False,
        help_text="Is exercise optional?"
    )

    weight = models.IntegerField(
        default=1,
        help_text="Weight of this exercise in the final grade"
    )

    panels = [
        FieldPanel('exercise'),
        FieldPanel('is_optional'),
        FieldPanel('weight'),
    ]

    class Meta:
        verbose_name = "Exercise in the set"
        verbose_name_plural = "Exercises in the set"

class GroupExercise(Page):
    introduction = models.TextField(blank=True)
    is_displayed = models.BooleanField(default=True)
    is_multi = models.BooleanField(default=False)

    content_panels = Page.content_panels + [
        FieldPanel('introduction'),
        FieldPanel('is_displayed'),
        FieldPanel('is_multi'),
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
    raw_user_answers = models.JSONField(default=dict, blank=True)
    detailed_results = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ['-created_at']

    @property
    def percentage_score(self):
        if self.max_score == 0:
            return 0
        return round((self.score / self.max_score) * 100, 2)

# TODO REMOVE LATER
class UserAnswer(models.Model):
    attempt = models.ForeignKey(ExerciseAttempt, on_delete=models.CASCADE, related_name='user_answers')
    question_identifier = models.CharField(max_length=255)
    user_response = models.JSONField()
    correct_answer = models.JSONField()
    is_correct = models.BooleanField(default=False)
    question_type = models.CharField(max_length=100)

    class Meta:
        ordering = ['question_identifier']



