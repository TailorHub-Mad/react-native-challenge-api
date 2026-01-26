# React Native Challenge API

Backend service in Node.js/TypeScript oriented to a mobile app. It exposes a REST API for authentication, entity management, and file uploads, with Swagger documentation and a configuration intended to run locally, in CI, or in production. It uses MongoDB as the primary database, JWT for sessions, and optional S3 uploads via presigned URLs.

## 🚀 Quick Start

```bash
yarn install
cp .env.template .env
yarn dev
```

API available at `http://localhost:3001/api`.

## 🧰 Scripts (detail)

- `yarn dev`: starts the server in development with `nodemon` and reloads on changes.
- `yarn dev:prod`: starts the server with `nodemon` but uses `NODE_ENV=production` (useful to test prod behavior with autoreload).
- `yarn build`: cleans `dist/` and compiles TypeScript using `tsconfig.prod.json`.
- `yarn start`: runs the built output in production mode (`NODE_ENV=production`) using `dist/server.js`.
- `yarn serve`: runs `yarn build` and then starts the server in production.
- `yarn seed:challenge`: inserts test data (admin + restaurants) into the database defined by the environment.
- `yarn reset:challenge`: deletes data and runs the seed again.
- `yarn test:coverage`: runs Jest tests and generates a coverage report using `.env.test`.
- `yarn lint`: runs ESLint across the project (`.ts`).
- `yarn prettier`: formats `.ts` files in `src/` with Prettier.

## 🔧 Environment variables

| Variable | Description |
| --- | --- |
| `PORT` | API port (default 3001). |
| `NODE_ENV` | `development` o `production`. |
| `DATABASE_URL` | MongoDB URI (remote recommended). |
| `DATABASE_URL_FALLBACK` | Local URI if remote is not available. |
| `SECRET_KEY` | JWT secret. |
| `AWS_REGION` | AWS region (e.g. `eu-west-3`). |
| `S3_BUCKET` | Bucket for uploads. |
| `S3_UPLOAD_PREFIX` | Object prefix (default `uploads`). |
| `S3_PUBLIC_BASE_URL` | Public base URL (optional). |
| `S3_URL_EXPIRATION_SECONDS` | Presigned URL expiration. |
| `S3_MAX_UPLOAD_BYTES` | Max allowed size. |
| `CORS_ORIGINS` | Allowed origins (comma separated). |

## 🔐 Auth

- Header: `Authorization: Bearer <token>`.
- Logout invalidates the token on the server (blacklist).
- `/auth/verify` validates the current token.

## ☁️ Uploads (S3 presigned)

1. Request a presigned URL at `POST /api/upload/presign`:
   - `contentType` (`image/jpeg`, `image/png`, `image/webp`)
   - `sizeBytes` (<= `S3_MAX_UPLOAD_BYTES`)
2. Upload the file directly to S3 using `uploadUrl`.
3. Save `publicUrl` as `image` when creating/updating a restaurant.

Minimum IAM permissions (API role):
- `s3:PutObject` en `arn:aws:s3:::<bucket>/<prefix>/*`
- `s3:AbortMultipartUpload` (opcional)

Example policy:

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

If you need public URLs, add a read policy to the bucket or put CloudFront in front and set `S3_PUBLIC_BASE_URL`.

## 📚 API Docs

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

### Restaurants
- `GET /restaurant/list`
- `GET /restaurant/detail/:id`
- `POST /restaurant/create`
- `PUT /restaurant/:id`
- `DELETE /restaurant/:id`

### Comments
- `POST /restaurant/:id/comment`
- `PUT /restaurant/:id/comment/:commentId`
- `DELETE /restaurant/:id/comment/:commentId`

### Health
- `GET /health`

## 🐳 Docker

```bash
docker compose up --build
```

If you set `DATABASE_URL` (for example Atlas), the API uses remote; otherwise it uses `DATABASE_URL_FALLBACK`.

## 🚀 Deploy AWS

- Use an IAM Role for S3 (no keys in env). If you deploy outside AWS, set
  `AWS_ACCESS_KEY_ID` y `AWS_SECRET_ACCESS_KEY`.
- In production these are required: `DATABASE_URL`, `SECRET_KEY`, `CORS_ORIGINS`,
  `AWS_REGION`, `S3_BUCKET` (and optionally `S3_PUBLIC_BASE_URL`).
- Adjust limits with `S3_URL_EXPIRATION_SECONDS` and `S3_MAX_UPLOAD_BYTES`.
- The Dockerfile only starts the API.

## 🌱 Seed

- `yarn seed:challenge` creates an admin user and 10 restaurants.
- `yarn reset:challenge` deletes everything and re-seeds.

## 🧪 Testing
1. Start Mongo (docker or local) and set `DATABASE_URL`.
2. Run `yarn reset:challenge`.
3. Start the API with `yarn dev` and validate `GET /api/health`.
