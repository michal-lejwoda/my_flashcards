from django.urls import path, re_path

from my_flashcards.exercises.api.views import ExerciseViewSet, PageBySlugViewSet

app_name = "exercises"
exercise_view_set = ExerciseViewSet.as_view({
    'get': 'retrieve',
    'post': 'create',
})
urlpatterns = [
    path('api/exercise/<int:pk>/<slug:slug>/', exercise_view_set, name='exercise-view-set'),
    re_path(
        r'^api/page-by-slug/(?P<path_slug>.+)/$',
        PageBySlugViewSet.as_view({'get': 'retrieve'}),
        name='page-by-slug'
    ),
]
