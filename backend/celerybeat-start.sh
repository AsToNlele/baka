#!/bin/bash

sleep 10
celery -A myproject beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
