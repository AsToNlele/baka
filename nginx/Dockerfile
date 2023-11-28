# nginx/Dockerfile

FROM nginx:latest
# Env Var "ENV" with default value prod
ARG ENV=prod
COPY ./nginx-${ENV}.conf /etc/nginx/nginx.conf