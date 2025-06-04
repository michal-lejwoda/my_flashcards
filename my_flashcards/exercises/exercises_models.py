from django.contrib.auth import get_user_model
from django.db import models
from modelcluster.fields import ParentalKey, ParentalManyToManyField
from modelcluster.models import ClusterableModel
from wagtail import blocks
from wagtail.admin.panels import FieldPanel, InlinePanel
from wagtail.fields import StreamField
from wagtail.images.blocks import ImageChooserBlock
from wagtail.models import Page, Orderable
from wagtailmedia.blocks import AudioChooserBlock

from my_flashcards.exercises.checks import MatchExercisesCheck
from my_flashcards.exercises.choices import PERSON_SETS
from my_flashcards.exercises.mixins import AutoNumberedQuestionsMixin
from my_flashcards.exercises.structures import BlankOptionBlock, MultipleOptionToChoose, ListenOptionToChoose
from my_flashcards.exercises.utils import check_user_answers, check_user_answers_another_option,  \
    get_exercise_subpage_type
from my_flashcards.exercises.validators import validate_mp3

User = get_user_model()

def audio_upload_path(instance, filename):
    return f"audio/{filename}"

class ExerciseBase(Page):
    description = models.TextField()

    content_panels = Page.content_panels + [
        FieldPanel('description'),
    ]
    subpage_types = ['MatchExercise']

    def check_answer(self, user, user_answers):
        raise NotImplementedError("Classes should implement this method")

    def save_attempt(self, user, answers, score, max_score):
        #TODO LATER
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

class MatchExercise(ExerciseBase, MatchExercisesCheck):
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
        correct_answers = self.check_pair_exercises(self.pairs)
        return check_user_answers(user_answers, correct_answers)

class MatchExerciseTextWithImage(ExerciseBase, MatchExercisesCheck):
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

    content_panels = Page.content_panels + [
        FieldPanel('description'),
        FieldPanel('pairs'),
    ]
    #TODO FIX IT
    def check_answer(self, user, user_answers):
        correct_answers = self.check_pair_exercises(self.pairs)
        return check_user_answers(user_answers, correct_answers)




class FillInTextExerciseWithChoices(ExerciseBase):
    text_with_blanks = models.TextField(
        help_text="Use {{1}}, {{2}}, {{3}} in blanks."
    )
    blanks = StreamField(
        [('blank', BlankOptionBlock())],
        use_json_field=True,
        blank=True,
    )

    content_panels = Page.content_panels + [
        FieldPanel('description'),
        FieldPanel('text_with_blanks'),
        FieldPanel('blanks'),
    ]
    #TODO CLEAN IT
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

        return {
            "score": score,
            "max_score": len(result_answers),
            "result_answers": result_answers
        }

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

class FillInTextExerciseWithPredefinedBlocks(ExerciseBase):
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

    content_panels = Page.content_panels + [
        FieldPanel('description'),
        FieldPanel('text_with_blanks'),
        FieldPanel('options')
    ]
    #TODO Clean it
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

        return {
            "score": score,
            "max_score": len(result_answers),
            "result_answers": result_answers
        }

class FillInTextExerciseWithPredefinedBlocksWithImageDecoration(FillInTextExerciseWithPredefinedBlocks):
    image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )
    content_panels = FillInTextExerciseWithPredefinedBlocks.content_panels + [
        FieldPanel('image'),
    ]

class ConjugationExercise(ExerciseBase):
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

    content_panels = Page.content_panels + [
        FieldPanel('description'),
        FieldPanel('instruction'),
        FieldPanel('person_set'),
        FieldPanel('conjugation_rows'),
    ]
    #TODO Clean it
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

        return {
            "score": score,
            "max_score": len(result_answers),
            "result_answers": result_answers
        }





class MultipleOptionToChooseWithAudio(MultipleOptionToChoose):
    audio = AudioChooserBlock(
        help_text="Upload mp3 file",
        required=False
    )


class ListenOptionToChooseWithAudio(ListenOptionToChoose):
    audio = models.FileField(
        upload_to=audio_upload_path,
        help_text="Upload mp3 file",
        validators=[validate_mp3]
    )

class ListenOptionToChooseWithText(ListenOptionToChoose):
    text = blocks.TextBlock(required=False, help_text="text")

class ListenExerciseWithOptionsToChoose(ExerciseBase,AutoNumberedQuestionsMixin):
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
    content_panels = Page.content_panels + [
        FieldPanel('audio'),
        FieldPanel('description'),
        FieldPanel('exercises'),
    ]

    #TODO Work with it
    def check_answer(self, user, user_answers):
        user_answer_map = {a['question_id']: a['answer'] for a in user_answers}
        return check_user_answers_another_option(user_answer_map, self.exercises)

class ListenWithManyOptionsToChooseToSingleExercise(ExerciseBase, AutoNumberedQuestionsMixin):
    exercises = StreamField(
        [('options', MultipleOptionToChooseWithAudio())],
        use_json_field=True,
        blank=True,
    )
    content_panels = Page.content_panels + [
        FieldPanel('description'),
        FieldPanel('exercises'),
    ]

    def check_answer(self, user, user_answers):
        user_answer_map = {a['question_id']: a['answers'] for a in user_answers}
        result_answers = []
        score = 0

        for block in self.exercises:
            if block.block_type != 'exercise':
                continue

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
                "correct_answer": correct_answers,
                "correct": is_correct
            })

            if is_correct:
                score += 1

        return {
            "score": score,
            "max_score": len(result_answers),
            "result_answers": result_answers
        }

class ChooseExerciseDependsOnMultipleTexts(ExerciseBase, AutoNumberedQuestionsMixin):
    exercises = StreamField(
        [('options', ListenOptionToChooseWithText())],
        use_json_field=True,
        blank=True,
    )
    content_panels = Page.content_panels + [
        FieldPanel('description'),
        FieldPanel('exercises'),
    ]

    def check_answer(self, user, user_answers):
        user_answer_map = {a['question_id']: a['answer'] for a in user_answers}
        return check_user_answers_another_option(user_answer_map, self.exercises)


class ChooseExerciseDependsOnSingleText(ExerciseBase, AutoNumberedQuestionsMixin):
    text = models.TextField(blank=True)
    exercises = StreamField(
        [('options', ListenOptionToChoose())],
        use_json_field=True,
        blank=True,
    )

    content_panels = Page.content_panels + [
        FieldPanel('text'),
        FieldPanel('description'),
        FieldPanel('exercises'),
    ]

    def check_answer(self, user, user_answers):
        user_answer_map = {a['question_id']: a['answer'] for a in user_answers}
        return check_user_answers_another_option(user_answer_map, self.exercises)


class MultipleExercises(ExerciseBase):
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

    content_panels = Page.content_panels + [
        FieldPanel('introduction'),
        FieldPanel('description'),
        FieldPanel('execution_mode'),
        FieldPanel('show_results_immediately'),
        FieldPanel('passing_score_percentage'),
        InlinePanel('exercise_items', label="Exercises"),
    ]

    def check_single_exercise(self, user, user_answers):
        pass

    def check_answer(self, user, user_answers):
        for exercise in user_answers['exercises']:
            pass
        # user_answer_map = {a['question_id']: a['answer'] for a in user_answers}
        # return check_user_answers_another_option(user_answer_map, self.exercises)
        return None

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

    class Meta:
        ordering = ['-created_at']


class MatchExerciseAnswer(models.Model):
    attempt = models.ForeignKey(ExerciseAttempt, on_delete=models.CASCADE, related_name='answers')
    left_item_index = models.IntegerField()
    right_item_index = models.IntegerField()
    is_correct = models.BooleanField(default=False)


