# Bakalarka

## How to run

### Prod
1. `docker-compose down -v --rmi all`
2. `docker-compose build --no-cache`
3. `docker-compose -f docker-compose.yml up -d`
4. Check localhost


### Dev

#### Docker
1. `docker-compose -f docker-compose.yml up -d --build`

#### Backend
1. `cd ../backend`
2. Verify .env
3. `pip install -r requirements.txt`
4. `python manage.py runserver`

#### Celery for scheduled tasks
1. Start celery worker
`celery -A myproject worker --loglevel=INFO`

2. Start celery beat scheduler
`celery -A myproject beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler\n`

#### Frontend
1. `cd frontend`
2. `pnpm dev --host`


#### Backend run migrations, superuser etc
