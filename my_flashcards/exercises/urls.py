from django.urls import path

from my_flashcards.exercises.api.views import ExerciseViewSet

app_name = "exercises"
exercise_view_set = ExerciseViewSet.as_view({
    'get': 'retrieve',
    'post': 'create',
})
urlpatterns = [
    path('api/exercise/<int:pk>/<slug:slug>/', exercise_view_set, name='exercise-view-set'),
]
