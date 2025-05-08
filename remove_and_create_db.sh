#!/bin/bash

docker stop $(docker ps -q -a)
docker-compose -f local.yml up -d postgres
sleep 10
docker exec -i my_flashcards_local_postgres psql -U iDjHVTmPResDcVhnrEuzLQqAkVqayvof -d postgres <<EOF
DROP DATABASE IF EXISTS my_flashcards WITH (FORCE);
CREATE DATABASE my_flashcards;
EOF

docker-compose -f local.yml up -d django
sleep 10
DJANGO_SUPERUSER_USERNAME="admin"
DJANGO_SUPERUSER_EMAIL="admin@example.com"



docker exec -i my_flashcards_local_django python manage.py createsuperuser --noinput \
  --username "$DJANGO_SUPERUSER_USERNAME" \
  --email "$DJANGO_SUPERUSER_EMAIL"

docker exec -i my_flashcards_local_django python manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()
user = User.objects.get(username='admin')
user.set_password('admin123')
user.save()
EOF

docker stop $(docker ps -q -a)
