from wagtail import blocks
from wagtail.images.blocks import ImageChooserBlock
from wagtailmedia.blocks import AudioChooserBlock

class EmbeddedExerciseBlock(blocks.StructBlock):
    exercise = blocks.PageChooserBlock(target_model='exercises.ExerciseBase')

    class Meta:
        icon = 'form'
        label = 'Embedded Exercise'

class HeaderImageBlock(blocks.StructBlock):
    image = ImageChooserBlock(required=True)
    caption = blocks.CharBlock(required=False, max_length=255)
    alignment = blocks.ChoiceBlock(choices=[
        ('left', 'Left'),
        ('center', 'Center'),
        ('right', 'Right'),
    ], default='center')

    class Meta:
        icon = 'image'
        label = 'Header Image'


class TextContentBlock(blocks.StructBlock):
    title = blocks.CharBlock(required=False, max_length=255)
    content = blocks.RichTextBlock()
    text_alignment = blocks.ChoiceBlock(choices=[
        ('left', 'Left'),
        ('center', 'Center'),
        ('right', 'Right'),
    ], default='left')

    class Meta:
        icon = 'doc-full'
        label = 'Text Content'



class AudioContentBlock(blocks.StructBlock):
    audio = AudioChooserBlock(required=True)
    title = blocks.CharBlock(required=False, max_length=255)
    description = blocks.TextBlock(required=False)

    class Meta:
        icon = 'media'
        label = 'Audio Content'



class TwoColumnBlock(blocks.StructBlock):
    left_column = blocks.StreamBlock([
        ('image', HeaderImageBlock()),
        ('text', TextContentBlock()),
        ('audio', AudioContentBlock()),
        ('exercise', EmbeddedExerciseBlock()),
    ])
    right_column = blocks.StreamBlock([
        ('image', HeaderImageBlock()),
        ('text', TextContentBlock()),
        ('audio', AudioContentBlock()),
        ('exercise', EmbeddedExerciseBlock()),
    ])

    class Meta:
        icon = 'table'
        label = 'Two Column Layout'



class SpacerBlock(blocks.StructBlock):
    height = blocks.IntegerBlock(
        default=20,
        help_text="Height in pixels"
    )

    class Meta:
        icon = 'horizontalrule'
        label = 'Spacer'


