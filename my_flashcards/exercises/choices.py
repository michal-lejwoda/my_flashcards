from django.utils.translation import gettext as _

LANGUAGE_CHOICES = [
    ('de', _('German')),
    ('en', _('English')),
    ('pl', _('Polish')),
]

CHILDREN_CHOICES = [
    ('MAIN_GROUP', 'Main group'),
    ('SUB_GROUP', 'Sub group'),
    ('GROUP_EXERCISE', 'Group exercise'),
    ('EXERCISE', 'Exercise'),
]
