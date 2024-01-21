## Generating Types from Backend

1. Generate OpenAPI Schema on Backend
```sh
 python manage.py generateschema --file openapi-schema.yml
```

2. Convert OpenAPI Schema to Typescript declarations
```sh
pnpx openapi-typescript ../backend/openapi-schema.yml -o src/types/schema.d.ts
```
