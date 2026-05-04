# Dishly API

REST API for the Dishly recipe-sharing platform. Built with Node.js, Express, and MongoDB.

## Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB + Mongoose
- **Auth**: JWT (access token 15min + refresh token 7 days)
- **Validation**: Joi
- **Upload**: Multer (images up to 5MB)
- **Security**: Helmet, CORS, Rate limiting (100 req/15min)

## Getting Started

```bash
cd backend
npm install
cp .env.example .env   # fill in your values
npm run dev
```

**Health check**: `GET http://localhost:5000/api/health`

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/dishly` |
| `JWT_SECRET` | Access token secret | `your_secret` |
| `JWT_EXPIRES_IN` | Access token TTL | `15m` |
| `JWT_REFRESH_SECRET` | Refresh token secret | `your_refresh_secret` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token TTL | `7d` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |

---

## Data Models

### User
| Field | Type | Notes |
|---|---|---|
| `username` | String | required, unique, 3–30 chars |
| `email` | String | required, unique, valid email |
| `password` | String | required, min 6 chars, hashed (bcrypt) |
| `avatar` | String | URL, nullable |
| `bio` | String | max 250 chars |
| `favorites` | ObjectId[] | ref: Recipe |
| `role` | String | `user` \| `admin` |

### Recipe
| Field | Type | Notes |
|---|---|---|
| `title` | String | required, 3–100 chars |
| `description` | String | required, 10–1000 chars |
| `ingredients` | Array | `{ name, quantity, unit }` — min 1 |
| `steps` | String[] | min 1 |
| `prepTime` | Number | minutes, min 1 |
| `cookTime` | Number | minutes, min 0 |
| `servings` | Number | min 1 |
| `difficulty` | String | `easy` \| `medium` \| `hard` |
| `image` | String | URL, nullable |
| `category` | ObjectId | ref: Category, required |
| `author` | ObjectId | ref: User, required |
| `tags` | String[] | optional |
| `isPublic` | Boolean | default `true` |

### Category
| Field | Type | Notes |
|---|---|---|
| `name` | String | required, unique, 2–50 chars |
| `description` | String | max 200 chars |
| `image` | String | URL, nullable |
| `slug` | String | auto-generated from name |
| `createdBy` | ObjectId | ref: User |

---

## API Reference

Base URL: `http://localhost:5000/api`

> **Auth header**: `Authorization: Bearer <accessToken>`

---

### Authentication

#### `POST /auth/register`
Create a new account.

**Body**
```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response `201`**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": { "_id": "...", "username": "john", "email": "john@example.com" },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

---

#### `POST /auth/login`
Authenticate and receive tokens.

**Body**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response `200`**
```json
{
  "success": true,
  "data": { "user": {...}, "accessToken": "eyJ...", "refreshToken": "eyJ..." }
}
```

---

#### `POST /auth/refresh`
Exchange a refresh token for a new token pair.

**Body**
```json
{ "refreshToken": "eyJ..." }
```

**Response `200`**
```json
{
  "success": true,
  "data": { "accessToken": "eyJ...", "refreshToken": "eyJ..." }
}
```

---

#### `POST /auth/logout` 🔒
Invalidate the current refresh token.

**Response `200`**
```json
{ "success": true, "message": "Logged out successfully" }
```

---

#### `GET /auth/me` 🔒
Get the authenticated user's profile.

**Response `200`**
```json
{ "success": true, "data": { "user": {...} } }
```

---

### Recipes

#### `GET /recipes`
List all public recipes with pagination and filters.

**Query Parameters**
| Param | Type | Description |
|---|---|---|
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 10, max: 50) |
| `search` | string | Full-text search (title, description, tags) |
| `category` | ObjectId | Filter by category ID |
| `difficulty` | string | `easy` \| `medium` \| `hard` |
| `minPrepTime` | number | Min prep time in minutes |
| `maxPrepTime` | number | Max prep time in minutes |
| `tags` | string | Comma-separated tags |
| `author` | ObjectId | Filter by author ID |
| `sort` | string | Sort field (default: `-createdAt`) |

**Response `200`**
```json
{
  "success": true,
  "data": {
    "recipes": [...],
    "pagination": {
      "total": 42,
      "page": 1,
      "limit": 10,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

#### `GET /recipes/mine` 🔒
Get all recipes belonging to the authenticated user (includes private).

**Query Parameters**: `page`, `limit`

---

#### `GET /recipes/:id`
Get a single recipe by ID. Includes populated `category` and `author`.

**Response `200`**
```json
{
  "success": true,
  "data": {
    "recipe": {
      "_id": "...",
      "title": "Carbonara",
      "category": { "_id": "...", "name": "Italian", "slug": "italian" },
      "author": { "_id": "...", "username": "john", "avatar": null }
    }
  }
}
```

---

#### `POST /recipes` 🔒
Create a new recipe.

**Body**
```json
{
  "title": "Spaghetti Carbonara",
  "description": "A classic Italian pasta dish...",
  "ingredients": [
    { "name": "Spaghetti", "quantity": "400", "unit": "g" },
    { "name": "Eggs", "quantity": "4", "unit": "" }
  ],
  "steps": ["Boil pasta", "Fry pancetta", "Mix and serve"],
  "prepTime": 10,
  "cookTime": 20,
  "servings": 4,
  "difficulty": "medium",
  "category": "664a0f...",
  "tags": ["italian", "pasta"],
  "isPublic": true
}
```

**Response `201`**
```json
{ "success": true, "message": "Recipe created", "data": { "recipe": {...} } }
```

---

#### `PUT /recipes/:id` 🔒
Update a recipe. Owner only. All fields optional.

**Body**: any subset of create fields.

**Response `200`**
```json
{ "success": true, "message": "Recipe updated", "data": { "recipe": {...} } }
```

---

#### `DELETE /recipes/:id` 🔒
Delete a recipe. Owner only. Also deletes associated image file.

**Response `200`**
```json
{ "success": true, "message": "Recipe deleted" }
```

---

#### `POST /recipes/:id/image` 🔒
Upload a recipe image. Owner only.

**Body**: `multipart/form-data` with field `image` (JPEG/PNG/WebP, max 5MB).

**Response `200`**
```json
{ "success": true, "data": { "imageUrl": "http://localhost:5000/uploads/abc123.jpg" } }
```

---

### Categories

#### `GET /categories`
List all categories, sorted by name.

**Response `200`**
```json
{ "success": true, "data": { "categories": [...] } }
```

---

#### `GET /categories/:id`
Get a category with its public recipe count.

**Response `200`**
```json
{
  "success": true,
  "data": {
    "category": { "_id": "...", "name": "Italian", "slug": "italian" },
    "recipeCount": 12
  }
}
```

---

#### `POST /categories` 🔒
Create a category.

**Body**
```json
{
  "name": "Italian",
  "description": "Traditional Italian cuisine"
}
```

**Response `201`**
```json
{ "success": true, "message": "Category created", "data": { "category": {...} } }
```

---

#### `PUT /categories/:id` 🔒
Update a category.

**Body**: `name` and/or `description` (both optional).

---

#### `DELETE /categories/:id` 🔒
Delete a category. Fails if recipes are linked to it.

**Response `400`** (if recipes exist)
```json
{ "success": false, "message": "Cannot delete category with 5 associated recipe(s)" }
```

---

#### `POST /categories/:id/image` 🔒
Upload a category image.

**Body**: `multipart/form-data` with field `image`.

---

### Users

#### `GET /users/me` 🔒
Get authenticated user's full profile.

---

#### `PUT /users/me` 🔒
Update profile.

**Body**
```json
{
  "username": "newname",
  "bio": "I love cooking!"
}
```

---

#### `POST /users/me/avatar` 🔒
Upload profile avatar.

**Body**: `multipart/form-data` with field `avatar`.

---

#### `GET /users/me/favorites` 🔒
Get paginated list of favorited recipes.

**Query Parameters**: `page`, `limit`

---

#### `POST /users/me/favorites/:recipeId` 🔒
Add a recipe to favorites.

**Response `409`** if already in favorites.

---

#### `DELETE /users/me/favorites/:recipeId` 🔒
Remove a recipe from favorites.

---

#### `GET /users/:id`
Get a user's public profile with their public recipe count.

**Response `200`**
```json
{
  "success": true,
  "data": {
    "user": { "username": "john", "avatar": null, "bio": "..." },
    "recipeCount": 8
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Human-readable error message"
}
```

Validation errors include an `errors` array:
```json
{
  "success": false,
  "message": "Validation error",
  "errors": ["Title must be at least 3 characters", "Category is required"]
}
```

| Status | Meaning |
|---|---|
| `400` | Bad request / Validation error |
| `401` | Unauthenticated (missing or expired token) |
| `403` | Forbidden (not the owner) |
| `404` | Resource not found |
| `409` | Conflict (duplicate unique field) |
| `429` | Too many requests |
| `500` | Internal server error |

---

## Bruno Collection

Import the `bruno/` folder into [Bruno](https://www.usebruno.com/) to get all routes pre-configured.

1. Open Bruno → **Open Collection** → select `backend/bruno/`
2. Select the **Local** environment
3. Run **Login** first — the token is saved automatically to the environment
4. All subsequent authenticated requests will use it
