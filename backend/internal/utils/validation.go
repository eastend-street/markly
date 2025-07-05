package utils

import (
	"errors"
	"html"
	"regexp"
	"strings"
	"unicode/utf8"
)

// ValidationError represents a validation error
type ValidationError struct {
	Field   string
	Message string
}

func (e ValidationError) Error() string {
	return e.Message
}

// ValidateRegisterInput validates user registration input
func ValidateRegisterInput(email, username, password string) error {
	if err := ValidateEmail(email); err != nil {
		return err
	}
	
	if err := ValidateUsername(username); err != nil {
		return err
	}
	
	if err := ValidatePassword(password); err != nil {
		return err
	}
	
	return nil
}

// ValidateEmail validates email format and length
func ValidateEmail(email string) error {
	email = strings.TrimSpace(email)
	
	if email == "" {
		return ValidationError{Field: "email", Message: "Email is required"}
	}
	
	if len(email) > 254 {
		return ValidationError{Field: "email", Message: "Email is too long"}
	}
	
	// Basic email validation regex
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	if !emailRegex.MatchString(email) {
		return ValidationError{Field: "email", Message: "Invalid email format"}
	}
	
	return nil
}

// ValidateUsername validates username format and length
func ValidateUsername(username string) error {
	username = strings.TrimSpace(username)
	
	if username == "" {
		return ValidationError{Field: "username", Message: "Username is required"}
	}
	
	if len(username) < 3 {
		return ValidationError{Field: "username", Message: "Username must be at least 3 characters long"}
	}
	
	if len(username) > 30 {
		return ValidationError{Field: "username", Message: "Username must be less than 30 characters"}
	}
	
	// Username: alphanumeric and underscore only
	usernameRegex := regexp.MustCompile(`^[a-zA-Z0-9_]+$`)
	if !usernameRegex.MatchString(username) {
		return ValidationError{Field: "username", Message: "Username can only contain letters, numbers, and underscores"}
	}
	
	return nil
}

// ValidatePassword validates password strength
func ValidatePassword(password string) error {
	if password == "" {
		return ValidationError{Field: "password", Message: "Password is required"}
	}
	
	if len(password) < 8 {
		return ValidationError{Field: "password", Message: "Password must be at least 8 characters long"}
	}
	
	if len(password) > 128 {
		return ValidationError{Field: "password", Message: "Password is too long"}
	}
	
	// Check for at least one uppercase letter
	hasUpper := regexp.MustCompile(`[A-Z]`).MatchString(password)
	// Check for at least one lowercase letter
	hasLower := regexp.MustCompile(`[a-z]`).MatchString(password)
	// Check for at least one digit
	hasNumber := regexp.MustCompile(`\d`).MatchString(password)
	
	if !hasUpper || !hasLower || !hasNumber {
		return ValidationError{Field: "password", Message: "Password must contain at least one uppercase letter, one lowercase letter, and one number"}
	}
	
	return nil
}

// ValidateURL validates bookmark URL
func ValidateURL(url string) error {
	url = strings.TrimSpace(url)
	
	if url == "" {
		return ValidationError{Field: "url", Message: "URL is required"}
	}
	
	if len(url) > 2048 {
		return ValidationError{Field: "url", Message: "URL is too long"}
	}
	
	// Must start with http:// or https://
	if !strings.HasPrefix(url, "http://") && !strings.HasPrefix(url, "https://") {
		return ValidationError{Field: "url", Message: "URL must start with http:// or https://"}
	}
	
	// Basic URL pattern check
	urlRegex := regexp.MustCompile(`^https?://[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*(/.*)?$`)
	if !urlRegex.MatchString(url) {
		return ValidationError{Field: "url", Message: "Invalid URL format"}
	}
	
	return nil
}

// ValidateTitle validates bookmark/collection title
func ValidateTitle(title string) error {
	title = strings.TrimSpace(title)
	
	if title == "" {
		return ValidationError{Field: "title", Message: "Title is required"}
	}
	
	if utf8.RuneCountInString(title) > 255 {
		return ValidationError{Field: "title", Message: "Title is too long"}
	}
	
	return nil
}

// ValidateDescription validates optional description fields
func ValidateDescription(description string) error {
	if description == "" {
		return nil // Optional field
	}
	
	if utf8.RuneCountInString(description) > 1000 {
		return ValidationError{Field: "description", Message: "Description is too long"}
	}
	
	return nil
}

// ValidateNotes validates optional notes field
func ValidateNotes(notes string) error {
	if notes == "" {
		return nil // Optional field
	}
	
	if utf8.RuneCountInString(notes) > 2000 {
		return ValidationError{Field: "notes", Message: "Notes are too long"}
	}
	
	return nil
}

// ValidateTags validates bookmark tags
func ValidateTags(tags []string) error {
	if len(tags) > 20 {
		return ValidationError{Field: "tags", Message: "Too many tags (maximum 20)"}
	}
	
	for _, tag := range tags {
		tag = strings.TrimSpace(tag)
		
		if tag == "" {
			return ValidationError{Field: "tags", Message: "Tag cannot be empty"}
		}
		
		if len(tag) > 50 {
			return ValidationError{Field: "tags", Message: "Tag is too long (maximum 50 characters)"}
		}
		
		// Tags: alphanumeric and hyphen only
		tagRegex := regexp.MustCompile(`^[a-zA-Z0-9-]+$`)
		if !tagRegex.MatchString(tag) {
			return ValidationError{Field: "tags", Message: "Tags can only contain letters, numbers, and hyphens"}
		}
	}
	
	return nil
}

// ValidateCollectionName validates collection name
func ValidateCollectionName(name string) error {
	name = strings.TrimSpace(name)
	
	if name == "" {
		return ValidationError{Field: "name", Message: "Collection name is required"}
	}
	
	if utf8.RuneCountInString(name) < 2 {
		return ValidationError{Field: "name", Message: "Collection name must be at least 2 characters long"}
	}
	
	if utf8.RuneCountInString(name) > 50 {
		return ValidationError{Field: "name", Message: "Collection name is too long"}
	}
	
	return nil
}

// ValidateColor validates color hex code
func ValidateColor(color string) error {
	if color == "" {
		return nil // Optional field
	}
	
	// Must be a valid hex color
	colorRegex := regexp.MustCompile(`^#[0-9A-Fa-f]{6}$`)
	if !colorRegex.MatchString(color) {
		return ValidationError{Field: "color", Message: "Invalid color format (must be hex color like #FF0000)"}
	}
	
	return nil
}

// SanitizeString sanitizes string input to prevent XSS
func SanitizeString(input string) string {
	// HTML escape the input
	sanitized := html.EscapeString(input)
	
	// Remove potentially dangerous characters/patterns
	sanitized = strings.ReplaceAll(sanitized, "<script", "&lt;script")
	sanitized = strings.ReplaceAll(sanitized, "</script>", "&lt;/script&gt;")
	sanitized = strings.ReplaceAll(sanitized, "javascript:", "")
	sanitized = strings.ReplaceAll(sanitized, "vbscript:", "")
	
	return strings.TrimSpace(sanitized)
}

// SanitizeTags sanitizes and normalizes tags
func SanitizeTags(tags []string) []string {
	var sanitized []string
	seen := make(map[string]bool)
	
	for _, tag := range tags {
		tag = strings.TrimSpace(strings.ToLower(tag))
		tag = SanitizeString(tag)
		
		if tag != "" && !seen[tag] {
			sanitized = append(sanitized, tag)
			seen[tag] = true
		}
	}
	
	return sanitized
}