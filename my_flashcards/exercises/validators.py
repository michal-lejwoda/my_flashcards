from django.core.exceptions import ValidationError

def validate_mp3(file):
    if not file.name.endswith('.mp3'):
        raise ValidationError("Only mp3 files are allowed")
