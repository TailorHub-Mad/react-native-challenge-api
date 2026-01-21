# Technical Review API

API para el challenge de React Native de restaurantes. Provee autenticación, gestión de restaurantes, comentarios y favoritos con MongoDB.

## ✅ Objetivos del repositorio

- API estable y desplegable en AWS (ECS/EC2/Elastic Beanstalk) con MongoDB externo.
- Configuración clara para entorno local y producción.
- Endpoints documentados y consistentes.

## Requisitos

- Node.js 18+
- Yarn
- MongoDB (local, Atlas o DocumentDB)

## Configuración rápida (local)

1. Instala dependencias:

```bash
yarn install
```

2. Crea un archivo `.env` con la configuración necesaria:

```bash
cp .env.example .env
```

3. Arranca el servidor en modo desarrollo:

```bash
yarn dev
```

La API estará disponible en `http://localhost:3001/api`.

## Variables de entorno

| Variable | Descripción |
| --- | --- |
| `PORT` | Puerto de la API (por defecto 3001). |
| `NODE_ENV` | `development` o `production`. |
| `DATABASE_URL` | URI de MongoDB (recomendado). |
| `SECRET_KEY` | Clave para firmar los JWT. |
| `CLOUDINARY_CLOUD_NAME` | Credenciales de Cloudinary (opcional). |
| `CLOUDINARY_API_KEY` | Credenciales de Cloudinary (opcional). |
| `CLOUDINARY_API_SECRET` | Credenciales de Cloudinary (opcional). |
| `UPLOAD_DIR` | Carpeta local para imágenes si no hay Cloudinary. |
| `CORS_ORIGINS` | Lista separada por comas de orígenes permitidos (ej. `http://localhost:3000`). Usa `*` para permitir todos. |

> Si no hay credenciales de Cloudinary, los uploads se guardan en disco dentro de `UPLOAD_DIR`.

## Docker (API + MongoDB)

```bash
docker compose up --build
```

La API quedará en `http://localhost:3001/api` y MongoDB en `mongodb://localhost:27017/technical_review`.

## Build y ejecución en producción

```bash
yarn build
yarn start
```

## Despliegue recomendado en AWS

### Opción 1: ECS Fargate + MongoDB Atlas

1. Crea un cluster en MongoDB Atlas (o AWS DocumentDB) y obtén la URI.
2. Construye y publica la imagen Docker en ECR.
3. Crea un servicio en ECS Fargate usando esa imagen.
4. Configura las variables de entorno en el task definition:
   - `DATABASE_URL`
   - `SECRET_KEY`
   - `CORS_ORIGINS`
   - `CLOUDINARY_*` (si aplica)

### Opción 2: EC2 + Docker

1. Lanza una instancia EC2.
2. Instala Docker y Docker Compose.
3. Copia el repositorio y ejecuta:

```bash
docker compose up -d --build
```

## Endpoints

Todos los endpoints están bajo el prefijo `/api`.

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/refresh-token`
- `GET /api/auth/logout`
- `GET /api/auth/verify`

### Restaurantes
- `GET /api/restaurant/list`
- `GET /api/restaurant/detail/:id`
- `POST /api/restaurant/create` (multipart)
- `PUT /api/restaurant/:id` (multipart)
- `DELETE /api/restaurant/:id`

### Comentarios
- `POST /api/restaurant/:id/comment`
- `PUT /api/restaurant/:id/comment/:commentId`
- `DELETE /api/restaurant/:id/comment/:commentId`

### Health Check
- `GET /api/health`

## CORS

Configura los orígenes permitidos con `CORS_ORIGINS` (separados por comas). Para permitir todos los orígenes, usa `*`.

## Notas para el challenge mobile

- Los tokens JWT se devuelven en el header `Authorization`.
- El refresh token se devuelve en una cookie httpOnly.

---

Si quieres ampliar la API (por ejemplo, favoritos o perfiles más completos), se recomienda añadir pruebas y un esquema de migraciones para MongoDB.
