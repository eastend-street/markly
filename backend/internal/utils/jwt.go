package utils

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
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

// GenerateJWT generates a JWT token with enhanced security
func GenerateJWT(userID uint) (string, error) {
	return GenerateJWTWithConfig(userID, "your-super-secret-jwt-key-change-this-in-production", 24*time.Hour)
}

// GenerateJWTWithConfig generates a JWT token with configurable parameters
func GenerateJWTWithConfig(userID uint, secret string, expiry time.Duration) (string, error) {
	if len(secret) < 32 {
		return "", errors.New("JWT secret must be at least 32 characters long")
	}
	
	// Generate a random JTI (JWT ID) for token uniqueness
	jti, err := generateSecureToken(16)
	if err != nil {
		return "", err
	}
	
	now := time.Now()
	claims := &middleware.JWTClaims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "markly",
			Subject:   "user-auth",
			Audience:  []string{"markly-frontend"},
			ExpiresAt: jwt.NewNumericDate(now.Add(expiry)),
			NotBefore: jwt.NewNumericDate(now),
			IssuedAt:  jwt.NewNumericDate(now),
			ID:        jti,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

// ValidateJWT validates a JWT token and returns claims
func ValidateJWT(tokenString, secret string) (*middleware.JWTClaims, error) {
	if len(secret) < 32 {
		return nil, errors.New("JWT secret must be at least 32 characters long")
	}
	
	claims := &middleware.JWTClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(secret), nil
	})
	
	if err != nil {
		return nil, err
	}
	
	if !token.Valid {
		return nil, errors.New("invalid token")
	}
	
	return claims, nil
}

// generateSecureToken generates a cryptographically secure random token
func generateSecureToken(length int) (string, error) {
	bytes := make([]byte, length)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}