# Bakalarka

## How to run

### Production

1. Copy .env.example to .env
2. Fill in the .env
- BANK_TOKEN - [Fiobanka token for API](https://www.fio.cz/docs/cz/API_Bankovnictvi.pdf)
- BANK_IBAN - IBAN of the receiving account
- BANK_ACCOUNT - Account number eg. 1234567890/1234
- EMAIL_HOST=smtp.seznam.cz - outgoing mail server
- EMAIL_PORT=465 - port of the outgoing mail server
- EMAIL_HOST_USER
- EMAIL_HOST_PASSWORD
- EMAIL_UNSUBSCRIBE_TOKEN - random string, is used for hashing
- USER_ACTIVATION_TOKEN - random string, is used for hashing
- DEPLOYED_URL=http://baka.docker - URL of the deployed app
3. Make sure port 80 is not used
4. `docker-compose build --no-cache`
5. `docker-compose up -d`
6. Check localhost

#### Create a superuser
1. `docker ps` - find the container hash of the backend
2. `docker exec -it <container_hash> bash`
3. `python manage.py createsuperuser`

#### Bank periodic task
In order to get the bank transactions, we need to set up a celery periodic task.
1. Go to `/admin` and log in as root
2. Go to Periodic tasks
3. Add a new periodic task for `orders.tasks.get_bank_statement` with an interval of 10 seconds
