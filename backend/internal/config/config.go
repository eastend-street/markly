package config

import (
	"os"
	"strconv"
)

type Config struct {
	Database DatabaseConfig
	Server   ServerConfig
	JWT      JWTConfig
	Security SecurityConfig
}

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	Name     string
}

type ServerConfig struct {
	Port string
}

type JWTConfig struct {
	Secret string
	Expiry string
}

type SecurityConfig struct {
	BcryptCost           int
	MaxLoginAttempts     int
	LoginAttemptWindow   string
	PasswordMinLength    int
	JWTExpiryHours       int
	RateLimitPerMinute   int
	MaxRequestSizeBytes  int64
	RequestTimeoutSec    int
	CSRFTokenLength      int
	SessionTimeoutMin    int
}

func Load() *Config {
	return &Config{
		Database: DatabaseConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnv("DB_PORT", "3306"),
			User:     getEnv("DB_USER", "markly"),
			Password: getEnv("DB_PASSWORD", "marklypassword"),
			Name:     getEnv("DB_NAME", "markly"),
		},
		Server: ServerConfig{
			Port: getEnv("SERVER_PORT", "8080"),
		},
		JWT: JWTConfig{
			Secret: getEnv("JWT_SECRET", "your-super-secret-jwt-key-change-in-production"),
			Expiry: getEnv("JWT_EXPIRY", "24h"),
		},
		Security: SecurityConfig{
			BcryptCost:          getEnvAsInt("BCRYPT_COST", 12),
			MaxLoginAttempts:    getEnvAsInt("MAX_LOGIN_ATTEMPTS", 5),
			LoginAttemptWindow:  getEnv("LOGIN_ATTEMPT_WINDOW", "15m"),
			PasswordMinLength:   getEnvAsInt("PASSWORD_MIN_LENGTH", 8),
			JWTExpiryHours:      getEnvAsInt("JWT_EXPIRY_HOURS", 24),
			RateLimitPerMinute:  getEnvAsInt("RATE_LIMIT_PER_MINUTE", 100),
			MaxRequestSizeBytes: int64(getEnvAsInt("MAX_REQUEST_SIZE_MB", 10)) << 20,
			RequestTimeoutSec:   getEnvAsInt("REQUEST_TIMEOUT_SEC", 30),
			CSRFTokenLength:     getEnvAsInt("CSRF_TOKEN_LENGTH", 32),
			SessionTimeoutMin:   getEnvAsInt("SESSION_TIMEOUT_MIN", 30),
		},
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intVal, err := strconv.Atoi(value); err == nil {
			return intVal
		}
	}
	return defaultValue
}