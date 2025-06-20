from django.contrib import admin

from .exercises_models import *

admin.site.register(MatchExercise)
admin.site.register(FillInTextExerciseWithChoices)
admin.site.register(UserAnswer)
admin.site.register(ExerciseAttempt)
