# Generated by Django 4.2.11 on 2024-03-25 09:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('flashcards', '0013_alter_word_next_learn'),
    ]

    operations = [
        migrations.AddField(
            model_name='word',
            name='is_correct',
            field=models.BooleanField(default=False),
        ),
    ]