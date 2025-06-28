import random

from rest_framework import serializers
from rest_framework.fields import SerializerMethodField
from wagtail.blocks import StreamValue
from wagtail.blocks.list_block import ListValue
from wagtail.images.api.fields import ImageRenditionField
from wagtail.models import Page

from my_flashcards.exercises.models import (LanguageCategoryPage, MainGroup, SubGroup, GroupExercise, \
                                            MainGroupWithSubGroups, SubGroupWithGroupExercises)
from my_flashcards.exercises.exercises_models import (ExerciseBase,
                                            MatchExercise, MatchExerciseTextWithImage,
                                            FillInTextExerciseWithChoices, FillInTextExerciseWithPredefinedBlocks,
                                            ConjugationExercise, ListenExerciseWithOptionsToChoose,
                                            ListenWithManyOptionsToChooseToSingleExercise,
                                            ChooseExerciseDependsOnMultipleTexts, ChooseExerciseDependsOnSingleText,
                                            MultipleExercises
                                                      )

group_urls = {
    "LanguageCategoryPage": "maingroup-with-subgroups",
    "MainGroupWithSubGroups": "maingroup-with-subgroups",
    "SubGroupwithSubGroups": "subgroup-with-subgroups",
    "SubGroupWithGroupExercises": "subgroup-with-groupexercises",
    "MainGroupWithGroupExercises": "maingroup-with-groupexercise"
}






class LanguageCategoryPageListSerializer(serializers.ModelSerializer):
    flag_image = ImageRenditionField('fill-600x400')
    url = SerializerMethodField()

    def get_url(self, obj):
        return "/api/languages/{}".format(obj.id)

    class Meta:
        model = LanguageCategoryPage
        fields = ['id', 'title', 'language', 'flag_image', 'url', 'path_slug']



class LanguageCategoryPageDetailSerializer(serializers.ModelSerializer):
    children = SerializerMethodField()

    def get_children(self, obj):
        children = obj.get_children().live().specific()
        return MainGroupListSerializer(children, many=True).data

    class Meta:
        model = LanguageCategoryPage
        fields = ['id', 'title', 'language', 'children']



class MainGroupListSerializer(serializers.ModelSerializer):
    background_image = ImageRenditionField('fill-600x400')
    background_image_with_text = ImageRenditionField('fill-600x400')
    url = serializers.SerializerMethodField()

    def get_url(self, obj):
        name = group_urls[obj.__class__.__name__]
        return "/api/{}/{}".format(name, obj.id)


    class Meta:
        model = MainGroup
        fields = ['id', 'title','background_image', 'url', 'background_image_with_text', 'path_slug',
                  'main_description']

class MainGroupPageDetailSerializer(serializers.ModelSerializer):
    children = SerializerMethodField()

    def get_children(self, obj):
        children = obj.get_children().live().specific()
        return SubGroupListSerializer(children, many=True).data
    class Meta:
        model = MainGroup
        fields = ['id', 'title', 'children']

class SubGroupListSerializer(serializers.ModelSerializer):
    background_image = ImageRenditionField('fill-600x400')
    background_image_with_text = ImageRenditionField('fill-600x400')
    url = serializers.SerializerMethodField()

    def get_url(self, obj):
        name = group_urls[obj.__class__.__name__]
        return "/api/{}/{}".format(name, obj.id)

    class Meta:
        model = SubGroup
        fields = ['id', 'title', 'background_image', 'background_image_with_text', 'url', 'path_slug']



class SubGroupPageDetailSerializer(serializers.ModelSerializer):
    children = SerializerMethodField()

    def get_children(self, obj):
        children = obj.get_children().live().specific()
        return SubGroupListSerializer(children, many=True).data


class SubGroupWithSubGroupsPageDetailSerializer(serializers.ModelSerializer):
    def get_children(self, obj):
        children = obj.get_children().live()
        return SubGroupListSerializer(children, many=True).data


class GroupExerciseListSerializer(serializers.ModelSerializer):
    children = SerializerMethodField()

    def get_children(self, obj):
        children = obj.get_children().live().specific()
        return ExerciseListSerializer(children, many=True).data

    class Meta:
        model = GroupExercise
        fields = ['introduction', 'title', 'children', 'path_slug']


class MainGroupWithGroupExercisePageDetailSerializer(serializers.ModelSerializer):
    children = SerializerMethodField()

    def get_children(self, obj):
        children = obj.get_children().live().specific()
        return GroupExerciseListSerializer(children, many=True).data


class MainGroupWithSubGroupsListSerializer(serializers.ModelSerializer):
    children = SerializerMethodField()

    def get_children(self, obj):
        children = obj.get_children().live().specific()
        return SubGroupListSerializer(children, many=True).data

    class Meta:
        model = MainGroupWithSubGroups
        fields = ['id', 'title', 'children']


class SubGroupWithGroupExercisesListSerializer(serializers.ModelSerializer):
    children = SerializerMethodField()

    def get_children(self, obj):
        children = obj.get_children().live().specific()
        return GroupExerciseListSerializer(children, many=True).data

    class Meta:
        model = SubGroupWithGroupExercises
        fields = ['id', 'title', 'children']

class ExerciseListSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    title = serializers.CharField()
    url = serializers.SerializerMethodField()

    def get_url(self, obj):
        return "/api/exercises/{}".format(obj.id)

    class Meta:
        model = ExerciseBase
        fields = ['id', 'title', 'url']

class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ['id', 'title', 'slug']

class MatchExerciseSerializer(serializers.ModelSerializer):
    left_items = serializers.SerializerMethodField()
    right_items = serializers.SerializerMethodField()
    before_layout_config = serializers.SerializerMethodField()
    after_layout_config = serializers.SerializerMethodField()

    def get_left_items(self, obj):
        left_items = []
        for block in obj.pairs:
            if block.block_type == 'pair':
                for pair in block.value:
                    left_items.append(pair.get('left_item'))

        random.shuffle(left_items)
        return left_items

    def get_right_items(self, obj):
        right_items = []
        for block in obj.pairs:
            if block.block_type == 'pair':
                for pair in block.value:
                    right_items.append(pair.get('right_item'))
        random.shuffle(right_items)
        return right_items

    def get_before_layout_config(self, obj):
        return obj.before_layout_config.get_prep_value()

    def get_after_layout_config(self, obj):
        return obj.after_layout_config.get_prep_value()


    class Meta:
        model = MatchExercise
        fields = ['id', 'type','description', 'left_items', 'right_items', 'before_layout_config', 'after_layout_config']
        read_only_fields = ['before_layout_config', 'after_layout_config']

class MatchExerciseTextWithImageSerializer(serializers.ModelSerializer):
    left_items = serializers.SerializerMethodField()
    right_items = serializers.SerializerMethodField()
    before_layout_config = serializers.SerializerMethodField()
    after_layout_config = serializers.SerializerMethodField()

    def get_left_items(self, obj):
        left_items = []
        for block in obj.pairs:
            if block.block_type == 'pair':
                for pair in block.value:
                    left_items.append({"id": pair.get('left_item').id, "url": pair.get('left_item').get_rendition('fill-600x400').url})
        random.shuffle(left_items)
        return left_items

    def get_right_items(self, obj):
        right_items = []
        for block in obj.pairs:
            if block.block_type == 'pair':
                for pair in block.value:
                    right_items.append(pair.get('right_item'))
        random.shuffle(right_items)
        return right_items

    def get_before_layout_config(self, obj):
        return obj.before_layout_config.get_prep_value()

    def get_after_layout_config(self, obj):
        return obj.after_layout_config.get_prep_value()

    class Meta:
        model = MatchExerciseTextWithImage
        fields = ['id', 'type','description', 'left_items', 'right_items', 'before_layout_config', 'after_layout_config']
        read_only_fields = ['before_layout_config', 'after_layout_config']

class FillInTextExerciseWithChoicesSerializer(serializers.ModelSerializer):
    blanks = SerializerMethodField()
    before_layout_config = serializers.SerializerMethodField()
    after_layout_config = serializers.SerializerMethodField()

    def get_blanks(self, obj):
        blanks = []
        for block in obj.blanks:
            if block.block_type == 'blank':
                val = block.value
                val_options = val['options']
                if isinstance(val_options, ListValue):
                    options = list(val_options)
                elif isinstance(val_options, list):
                    options = val_options
                else:
                    # TODO fallback
                    options = [val_options]
                blanks.append({
                    "blank_id": val['blank_id'],
                    "options": options,
                    "correct_answer": val['correct_answer']
                })
        return blanks

    def get_before_layout_config(self, obj):
        return obj.before_layout_config.get_prep_value()

    def get_after_layout_config(self, obj):
        return obj.after_layout_config.get_prep_value()

    class Meta:
        model = FillInTextExerciseWithChoices
        fields = ['id', 'type','description', 'text_with_blanks', 'blanks', 'before_layout_config', 'after_layout_config']
        read_only_fields = ['before_layout_config', 'after_layout_config']

class FillInTextExerciseWithPredefinedBlocksSerializer(serializers.ModelSerializer):
    correct_answers = SerializerMethodField()
    blocks = SerializerMethodField()
    before_layout_config = serializers.SerializerMethodField()
    after_layout_config = serializers.SerializerMethodField()

    def get_blocks(self, obj):
        blocks = []
        for option in obj.options:
            values = option.value
            for element in values:
                blocks.append({"blank_id": element['blank_id'], 'answer': element['answer']})
        random.shuffle(blocks)
        return blocks

    def get_correct_answers(self, obj):
        correct_answers = []
        for option in obj.options:
            values = option.value
            for element in values:
                correct_answers.append({"blank_id": element['blank_id'], 'answer': element['answer']})
        return correct_answers

    def get_before_layout_config(self, obj):
        return obj.before_layout_config.get_prep_value()

    def get_after_layout_config(self, obj):
        return obj.after_layout_config.get_prep_value()

    class Meta:
        model = FillInTextExerciseWithPredefinedBlocks
        fields = ['id', 'type','description', 'text_with_blanks', 'correct_answers', 'blocks', 'before_layout_config', 'after_layout_config']
        read_only_fields = ['before_layout_config', 'after_layout_config']

class FillInTextExerciseWithChoicesWithImageDecorationSerializer(FillInTextExerciseWithChoicesSerializer):
    image = serializers.SerializerMethodField(read_only=True)

    def get_image(self, obj):
        return obj.image.file.url if obj.image else None

    class Meta(FillInTextExerciseWithChoicesSerializer.Meta):
        fields = FillInTextExerciseWithChoicesSerializer.Meta.fields + ['image']

class FillInTextExerciseWithPredefinedBlocksWithImageDecorationSerializer(FillInTextExerciseWithPredefinedBlocksSerializer):
    image = serializers.SerializerMethodField(read_only=True)

    def get_image(self, obj):
        return obj.image.file.url if obj.image else None

    class Meta(FillInTextExerciseWithPredefinedBlocksSerializer.Meta):
        fields = FillInTextExerciseWithPredefinedBlocksSerializer.Meta.fields + ['image']

class ConjugationExerciseSerializer(serializers.ModelSerializer):
    conjugation_rows = serializers.SerializerMethodField()
    before_layout_config = serializers.SerializerMethodField()
    after_layout_config = serializers.SerializerMethodField()

    def get_conjugation_rows(self, obj):
        all_rows = []
        for row in obj.conjugation_rows:
            values = row.value
            all_rows.append({"person_label": values['person_label'], "correct_form": values['correct_form'], "is_pre_filled": values['is_pre_filled']})
        return all_rows

    def get_before_layout_config(self, obj):
        return obj.before_layout_config.get_prep_value()

    def get_after_layout_config(self, obj):
        return obj.after_layout_config.get_prep_value()

    class Meta:
        model = ConjugationExercise
        fields = ['id', 'type','instruction', 'description', 'conjugation_rows', 'before_layout_config', 'after_layout_config']
        read_only_fields = ['before_layout_config', 'after_layout_config']

class ListenExerciseWithOptionsToChooseSerializer(serializers.ModelSerializer):
    audio = serializers.FileField(read_only=True)
    exercises = serializers.SerializerMethodField()
    before_layout_config = serializers.SerializerMethodField()
    after_layout_config = serializers.SerializerMethodField()

    def get_exercises(self, obj):
        all_exercises = []
        for exercise in obj.exercises:
            values = exercise.value
            options = []
            for option in values['options']:
                options.append(option)
            result = {'question': values['question'], 'question_id': values['question_id'], 'options': options,  'correct_answer': values['correct_answer']}
            all_exercises.append(result)
        return all_exercises

    def get_before_layout_config(self, obj):
        return obj.before_layout_config.get_prep_value()

    def get_after_layout_config(self, obj):
        return obj.after_layout_config.get_prep_value()

    class Meta:
        model = ListenExerciseWithOptionsToChoose
        fields = ['id', 'type','audio', 'exercises', 'description', 'before_layout_config', 'after_layout_config']
        read_only_fields = ['before_layout_config', 'after_layout_config']

class ListenWithManyOptionsToChooseToSingleExerciseSerializer(serializers.ModelSerializer):
    exercises = serializers.SerializerMethodField()
    before_layout_config = serializers.SerializerMethodField()
    after_layout_config = serializers.SerializerMethodField()

    def get_exercises(self, obj):
        all_exercises = []
        for exercise in obj.exercises:
            values = exercise.value
            options = list(values['options'])
            correct_answers = list(values.get('correct_answers'))
            result = {
                'question': values.get('question'),
                'text': values.get('text'),
                'question_id': values.get('question_id'),
                'options': options,
                'correct_answers': correct_answers,
                'audio': values.get('audio').url,
            }
            all_exercises.append(result)
        return all_exercises

    def get_before_layout_config(self, obj):
        return obj.before_layout_config.get_prep_value()

    def get_after_layout_config(self, obj):
        return obj.after_layout_config.get_prep_value()

    class Meta:
        model = ListenWithManyOptionsToChooseToSingleExercise
        fields = ['id', 'type','title','description','exercises', 'before_layout_config', 'after_layout_config']
        read_only_fields = ['before_layout_config', 'after_layout_config']

class ChooseExerciseDependsOnMultipleTextsSerializer(serializers.ModelSerializer):
    exercises = serializers.SerializerMethodField()
    before_layout_config = serializers.SerializerMethodField()
    after_layout_config = serializers.SerializerMethodField()

    def get_exercises(self, obj):
        all_exercises = []
        for exercise in obj.exercises:

            values = exercise.value
            options = []
            for option in values['options']:
                options.append(option)
            result = {'question': values['question'],'text': values['text'], 'question_id': values['question_id'], 'options': options,
                      'correct_answer': values['correct_answer']}
            all_exercises.append(result)
        return all_exercises

    def get_before_layout_config(self, obj):
        return obj.before_layout_config.get_prep_value()

    def get_after_layout_config(self, obj):
        return obj.after_layout_config.get_prep_value()

    class Meta:
        model = ChooseExerciseDependsOnMultipleTexts
        fields = ['id', 'type','title','description','exercises', 'before_layout_config', 'after_layout_config']
        read_only_fields = ['before_layout_config', 'after_layout_config']

class ChooseExerciseDependsOnSingleTextSerializer(serializers.ModelSerializer):
    exercises = serializers.SerializerMethodField()
    before_layout_config = serializers.SerializerMethodField()
    after_layout_config = serializers.SerializerMethodField()

    def get_exercises(self, obj):
        all_exercises = []
        for exercise in obj.exercises:
            values = exercise.value
            options = []
            for option in values['options']:
                options.append(option)
            result = {'question': values['question'], 'question_id': values['question_id'], 'options': options,
                      'correct_answer': values['correct_answer']}
            all_exercises.append(result)
        return all_exercises

    def get_before_layout_config(self, obj):
        return obj.before_layout_config.get_prep_value()

    def get_after_layout_config(self, obj):
        return obj.after_layout_config.get_prep_value()

    class Meta:
        model = ChooseExerciseDependsOnSingleText
        fields = ['id', 'type','text', 'exercises', 'description', 'before_layout_config', 'after_layout_config']
        read_only_fields = ['before_layout_config', 'after_layout_config']

#TODO WORK WITH IT LATER
class MultipleExercisesSerializer(serializers.ModelSerializer):
    exercises = serializers.SerializerMethodField()

    def get_exercises(self, obj):
        serialized_exercises = []
        for element in obj.exercise_items.all():
            specific_exercise = element.exercise.specific
            class_name = specific_exercise.__class__.__name__

            serializer_class = exercise_serializers.get(class_name)
            if serializer_class:
                serializer = serializer_class(specific_exercise, context=self.context)
                serialized_exercises.append(serializer.data)
            else:
                serialized_exercises.append({
                    "error": f"Lack of serializator for class {class_name}"
                })

        return serialized_exercises

    class Meta:
        model = MultipleExercises
        fields = ['id', 'type','exercises']

exercise_serializers = {
    "MatchExercise": MatchExerciseSerializer,
    "MatchExerciseTextWithImage": MatchExerciseTextWithImageSerializer,
    "FillInTextExerciseWithChoices": FillInTextExerciseWithChoicesSerializer,
    "FillInTextExerciseWithPredefinedBlocks": FillInTextExerciseWithPredefinedBlocksSerializer,
    "FillInTextExerciseWithPredefinedBlocksWithImageDecoration": FillInTextExerciseWithPredefinedBlocksWithImageDecorationSerializer,
    "FillInTextExerciseWithChoicesWithImageDecoration": FillInTextExerciseWithChoicesWithImageDecorationSerializer,
    "ConjugationExercise": ConjugationExerciseSerializer,
    "ListenExerciseWithOptionsToChoose": ListenExerciseWithOptionsToChooseSerializer,
    "ListenWithManyOptionsToChooseToSingleExercise": ListenWithManyOptionsToChooseToSingleExerciseSerializer,
    "ChooseExerciseDependsOnMultipleTexts": ChooseExerciseDependsOnMultipleTextsSerializer,
    "ChooseExerciseDependsOnSingleText": ChooseExerciseDependsOnSingleTextSerializer,
    "MultipleExercises": MultipleExercisesSerializer
}
