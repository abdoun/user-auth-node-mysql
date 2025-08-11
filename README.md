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
- `POST /users` — Create a new user
- `GET /users` — List users (supports `page` and `limit` query params)
- `GET /users/:id` — Get user by ID
- `PUT /users/:id` — Update user by ID
- `DELETE /users/:id` — Delete user by ID
