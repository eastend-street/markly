package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/rs/cors"
	_ "github.com/joho/godotenv/autoload"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"

	"markly-backend/internal/config"
	"markly-backend/internal/database"
	securitymw "markly-backend/internal/middleware"
	"markly-backend/graph"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Connect to database
	db, err := database.Connect(&cfg.Database)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	database.SetDB(db)

	// Create images directory if it doesn't exist
	imagesDir := "/tmp/markly/images"
	if err := os.MkdirAll(imagesDir, 0755); err != nil {
		log.Printf("Warning: Failed to create images directory: %v", err)
		imagesDir = "/tmp" // Fallback to tmp directory
	}

	// Initialize router
	r := chi.NewRouter()

	// Security Middleware (applied first)
	r.Use(securitymw.SecurityHeaders())
	r.Use(securitymw.RequestTimeout(30 * time.Second))
	r.Use(securitymw.RequestSizeLimit(10 << 20)) // 10MB limit
	r.Use(securitymw.InputSanitizer())
	
	// Standard Middleware
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Compress(5))
	
	// Rate Limiting
	r.Use(securitymw.RateLimiter(1000)) // 1000 requests per minute globally
	
	// CORS Configuration
	allowedOrigins := []string{"http://localhost:3000"}
	if os.Getenv("ENVIRONMENT") == "production" {
		allowedOrigins = []string{"https://markly.app"} // Replace with your production domain
	}
	
	r.Use(cors.New(cors.Options{
		AllowedOrigins:   allowedOrigins,
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-Requested-With"},
		ExposedHeaders:   []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           300,
	}).Handler)
	
	// Authentication Middleware
	r.Use(securitymw.AuthMiddleware(&cfg.JWT))

	// Static file serving for images
	fileServer := http.FileServer(http.Dir(imagesDir))
	r.Handle("/images/*", http.StripPrefix("/images/", fileServer))

	// Health check endpoint
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	// GraphQL server
	resolver := graph.NewResolver()
	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: resolver}))
	
	// GraphQL endpoints with additional rate limiting
	r.Route("/graphql", func(r chi.Router) {
		r.Use(securitymw.GraphQLRateLimiter())
		r.Handle("/", srv)
	})
	
	// Disable GraphQL playground in production
	if os.Getenv("ENVIRONMENT") != "production" {
		r.Handle("/", playground.Handler("GraphQL playground", "/graphql"))
	}

	log.Printf("Server starting on port %s", cfg.Server.Port)
	log.Printf("GraphQL endpoint available at http://localhost:%s/graphql", cfg.Server.Port)
	
	if err := http.ListenAndServe(":"+cfg.Server.Port, r); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}