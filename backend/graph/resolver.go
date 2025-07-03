package graph

import (
	"markly-backend/internal/database"
	"gorm.io/gorm"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct{
	DB *gorm.DB
}

func NewResolver() *Resolver {
	db := database.GetDB()
	return &Resolver{
		DB: db,
	}
}
