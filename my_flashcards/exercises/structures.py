from wagtail import blocks

class BlankOptionBlock(blocks.StructBlock):
    blank_id = blocks.IntegerBlock(help_text="Blank number, ie. 1 for {{1}}")
    options = blocks.ListBlock(
        blocks.CharBlock(), help_text="List of possible options"
    )
    correct_answer = blocks.CharBlock(help_text="True Answer")

    def clean(self, value):
        errors = {}
        if value['correct_answer'] not in value['options']:
            errors['correct_answer'] = "True answer must be one of the option."
        if errors:
            raise blocks.StreamBlockValidationError(errors)
        return super().clean(value)

    class Meta:
        icon = "list-ul"
        label = "Answers for blank"


class MultipleOptionToChoose(blocks.StructBlock):
    question_id = blocks.CharBlock(
        required=False,
        help_text="Hided ID"
    )
    question = blocks.TextBlock(required=False, help_text="Optional question")
    options = blocks.ListBlock(
        blocks.CharBlock(), help_text="List of possible options"
    )
    correct_answers = blocks.ListBlock(
        blocks.CharBlock(), help_text="List of correct answers"
    )
    #TODO FIX It
    def clean(self, value):
        errors = {}
        invalid_answers = [ans for ans in value['correct_answers'] if ans not in value['options']]
        if invalid_answers:
            errors['correct_answers'] = (
                f"This answers are not available: {', '.join(invalid_answers)}"
            )
        if errors:
            raise blocks.StreamBlockValidationError(errors)
        return super().clean(value)

class ListenOptionToChoose(blocks.StructBlock):
    #Hidden using css
    question_id = blocks.CharBlock(
        required=False,
        help_text="Hided Id"
    )
    question = blocks.TextBlock(required=False, help_text="Optional question")
    options = blocks.ListBlock(
        blocks.CharBlock(), help_text="List of possible options"
    )
    correct_answer = blocks.CharBlock(help_text="True Answer")

    def clean(self, value):
        errors = {}
        if value['correct_answer'] not in value['options']:
            errors['correct_answer'] = "True answer must be one of the option."
        if errors:
            raise blocks.StreamBlockValidationError(errors)
        return super().clean(value)
