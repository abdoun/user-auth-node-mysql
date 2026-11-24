# user-auth-node-mysql
An API backend example by Node and Mysql of Users table including register, login, CRUD with JWT

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+ recommended)
- npm (comes with Node.js)

### Installation
 Install dependencies:
   ```bash
   npm install
   ```

### Running the Project
- **Development mode** (with auto-reload):
  ```bash
  npm run dev
  ```
- **Production mode**:
  ```bash
  node src/server.js
  ```

### Building the Project
- For frontend projects (React/Vue):
  ```bash
  npm run build
  ```
  This generates optimized files in the `dist/` or `build/` folder.

### Environment Setup
Create a `.env` file:
```env
PORT=3000
DB_URI=your_database_uri
```

## 📊 Database Schema

### `users` Table Structure
```sql
-- testdb.users definition
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

## Alternative Formats

### Option 1: With Table Details
```markdown
## Database Tables

### Users Table (`users`)
| Column    | Type         | Nullable | Default | Description          |
|-----------|--------------|----------|---------|----------------------|
| id        | int          | NO       | -       | Primary key, auto-increment |
| name      | varchar(100) | YES      | NULL    | User's full name     |
| email     | varchar(100) | YES      | NULL    | Unique email address |
| password  | varchar(255) | YES      | NULL    | Hashed password      |

**Indexes:**
- PRIMARY KEY (`id`)
- UNIQUE KEY (`email`)

**Engine:** InnoDB  
**Charset:** utf8mb4  
**Collation:** utf8mb4_0900_ai_ci
```

### Option 2: Minimalist Version
```markdown
## Database Schema
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255)
);
```

## Best Practices

1. Place the schema in a dedicated "Database" or "Schema" section
2. Include both the raw SQL and a human-readable description
3. For complex schemas, consider adding:
   - Sample queries
   - Relationships to other tables
   - Constraints documentation

## Example with Context
````markdown
# User Authentication System

## 🗃️ Database Setup

First, create the database and users table:

```sql
CREATE DATABASE IF NOT EXISTS testdb;
USE testdb;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Important Notes:
- The `email` field has a UNIQUE constraint to prevent duplicates
- Passwords should be stored hashed (never plaintext)
- Uses UTF8MB4 charset to support full Unicode (emojis, etc.)


## 📚 API Routes

### Authentication
- `POST /register` — Register a new user
- `POST /login` — Login and receive JWT token

### User Profile
- `GET /profile` — Get authenticated user's profile (JWT required)

### Users CRUD
- `GET /users` — List users (supports `page` and `limit` query params)
- `GET /users/:id` — Get user by ID
- `PUT /users/:id` — Update user by ID
- `DELETE /users/:id` — Delete user by ID

## 🧪 cURL Examples

Set the API base URL for local development (use `http://localhost:3002` when using Docker Compose):

```bash
export BASE_URL=http://localhost:3000
```

### Register a user

```bash
curl -i -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Secret123"
  }'
```

The registration response contains a JWT token. To save it for subsequent requests:

```bash
export TOKEN=$(curl -s -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Secret123"
  }' | node -e "let data=''; process.stdin.on('data', chunk => data += chunk).on('end', () => console.log(JSON.parse(data).token || ''))")
```

### Login

```bash
curl -i -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Secret123"
  }'
```

You can also save the login token as an environment variable:

```bash
export TOKEN=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Secret123"
  }' | node -e "let data=''; process.stdin.on('data', chunk => data += chunk).on('end', () => console.log(JSON.parse(data).token || ''))")
```

### Get the authenticated profile

```bash
curl -i "$BASE_URL/profile" \
  -H "Authorization: Bearer $TOKEN"
```

### List users

The current implementation only lists the authenticated user:

```bash
curl -i "$BASE_URL/users?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### Get, update, or delete a user

Replace `USER_ID` with the ID returned by login or profile:

```bash
export USER_ID=1

curl -i "$BASE_URL/users/$USER_ID" \
  -H "Authorization: Bearer $TOKEN"

curl -i -X PUT "$BASE_URL/users/$USER_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "john.smith@example.com"
  }'

curl -i -X DELETE "$BASE_URL/users/$USER_ID" \
  -H "Authorization: Bearer $TOKEN"
```
