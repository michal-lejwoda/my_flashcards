# Generated by Django 4.2.11 on 2024-03-25 08:29

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('flashcards', '0011_alter_userhistory_correct_flashcards'),
    ]

    operations = [
        migrations.AlterField(
            model_name='word',
            name='next_learn',
            field=models.DateTimeField(blank=True, default=django.utils.timezone.now, null=True),
        ),
    ]
