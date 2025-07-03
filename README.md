# Markly

A modern bookmark manager built with Next.js, Go, and GraphQL - similar to Raindrop.io.

## 🧱 Tech Stack

### Frontend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Apollo Client** for GraphQL communication

### Backend
- **Go (Golang)** with GraphQL using gqlgen
- **MySQL** database with GORM
- **JWT** authentication
- **Chi** router for HTTP handling

### Infrastructure
- **Docker** & **Docker Compose** for containerization
- **MySQL 8.0** database
- **CORS** enabled for cross-origin requests

## 🔑 Core Features

- [x] User authentication (signup/login) with JWT
- [x] Database schema with proper relationships
- [x] Docker infrastructure setup
- [ ] Create, delete, update bookmark collections
- [ ] CRUD operations for bookmarks with:
  - Title, URL, Tags, Notes
  - Favicon and Screenshot capture
  - Created date tracking
- [ ] View bookmarks by collection
- [ ] Global search with filters (tags, text)
- [ ] Pagination and mobile-friendly UI

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Go 1.24+ (for local development)

### Using Docker (Recommended)
```bash
# Clone the repository
git clone <repository-url>
cd markly

# Copy and configure environment variables
cp .env.example .env
# Edit .env file with your preferred settings

# Test Docker setup (optional but recommended)
./docker-test.sh

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:8080
# GraphQL Playground: http://localhost:8080
```

### Docker Troubleshooting
If you encounter issues with `docker-compose up`:

1. **Clean rebuild**: `docker-compose down -v && docker-compose up -d --build`
2. **Check logs**: `docker-compose logs -f [service-name]`
3. **Verify environment**: Ensure `.env` file exists and has correct values
4. **Run test script**: `./docker-test.sh` to diagnose issues

Common solutions:
- **Port conflicts**: Change ports in `docker-compose.yml` if 3000/8080/3306 are in use
- **Build failures**: Check Docker daemon is running and has sufficient resources
- **Network issues**: Restart Docker daemon or try `docker system prune`

### Local Development
```bash
# Copy and configure environment variables
cp .env.example .env
# Edit .env to use local development settings (DB_HOST=localhost)

# Start database only
docker-compose up -d mysql

# Start backend
cd backend
go run cmd/server/main.go

# Start frontend (in new terminal)
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
markly/
├── docker-compose.yml          # Multi-service orchestration
├── .env.example               # Environment variables template
├── README.md                  # Project documentation
├── backend/                   # Go GraphQL API
│   ├── cmd/server/           # Application entry point
│   ├── internal/             # Private application code
│   │   ├── config/          # Configuration management
│   │   ├── database/        # Database connection & migration
│   │   ├── middleware/      # HTTP middleware (auth, CORS)
│   │   ├── models/          # GORM database models
│   │   └── utils/           # Utility functions
│   ├── schema/              # GraphQL schema definitions
│   ├── go.mod               # Go module dependencies
│   └── Dockerfile           # Backend container image
└── frontend/                # Next.js application
    ├── src/                 # Source code
    │   └── app/            # App Router pages & components
    ├── package.json         # npm dependencies
    ├── tailwind.config.js   # Tailwind CSS configuration
    ├── next.config.ts       # Next.js configuration
    └── Dockerfile          # Frontend container image
```

## 🗄️ Database Schema

```sql
-- Users table
CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(191) UNIQUE NOT NULL,
  username VARCHAR(191) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME(3),
  updated_at DATETIME(3)
);

-- Collections table
CREATE TABLE collections (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  user_id BIGINT UNSIGNED NOT NULL,
  created_at DATETIME(3),
  updated_at DATETIME(3),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Bookmarks table
CREATE TABLE bookmarks (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  notes TEXT,
  favicon TEXT,
  screenshot TEXT,
  tags JSON,
  collection_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  created_at DATETIME(3),
  updated_at DATETIME(3),
  FOREIGN KEY (collection_id) REFERENCES collections(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 🔧 Development

### Environment Variables
Copy `.env.example` to `.env` and configure:

```env
# Database Configuration
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=markly
MYSQL_USER=markly
MYSQL_PASSWORD=marklypassword

# Backend Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
SERVER_PORT=8080

# Frontend Configuration
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8080/graphql
```

### API Endpoints

#### Health Check
```bash
GET /health
# Response: "OK"
```

#### GraphQL Endpoint
```bash
POST /graphql
# GraphQL queries and mutations
```

## 🛠️ Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Roadmap

### Phase 1: Foundation ✅
- [x] Project structure setup
- [x] Docker infrastructure
- [x] Database schema and models
- [x] Basic authentication middleware
- [x] Frontend framework setup

### Phase 2: Core Features 🚧
- [ ] Complete GraphQL schema and resolvers
- [ ] User authentication UI
- [ ] Collection management interface
- [ ] Bookmark CRUD operations
- [ ] Basic search functionality

### Phase 3: Enhanced Features 📋
- [ ] Advanced search and filtering
- [ ] Favicon and screenshot capture
- [ ] Responsive mobile design
- [ ] Import/export functionality
- [ ] Browser extension

### Phase 4: Polish & Performance 📋
- [ ] Comprehensive testing
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Production deployment guide

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Acknowledgments

- Inspired by [Raindrop.io](https://raindrop.io/)
- Built with modern web technologies and best practices