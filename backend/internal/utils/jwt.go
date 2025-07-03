package utils

import (
	"time"

	"github.com/golang-jwt/jwt/v5"

	"markly-backend/internal/middleware"
	"markly-backend/internal/models"
)

func GenerateToken(user *models.User, secret string) (string, error) {
	claims := &middleware.JWTClaims{
		UserID:   user.ID,
		Username: user.Username,
		Email:    user.Email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

func GenerateJWT(userID uint) (string, error) {
	// This is a simplified version - in a real app, you'd pass the secret as a parameter
	claims := &middleware.JWTClaims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	// TODO: Get this from config
	return token.SignedString([]byte("your-super-secret-jwt-key-change-this-in-production"))
}