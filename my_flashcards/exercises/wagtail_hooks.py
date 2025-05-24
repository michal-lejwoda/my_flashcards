from wagtail import hooks
from django.templatetags.static import static
from django.utils.html import format_html

@hooks.register('insert_editor_js')
def editor_js():
    return format_html(
        '<script src="{}"></script>',
        static('exercises/js/auto_fill_conjugation.js')
    )

@hooks.register("insert_global_admin_css")
def global_admin_css():
    return format_html('<link rel="stylesheet" href="{}">', static("exercises/css/admin.css"))
