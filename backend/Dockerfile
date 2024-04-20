# backend/Dockerfile

# pull official base image
FROM python:3.11.5

# set working directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# add app
COPY . .

RUN chmod +x ./docker-start.sh

# start app
CMD ["sh","/usr/src/app/docker-start.sh"]
# CMD ["bash"]
