# React Native API Challenge - Backend

API para el challenge de restaurantes (React Native). Backend mobile-first con JWT simple, MongoDB y uploads directos a S3 con URL presignada.

## ✨ Features

- Auth con JWT Bearer (sin refresh token ni cookies).
- MongoDB con fallback local si no hay URL remota.
- Uploads directos a S3 con presigned URL.
- Swagger UI y OpenAPI JSON listos para consumo.

## 🚀 Quick Start

```bash
yarn install
cp .env.example .env
yarn dev
```

API disponible en `http://localhost:3001/api`.

## 🧰 Scripts

- `yarn dev`: desarrollo con nodemon.
- `yarn build`: build TypeScript.
- `yarn start`: run en produccion.
- `yarn seed:challenge`: seed base de datos.
- `yarn reset:challenge`: borra y re-seedea.
- `yarn test:coverage`: tests y coverage.

## 🔧 Variables de entorno

| Variable | Descripcion |
| --- | --- |
| `PORT` | Puerto de la API (default 3001). |
| `NODE_ENV` | `development` o `production`. |
| `DATABASE_URL` | URI MongoDB (remoto recomendado). |
| `DATABASE_URL_FALLBACK` | URI local si no hay remoto. |
| `SECRET_KEY` | Clave JWT. |
| `AWS_REGION` | Region AWS (ej. `eu-west-3`). |
| `S3_BUCKET` | Bucket para uploads. |
| `S3_UPLOAD_PREFIX` | Prefijo de objetos (default `uploads`). |
| `S3_PUBLIC_BASE_URL` | Base URL publica (opcional). |
| `S3_URL_EXPIRATION_SECONDS` | Expiracion de URL presignada. |
| `S3_MAX_UPLOAD_BYTES` | Tamano maximo permitido. |
| `CORS_ORIGINS` | Origenes permitidos (comma separated). |

## 🔐 Auth (mobile)

- Header: `Authorization: Bearer <token>`.
- Logout invalida el token en servidor (blacklist).
- `/auth/verify` valida el token actual.

## ☁️ Uploads (S3 presigned)

1. Solicita URL presignada en `POST /api/upload/presign`:
   - `contentType` (`image/jpeg`, `image/png`, `image/webp`)
   - `sizeBytes` (<= `S3_MAX_UPLOAD_BYTES`)
2. Sube el archivo directo a S3 usando `uploadUrl`.
3. Guarda `publicUrl` como `image` al crear/editar restaurante.

Permisos IAM minimos (role de la API):
- `s3:PutObject` en `arn:aws:s3:::<bucket>/<prefix>/*`
- `s3:AbortMultipartUpload` (opcional)

Ejemplo de policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:AbortMultipartUpload"],
      "Resource": "arn:aws:s3:::react-native-api-challenge-uploads-eu-west-3/uploads/*"
    }
  ]
}
```

Si necesitas URLs publicas, agrega policy de lectura al bucket o un CloudFront delante y define `S3_PUBLIC_BASE_URL`.

## 📚 API Docs (Swagger)

- Swagger UI: `GET /api/docs`
- OpenAPI JSON: `GET /api/docs.json`

## 🗺️ Endpoints

Base: `/api`.

### Auth
- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/verify`

### Uploads
- `POST /upload/presign`

### Restaurantes
- `GET /restaurant/list`
- `GET /restaurant/detail/:id`
- `POST /restaurant/create`
- `PUT /restaurant/:id`
- `DELETE /restaurant/:id`

### Comentarios
- `POST /restaurant/:id/comment`
- `PUT /restaurant/:id/comment/:commentId`
- `DELETE /restaurant/:id/comment/:commentId`

### Health
- `GET /health`

## 🐳 Docker

```bash
docker compose up --build
```

Si defines `DATABASE_URL` (por ejemplo Atlas), la API usa remoto; si no, usa `DATABASE_URL_FALLBACK`.

## ☁️ Deploy (Amplify/ECS)

- Usa IAM Role para S3 (sin keys en env). Si despliegas fuera de AWS, define
  `AWS_ACCESS_KEY_ID` y `AWS_SECRET_ACCESS_KEY`.
- En producción son obligatorias: `DATABASE_URL`, `SECRET_KEY`, `CORS_ORIGINS`,
  `AWS_REGION`, `S3_BUCKET` (y opcionalmente `S3_PUBLIC_BASE_URL`).
- Ajusta límites con `S3_URL_EXPIRATION_SECONDS` y `S3_MAX_UPLOAD_BYTES`.
- El Dockerfile solo levanta la API.

## 🌱 Seed

- `yarn seed:challenge` crea usuario admin y 10 restaurantes.
- `yarn reset:challenge` borra todo y re-seedea.

## ✅ Smoke test local

1. Levanta Mongo (docker o local) y define `DATABASE_URL`.
2. Ejecuta `yarn reset:challenge`.
3. Arranca la API con `yarn dev` y valida `GET /api/health`.
