package middleware

import (
	"net/http"
	"time"

	"github.com/go-chi/chi/v5/middleware"
	"golang.org/x/time/rate"
)

// SecurityHeaders adds essential security headers to responses
func SecurityHeaders() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Prevent MIME type sniffing
			w.Header().Set("X-Content-Type-Options", "nosniff")
			
			// Prevent clickjacking
			w.Header().Set("X-Frame-Options", "DENY")
			
			// Enable XSS protection
			w.Header().Set("X-XSS-Protection", "1; mode=block")
			
			// Strict Transport Security (HTTPS only)
			w.Header().Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
			
			// Content Security Policy
			csp := "default-src 'self'; " +
				"script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; " +
				"style-src 'self' 'unsafe-inline' https:; " +
				"img-src 'self' data: https:; " +
				"font-src 'self' https:; " +
				"connect-src 'self' https: ws: wss:; " +
				"media-src 'self' https:; " +
				"object-src 'none'; " +
				"base-uri 'self'; " +
				"form-action 'self'; " +
				"frame-ancestors 'none'"
			w.Header().Set("Content-Security-Policy", csp)
			
			// Referrer Policy
			w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
			
			// Permissions Policy (formerly Feature Policy)
			w.Header().Set("Permissions-Policy", "geolocation=(), microphone=(), camera=()")
			
			next.ServeHTTP(w, r)
		})
	}
}

// RateLimiter creates a rate limiting middleware
func RateLimiter(requestsPerMinute int) func(http.Handler) http.Handler {
	limiter := rate.NewLimiter(rate.Every(time.Minute/time.Duration(requestsPerMinute)), requestsPerMinute)
	
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if !limiter.Allow() {
				http.Error(w, "Rate limit exceeded", http.StatusTooManyRequests)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}

// IPRateLimiter creates a per-IP rate limiting middleware
func IPRateLimiter(requestsPerMinute int) func(http.Handler) http.Handler {
	limiters := make(map[string]*rate.Limiter)
	
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ip := middleware.GetReqID(r.Context())
			if ip == "" {
				ip = r.RemoteAddr
			}
			
			limiter, exists := limiters[ip]
			if !exists {
				limiter = rate.NewLimiter(rate.Every(time.Minute/time.Duration(requestsPerMinute)), requestsPerMinute)
				limiters[ip] = limiter
			}
			
			if !limiter.Allow() {
				http.Error(w, "Rate limit exceeded", http.StatusTooManyRequests)
				return
			}
			
			next.ServeHTTP(w, r)
		})
	}
}

// GraphQLRateLimiter creates a specific rate limiter for GraphQL endpoints
func GraphQLRateLimiter() func(http.Handler) http.Handler {
	return IPRateLimiter(100) // 100 requests per minute per IP for GraphQL
}

// AuthRateLimiter creates a stricter rate limiter for authentication endpoints
func AuthRateLimiter() func(http.Handler) http.Handler {
	return IPRateLimiter(10) // 10 requests per minute per IP for auth operations
}

// RequestTimeout adds a timeout to requests
func RequestTimeout(timeout time.Duration) func(http.Handler) http.Handler {
	return middleware.Timeout(timeout)
}

// RequestSizeLimit limits the size of request bodies
func RequestSizeLimit(maxBytes int64) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			r.Body = http.MaxBytesReader(w, r.Body, maxBytes)
			next.ServeHTTP(w, r)
		})
	}
}