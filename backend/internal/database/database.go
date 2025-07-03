package database

import (
	"fmt"
	"log"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"markly-backend/internal/config"
	"markly-backend/internal/models"
)

func Connect(cfg *config.DatabaseConfig) (*gorm.DB, error) {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		cfg.User,
		cfg.Password,
		cfg.Host,
		cfg.Port,
		cfg.Name,
	)

	// Retry connection with exponential backoff
	var db *gorm.DB
	var err error
	maxRetries := 10
	baseDelay := 1 * time.Second

	for i := 0; i < maxRetries; i++ {
		log.Printf("Attempting database connection (attempt %d/%d)...", i+1, maxRetries)
		
		db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Info),
		})
		
		if err == nil {
			// Test the connection
			sqlDB, sqlErr := db.DB()
			if sqlErr == nil {
				pingErr := sqlDB.Ping()
				if pingErr == nil {
					log.Println("Database connection successful!")
					break
				}
				err = pingErr
			} else {
				err = sqlErr
			}
		}

		if i < maxRetries-1 {
			delay := time.Duration(i+1) * baseDelay
			log.Printf("Database connection failed: %v. Retrying in %v...", err, delay)
			time.Sleep(delay)
		}
	}

	if err != nil {
		return nil, fmt.Errorf("failed to connect to database after %d attempts: %w", maxRetries, err)
	}

	// Auto migrate the schema
	log.Println("Running database migrations...")
	if err := db.AutoMigrate(
		&models.User{},
		&models.Collection{},
		&models.Bookmark{},
	); err != nil {
		return nil, fmt.Errorf("failed to migrate database: %w", err)
	}

	log.Println("Database connected and migrated successfully")
	return db, nil
}

var globalDB *gorm.DB

func GetDB() *gorm.DB {
	return globalDB
}

func SetDB(db *gorm.DB) {
	globalDB = db
}