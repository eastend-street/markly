package middleware

import (
	"html"
	"net/http"
	"regexp"
	"strings"
)

// InputSanitizer sanitizes request parameters and form data
func InputSanitizer() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Sanitize query parameters
			if r.URL.RawQuery != "" {
				query := r.URL.Query()
				for key, values := range query {
					for i, value := range values {
						query[key][i] = sanitizeInput(value)
					}
				}
				r.URL.RawQuery = query.Encode()
			}
			
			// For form data, we'll handle this in the GraphQL resolvers
			// since GraphQL typically uses JSON bodies
			
			next.ServeHTTP(w, r)
		})
	}
}

// sanitizeInput sanitizes user input to prevent XSS
func sanitizeInput(input string) string {
	// HTML escape the input
	sanitized := html.EscapeString(input)
	
	// Remove potentially dangerous characters/patterns
	sanitized = strings.ReplaceAll(sanitized, "<script", "&lt;script")
	sanitized = strings.ReplaceAll(sanitized, "</script>", "&lt;/script&gt;")
	sanitized = strings.ReplaceAll(sanitized, "javascript:", "")
	sanitized = strings.ReplaceAll(sanitized, "data:", "")
	sanitized = strings.ReplaceAll(sanitized, "vbscript:", "")
	
	return sanitized
}

// ValidateInput validates and sanitizes common input types
func ValidateInput(input string, inputType string) (string, bool) {
	switch inputType {
	case "email":
		return validateEmail(input)
	case "url":
		return validateURL(input)
	case "username":
		return validateUsername(input)
	case "title":
		return validateTitle(input)
	case "description":
		return validateDescription(input)
	case "tag":
		return validateTag(input)
	default:
		return sanitizeInput(input), true
	}
}

func validateEmail(email string) (string, bool) {
	// Basic email validation regex
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	
	email = strings.TrimSpace(email)
	email = strings.ToLower(email)
	
	if len(email) > 254 || !emailRegex.MatchString(email) {
		return "", false
	}
	
	return email, true
}

func validateURL(url string) (string, bool) {
	url = strings.TrimSpace(url)
	
	// Basic URL validation
	if len(url) > 2048 {
		return "", false
	}
	
	// Must start with http:// or https://
	if !strings.HasPrefix(url, "http://") && !strings.HasPrefix(url, "https://") {
		return "", false
	}
	
	// Basic URL pattern check
	urlRegex := regexp.MustCompile(`^https?://[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*(/.*)?$`)
	if !urlRegex.MatchString(url) {
		return "", false
	}
	
	return url, true
}

func validateUsername(username string) (string, bool) {
	username = strings.TrimSpace(username)
	
	// Username: 3-30 characters, alphanumeric and underscore only
	if len(username) < 3 || len(username) > 30 {
		return "", false
	}
	
	usernameRegex := regexp.MustCompile(`^[a-zA-Z0-9_]+$`)
	if !usernameRegex.MatchString(username) {
		return "", false
	}
	
	return username, true
}

func validateTitle(title string) (string, bool) {
	title = strings.TrimSpace(title)
	title = sanitizeInput(title)
	
	// Title: 1-255 characters
	if len(title) < 1 || len(title) > 255 {
		return "", false
	}
	
	return title, true
}

func validateDescription(description string) (string, bool) {
	description = strings.TrimSpace(description)
	description = sanitizeInput(description)
	
	// Description: up to 1000 characters
	if len(description) > 1000 {
		return "", false
	}
	
	return description, true
}

func validateTag(tag string) (string, bool) {
	tag = strings.TrimSpace(tag)
	tag = strings.ToLower(tag)
	tag = sanitizeInput(tag)
	
	// Tag: 1-50 characters, alphanumeric and hyphen only
	if len(tag) < 1 || len(tag) > 50 {
		return "", false
	}
	
	tagRegex := regexp.MustCompile(`^[a-zA-Z0-9-]+$`)
	if !tagRegex.MatchString(tag) {
		return "", false
	}
	
	return tag, true
}