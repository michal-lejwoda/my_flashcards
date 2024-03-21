from django.contrib import admin
from .models import *

admin.site.register(Deck)
admin.site.register(Word)
admin.site.register(Tag)
admin.site.register(TempFileWords)
admin.site.register(TempFile)
