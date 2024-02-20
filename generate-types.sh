#!/bin/bash

cd backend
python manage.py generateschema --file openapi-schema.yml

cd ../frontend
pnpm exec openapi-typescript ../backend/openapi-schema.yml -o src/types/schema.d.ts
