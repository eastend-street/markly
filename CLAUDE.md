# Markly - Claude Development Notes

## Project Overview
Markly is a modern bookmark manager similar to Raindrop.io, built with Next.js, Go, and GraphQL.

## Tech Stack
- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS, Apollo Client
- **Backend**: Go with GraphQL (gqlgen), MySQL, JWT auth, Chi router
- **Infrastructure**: Docker, Docker Compose, MySQL 8.0

## Port Configuration
- **Frontend**: http://localhost:3000
- **Backend/GraphQL**: http://localhost:8081
- **MySQL**: localhost:3308 (external), 3306 (internal)

## Development Commands
```bash
# Start all services
docker-compose up -d

# Local development
docker-compose up -d mysql  # Database only
cd backend && go run cmd/server/main.go  # Backend
cd frontend && npm install && npm run dev  # Frontend

# Testing
cd frontend && npm test  # Frontend tests
cd backend && go test ./...  # Backend tests
```

## Current Status
- ✅ Phase 1: Foundation complete (Docker, database, auth middleware, project structure)
- 🚧 Phase 2: Core Features in progress
- 📋 Phase 3: Enhanced Features planned
- 📋 Phase 4: Polish & Performance planned

## GitHub Issues Priority Order
1. Complete GraphQL schema and resolvers (#1) - Foundation
2. User authentication UI (#2) - Core functionality
3. Collection management interface (#3) - Core functionality
4. Bookmark CRUD operations (#4) - Core functionality
5. Basic search functionality (#5) - Core functionality
6. Advanced search and filtering (#6) - Enhancement
7. Favicon and screenshot capture (#7) - Enhancement
8. Responsive mobile design (#8) - Enhancement
9. Import/export functionality (#9) - Enhancement
10. Browser extension (#10) - Advanced feature
11. Comprehensive testing (#11) - Quality
12. Performance optimization (#12) - Quality
13. Security hardening (#13) - Quality
14. Production deployment guide (#14) - Documentation

## Key Directories
- `backend/graph/schema.graphqls` - GraphQL schema
- `backend/internal/resolvers/` - GraphQL resolvers
- `frontend/src/app/` - Next.js app router pages
- `backend/internal/models/` - Database models
- `backend/internal/middleware/` - Auth middleware

## Development Notes
- Use Go modules for backend dependencies
- Follow GraphQL best practices with proper error handling
- Implement proper JWT token validation
- Use TypeScript strictly in frontend
- Follow modern React patterns with hooks
- Use Tailwind for consistent styling