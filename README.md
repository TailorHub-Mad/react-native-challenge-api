# API Documentation

This API provides endpoints for managing restaurants and user authentication. All API routes are prefixed with `/api`.

The base url is:
https://technical-review-api-tailor.netlify.app/

## Authentication Routes

Base path: `/api/auth`

### 1. Sign Up
- **Endpoint**: `POST /auth/signup`
- **Description**: Register a new user
- **Body**:
  ```typescript
  {
    email: string,
    password: string,
    name: string
  }
  ```
- **Response**: Status 201 if successful

### 2. Login
- **Endpoint**: `POST /auth/login`
- **Description**: Authenticate user and get tokens
- **Body**:
  ```typescript
  {
    email: string,
    password: string
  }
  ```
- **Response**: 
  - Headers: `Authorization` token
  - Cookies: `refreshToken` (httpOnly)
  - Body: User information

### 3. Refresh Token
- **Endpoint**: `GET /auth/refresh-token`
- **Description**: Get new access token using refresh token
- **Cookies Required**: `refreshToken`
- **Response**: 
  - Status: 202
  - Headers: New `Authorization` token
  - Cookies: New `refreshToken`

### 4. Logout
- **Endpoint**: `GET /auth/logout`
- **Description**: Invalidate current tokens
- **Authentication**: Required
- **Response**: Status 202

### 5. Verify Token
- **Endpoint**: `GET /auth/verify`
- **Description**: Verify current authentication token
- **Authentication**: Required
- **Response**: User information

## Restaurant Routes

Base path: `/api/restaurant`

### 1. List Restaurants
- **Endpoint**: `GET /restaurant/list`
- **Description**: Get paginated list of restaurants
- **Query Parameters**:
  ```typescript
  {
    limit: number,
    page: number
  }
  ```
- **Response**: 
  ```typescript
  {
    restaurantList: Restaurant[],
    total: number
  }
  ```

### 2. Get Restaurant Details
- **Endpoint**: `GET /restaurant/detail/:id`
- **Description**: Get detailed information about a specific restaurant
- **Parameters**: 
  - `id`: Restaurant ID
- **Response**: Restaurant details with average rating

### 3. Create Restaurant
- **Endpoint**: `POST /restaurant/create`
- **Description**: Create a new restaurant
- **Authentication**: Required
- **Body**: Multipart form data
  - `image`: Restaurant image file
  - Other restaurant details
- **Response**: Status 201 if successful

### 4. Update Restaurant
- **Endpoint**: `PUT /restaurant/:id`
- **Description**: Update restaurant information
- **Authentication**: Required (must be owner)
- **Parameters**: 
  - `id`: Restaurant ID
- **Body**: Multipart form data (similar to create)
- **Response**: Status 202 if successful

### 5. Delete Restaurant
- **Endpoint**: `DELETE /restaurant/:id`
- **Description**: Delete a restaurant
- **Authentication**: Required (must be owner)
- **Parameters**: 
  - `id`: Restaurant ID
- **Response**: Status 202 if successful

### Comment Routes

### 1. Create Comment
- **Endpoint**: `POST /restaurant/:id/comment`
- **Description**: Add a comment to a restaurant
- **Authentication**: Required
- **Parameters**: 
  - `id`: Restaurant ID
- **Response**: Status 201 if successful

### 2. Update Comment
- **Endpoint**: `PUT /restaurant/:id/comment/:commentId`
- **Description**: Update an existing comment
- **Authentication**: Required (must be comment owner)
- **Parameters**: 
  - `id`: Restaurant ID
  - `commentId`: Comment ID
- **Response**: Status 202 if successful

### 3. Delete Comment
- **Endpoint**: `DELETE /restaurant/:id/comment/:commentId`
- **Description**: Delete a comment
- **Authentication**: Required (must be comment owner)
- **Parameters**: 
  - `id`: Restaurant ID
  - `commentId`: Comment ID
- **Response**: Status 202 if successful

## Health Check

Base path: `/api/health`

### 1. Health Status
- **Endpoint**: `GET /health`
- **Description**: Check API health status
- **Response**: 
  ```typescript
  {
    name: string,
    version: string,
    mongodb: {
      status: string
    }
  }
  ```

## Authentication

Protected routes require a valid JWT token in the `Authorization` header. The token can be obtained through the login endpoint or refreshed using the refresh token endpoint.

## Error Handling

All endpoints follow a consistent error response format:
```typescript
{
  message: string,
  statusCode: number
}
```

## CORS

The API supports CORS for the following origins:
- `http://localhost:3000`
- `https://3ba4cd18-d338-43bf-a9ca-51615da16334-00-1q63gwf79pesk.kirk.replit.dev` 