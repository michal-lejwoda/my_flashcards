from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.translation import gettext_lazy as _
from rest_framework.authtoken.models import Token


@shared_task()
def get_words_from_file(file):
    file_decoded = file.decode('utf-8')
    temp = []
    for index, i in enumerate(file_decoded.split('\n')):
        splitted_data = i.split('-')
        if len(splitted_data) == 2:
            front, back = map(str.strip, splitted_data)
        temp.append({"id": index, "front_side": front, "back_side": back})
    return temp


@shared_task()
def send_reset_password_to_mail(email: str):
    try:
        token = Token.objects.get(user__email=email)
        url = "https://language-flashcards.pl"
        context = {
            "email": email,
            "link": f"{url}/reset_password/{token}"
        }
        message = render_to_string('reset_password.html', context)
        send_mail(
            _("Password Reset on Flashcards website"),
            message,
            'postmaster@mail.language-flashcards.pl',
            # settings.EMAIL_HOST_USER,
            [email],
            html_message=message,
            fail_silently=False,
        )
    except Token.DoesNotExist:
        pass
