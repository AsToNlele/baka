#!/bin/bash

echo "Migrating the database..."
python manage.py migrate

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting the server..."
python manage.py runserver 0.0.0.0:8000
