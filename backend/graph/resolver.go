package graph

import (
	"markly-backend/internal/database"
	"markly-backend/internal/services"
	"gorm.io/gorm"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct{
	DB                  *gorm.DB
	ImageCaptureService *services.ImageCaptureService
}

func NewResolver() *Resolver {
	db := database.GetDB()
	imageCaptureService := services.NewImageCaptureService("/tmp/markly/images", "http://localhost:8080")
	return &Resolver{
		DB:                  db,
		ImageCaptureService: imageCaptureService,
	}
}
