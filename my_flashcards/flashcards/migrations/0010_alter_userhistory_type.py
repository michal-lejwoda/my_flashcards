# Generated by Django 4.2.11 on 2024-03-24 21:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('flashcards', '0009_userhistory_word_level_alter_deck_is_public_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userhistory',
            name='type',
            field=models.CharField(choices=[('LEARN', 'LEARN'), ('BROWSE', 'BROWSE'), ('BROWSE_AND_LEARN', 'BROWSE_AND_LEARN')], default='LEARN', max_length=20),
        ),
    ]
