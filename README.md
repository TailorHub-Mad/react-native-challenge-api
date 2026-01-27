# React Native Challenge API

Backend service in Node.js/TypeScript oriented to a mobile app. It exposes a REST API for authentication, entity management, and file uploads, with Swagger documentation and a configuration intended to run locally, in CI, or in production. It uses MongoDB as the primary database, JWT for sessions, and optional S3 uploads via presigned URLs.

## 🚀 Quick Start

```bash
npm install
cp .env.template .env
npm run dev
```

## 🧰 Scripts

- `npm run dev`: starts the server in development with `nodemon` (`NODE_ENV=development`) and reloads on changes.
- `npm run dev:prod`: starts the server with `nodemon` but uses `NODE_ENV=production`.
- `npm run build`: cleans `dist/` and compiles TypeScript using `tsconfig.prod.json`.
- `npm run start`: runs the built output in production mode (`NODE_ENV=production`) using `dist/server.js`.
- `npm run serve`: runs the build and then starts the server in production.
- `npm run seed:challenge`: inserts test data (admin + restaurants) into the database defined by the environment.
- `npm run reset:challenge`: deletes data and runs the seed again.
- `npm run test:coverage`: runs Jest tests and generates a coverage report.
- `npm run lint`: runs ESLint across the project (`.ts`).
- `npm run prettier`: formats `.ts` files in `src/` with Prettier.
- `postinstall`: installs Husky Git hooks.
- `postpublish`: re-enables `pinst` after publishing.

## 🔧 Environment variables

| Variable | Description |
| --- | --- |
| `PORT` | API port (default 3001). |
| `NODE_ENV` | `development` o `production`. |
| `DATABASE_URL` | MongoDB URI (remote recommended). |
| `DATABASE_NAME` | Database name to append if the URI has no db path (default `react-native-challenge-api`). |
| `DATABASE_URL_FALLBACK` | Local URI if remote is not available. |
| `SECRET_KEY` | JWT secret. |
| `AWS_REGION` | AWS region (e.g. `eu-west-3`). |
| `S3_BUCKET` | Bucket for uploads. |
| `S3_UPLOAD_PREFIX` | Object prefix (default `uploads`). |
| `S3_PUBLIC_BASE_URL` | Public base URL (optional). |
| `S3_URL_EXPIRATION_SECONDS` | Presigned URL expiration. |
| `S3_MAX_UPLOAD_BYTES` | Max allowed size. |
| `CORS_ORIGINS` | Allowed origins (comma separated). |

## ☁️ Uploads (S3 presigned)

Uploads are performed with S3 presigned URLs so the API never receives the file body. The client asks the API for a short-lived URL, uploads directly to S3, and then stores the resulting `publicUrl` in the restaurant record.

Flow:
1. **Request a presigned URL** with `POST /api/upload/presign` (requires `Authorization: Bearer <token>`).
   - Body fields:
     - `contentType`: allowed values are `image/jpeg`, `image/png`, `image/webp`.
     - `sizeBytes`: must be <= `S3_MAX_UPLOAD_BYTES`.
   - The API validates type and size, builds a key under `S3_UPLOAD_PREFIX/YYYY/MM/DD/<uuid>.<ext>`, and returns:
     - `uploadUrl`: time-limited URL for `PUT` to S3.
     - `publicUrl`: the URL you should persist in your data (uses `S3_PUBLIC_BASE_URL` if set, otherwise the S3 regional URL).
     - `objectKey`, `expiresIn`, `maxSizeBytes` for reference.
2. **Upload directly to S3** with a `PUT` request to `uploadUrl` and the same `Content-Type`.
3. **Save `publicUrl`** in your restaurant create/update payload so the mobile app can render the image.

If you need public access, add a read policy to the bucket or place CloudFront in front and set `S3_PUBLIC_BASE_URL`.

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

## 🌱 Seed
- `npm run seed:challenge` creates an admin user and 10 restaurants.
- `npm run reset:challenge` deletes everything and re-seeds.

## 🧪 Testing
1. Install dependencies and ensure `.env` is present if you want custom values.
2. Run tests with:

```bash
npm run test:coverage
```

By default, tests use an in-memory MongoDB instance (`DATABASE_URL=inmemory` via Jest setup). If you prefer a real database, set `DATABASE_URL` (and optionally `DATABASE_URL_FALLBACK`) before running the tests.
