package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/rs/cors"
	_ "github.com/joho/godotenv/autoload"

	"markly-backend/internal/config"
	"markly-backend/internal/database"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Connect to database
	_, err := database.Connect(&cfg.Database)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Initialize router
	r := chi.NewRouter()

	// Middleware
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}).Handler)

	// Health check endpoint
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	// GraphQL endpoint placeholder
	r.Post("/graphql", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"data": {"message": "GraphQL endpoint ready"}}`))
	})

	log.Printf("Server starting on port %s", cfg.Server.Port)
	log.Printf("GraphQL endpoint available at http://localhost:%s/graphql", cfg.Server.Port)
	
	if err := http.ListenAndServe(":"+cfg.Server.Port, r); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}