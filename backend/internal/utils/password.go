package utils

import (
	"golang.org/x/crypto/bcrypt"
)

// HashPassword hashes a password with configurable cost
func HashPassword(password string) (string, error) {
	return HashPasswordWithCost(password, 12) // Default secure cost
}

// HashPasswordWithCost hashes a password with specified bcrypt cost
func HashPasswordWithCost(password string, cost int) (string, error) {
	// Ensure cost is within safe bounds
	if cost < 10 {
		cost = 10 // Minimum secure cost
	} else if cost > 15 {
		cost = 15 // Maximum reasonable cost for production
	}
	
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), cost)
	return string(bytes), err
}

// CheckPasswordHash verifies a password against its hash
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// IsPasswordSecure checks if a password meets security requirements
func IsPasswordSecure(password string) bool {
	return len(password) >= 8 && 
		containsUppercase(password) && 
		containsLowercase(password) && 
		containsDigit(password)
}

func containsUppercase(s string) bool {
	for _, r := range s {
		if r >= 'A' && r <= 'Z' {
			return true
		}
	}
	return false
}

func containsLowercase(s string) bool {
	for _, r := range s {
		if r >= 'a' && r <= 'z' {
			return true
		}
	}
	return false
}

func containsDigit(s string) bool {
	for _, r := range s {
		if r >= '0' && r <= '9' {
			return true
		}
	}
	return false
}