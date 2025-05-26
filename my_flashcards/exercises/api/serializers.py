import random

from rest_framework import serializers
from rest_framework.fields import SerializerMethodField
from wagtail.blocks.list_block import ListValue
from wagtail.images.api.fields import ImageRenditionField
from wagtail.models import Page

from my_flashcards.exercises.models import (LanguageCategoryPage, MainGroup, SubGroup, GroupExercise, \
                                            MainGroupWithSubGroups, SubGroupWithGroupExercises, ExerciseBase,
                                            MatchExercise, MatchExerciseTextWithImage,
                                            FillInTextExerciseWithChoices, FillInTextExerciseWithPredefinedBlocks,
                                            ConjugationExercise, ListenExerciseWithOptionsToChoose,
                                            ListenWithManyOptionsToChooseToSingleExercise,
                                            ChooseExerciseDependsOnMultipleTexts, ChooseExerciseDependsOnSingleText,
                                            MultipleExercises)

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
        fields = ['id', 'title', 'language', 'flag_image', 'url']



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
        fields = ['id', 'title','background_image', 'url', 'background_image_with_text']

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
        fields = ['id', 'title', 'background_image', 'background_image_with_text', 'url']



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
        fields = ['introduction', 'title', 'children']


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

    class Meta:
        model = MatchExercise
        fields = ['description', 'left_items', 'right_items']


class MatchExerciseTextWithImageSerializer(serializers.ModelSerializer):
    left_items = serializers.SerializerMethodField()
    right_items = serializers.SerializerMethodField()

    def get_left_items(self, obj):
        left_items = []
        for block in obj.pairs:
            if block.block_type == 'pair':
                for pair in block.value:
                    left_items.append({"id": pair.get('left_item').id, "url": pair.get('left_item').get_rendition('fill-600x400').url})
        print("left_przed", left_items)
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

    class Meta:
        model = MatchExerciseTextWithImage
        fields = ['description', 'left_items', 'right_items']

class FillInTextExerciseWithChoicesSerializer(serializers.ModelSerializer):
    blanks = SerializerMethodField()

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


    class Meta:
        model = FillInTextExerciseWithChoices
        fields = ['description', 'text_with_blanks', 'blanks']


class FillInTextExerciseWithPredefinedBlocksSerializer(serializers.ModelSerializer):
    correct_answers = SerializerMethodField()
    blocks = SerializerMethodField()

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
    class Meta:
        model = FillInTextExerciseWithPredefinedBlocks
        fields = ['description', 'text_with_blanks', 'correct_answers', 'blocks']

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

    def get_conjugation_rows(self, obj):
        all_rows = []
        for row in obj.conjugation_rows:
            values = row.value
            all_rows.append({"person_label": values['person_label'], "correct_form": values['correct_form'], "is_pre_filled": values['is_pre_filled']})
        return all_rows
    class Meta:
        model = ConjugationExercise
        fields = ['instruction', 'description', 'conjugation_rows']

class ListenExerciseWithOptionsToChooseSerializer(serializers.ModelSerializer):
    audio = serializers.FileField(read_only=True)
    exercises = serializers.SerializerMethodField()

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

    class Meta:
        model = ListenExerciseWithOptionsToChoose
        fields = ['audio', 'exercises', 'description']

class ListenWithManyOptionsToChooseToSingleExerciseSerializer(serializers.ModelSerializer):
    exercises = serializers.SerializerMethodField()

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
    class Meta:
        model = ListenWithManyOptionsToChooseToSingleExercise
        fields = ['title','description','exercises']

class ChooseExerciseDependsOnMultipleTextsSerializer(serializers.ModelSerializer):
    exercises = serializers.SerializerMethodField()

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

    class Meta:
        model = ChooseExerciseDependsOnMultipleTexts
        fields = ['title','description','exercises']

class ChooseExerciseDependsOnSingleTextSerializer(serializers.ModelSerializer):
    exercises = serializers.SerializerMethodField()

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
    class Meta:
        model = ChooseExerciseDependsOnSingleText
        fields = ['text', 'exercises', 'description']

class MultipleExercisesSerializer(serializers.ModelSerializer):
    class Meta:
        model = MultipleExercises
        fields = []
