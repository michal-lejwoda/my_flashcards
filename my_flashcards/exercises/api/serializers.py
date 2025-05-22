import random

from rest_framework.fields import SerializerMethodField
from wagtail.images.api.fields import ImageRenditionField
from wagtail.models import Page

from my_flashcards.exercises.models import LanguageCategoryPage, MainGroup, SubGroup, GroupExercise, \
    MainGroupWithSubGroups, SubGroupWithGroupExercises, ExerciseBase, MatchExercise, MatchExerciseTextWithImage,FillInTextExercise
from rest_framework import serializers



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

class FillInTextExerciseSerializer(serializers.ModelSerializer):
    blanks = SerializerMethodField()

    def get_blanks(self, obj):
        blanks = []
        for block in obj.blanks:
            print("bloc12k", block.block_type)
            if block.block_type == 'blank':
                for blank in block.value:
                    print("blaczek", blank)
                    print("czx",blank.correct_answer)
                    # blanks.append(blank.get('options'))
                    #TODO BACK HERE
        print("xzc",blanks)

    class Meta:
        model = FillInTextExercise
        fields = ['description', 'text_with_blanks', 'blanks']
