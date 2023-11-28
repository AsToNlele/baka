# Bakalarka

## How to run

### Prod
1. `docker-compose down -v --rmi all`
2. `docker-compose build --no-cache`
3. `docker-compose -f docker-compose.yml up -d`
4. Check localhost


### Dev
1. `docker-compose -f docker-compose.yml up -d --build`
2. `cd frontend`
3. `pnpm dev`


#### Backend run migrations, superuser etc