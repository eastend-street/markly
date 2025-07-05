# Security Documentation - Markly

## Overview

Markly implements comprehensive security measures to protect user data and prevent common web application vulnerabilities.

## Implemented Security Features

### 🔐 Authentication & Authorization

- **JWT Token Authentication**: Secure token-based authentication with configurable expiry
- **Password Hashing**: bcrypt with configurable cost (default: 12)
- **Token Validation**: Automatic token expiry checking and renewal
- **Protected Routes**: Middleware-based route protection

### 🛡️ Input Validation & Sanitization

- **Comprehensive Input Validation**: All user inputs validated using `utils/validation.go`
- **XSS Prevention**: HTML escaping and dangerous pattern removal
- **SQL Injection Prevention**: GORM ORM with parameterized queries
- **URL Validation**: Strict URL format validation
- **Email Validation**: RFC-compliant email validation
- **Password Strength**: Enforced password complexity requirements

### 🚧 Rate Limiting

- **Global Rate Limiting**: 1000 requests per minute across all endpoints
- **Per-IP Rate Limiting**: 100 requests per minute per IP for GraphQL
- **Authentication Rate Limiting**: 10 requests per minute per IP for auth endpoints

### 📋 Security Headers

```go
// Security headers automatically applied
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: [comprehensive CSP policy]
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### 🔒 Request Security

- **Request Size Limits**: 10MB maximum request size
- **Request Timeouts**: 30-second timeout for all requests
- **CORS Configuration**: Strict origin validation
- **Compression**: Gzip compression enabled

### 🎯 GraphQL Security

- **Query Complexity Analysis**: Automatic complex query detection
- **Input Sanitization**: All GraphQL inputs sanitized
- **Error Handling**: Secure error messages without information leakage
- **Playground Disabled**: GraphQL playground disabled in production

## Configuration

### Environment Variables

```bash
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRY=24h

# Security Configuration
BCRYPT_COST=12
MAX_LOGIN_ATTEMPTS=5
LOGIN_ATTEMPT_WINDOW=15m
PASSWORD_MIN_LENGTH=8
RATE_LIMIT_PER_MINUTE=100
MAX_REQUEST_SIZE_MB=10
REQUEST_TIMEOUT_SEC=30

# Production Settings
ENVIRONMENT=production
ALLOWED_ORIGINS=https://markly.app
```

### Security Recommendations

#### Development
- Use strong JWT secrets (minimum 32 characters)
- Enable HTTPS for all environments
- Regular dependency updates
- Code security audits

#### Production
- Set `ENVIRONMENT=production`
- Configure proper CORS origins
- Use secure JWT secrets
- Enable comprehensive logging
- Implement monitoring and alerting
- Regular security scans

## Vulnerability Prevention

### Cross-Site Scripting (XSS)
- **Input Sanitization**: All user inputs HTML-escaped
- **CSP Headers**: Comprehensive Content Security Policy
- **Safe Rendering**: React's built-in XSS protection

### SQL Injection
- **ORM Usage**: GORM with parameterized queries
- **Input Validation**: Strict input validation before database operations
- **Prepared Statements**: All database queries use prepared statements

### Cross-Site Request Forgery (CSRF)
- **SameSite Cookies**: Secure cookie configuration
- **Origin Validation**: Strict CORS policy
- **Token-based Auth**: JWT tokens prevent CSRF attacks

### Command Injection
- **No Direct Commands**: No direct OS command execution
- **Input Validation**: All file operations validated
- **Safe File Handling**: Secure file upload and storage

### Path Traversal
- **Input Validation**: File paths validated and sanitized
- **Restricted Access**: Files served only from designated directories
- **Safe File Operations**: No user-controlled file paths

## Security Audit

Run the security audit script:

```bash
cd backend
go run scripts/security-audit.go
```

## Reporting Security Issues

If you discover a security vulnerability, please:

1. **DO NOT** open a public issue
2. Email security findings to: security@markly.app
3. Include detailed reproduction steps
4. Allow reasonable time for response before disclosure

## Security Best Practices for Contributors

1. **Never commit secrets** - Use environment variables
2. **Validate all inputs** - Use provided validation utilities
3. **Follow secure coding guidelines** - Reference OWASP guidelines
4. **Test security features** - Include security test cases
5. **Regular dependency updates** - Keep dependencies current

## Compliance

Markly security implementation follows:

- **OWASP Top 10** - Protection against common vulnerabilities
- **NIST Cybersecurity Framework** - Comprehensive security approach
- **GDPR Principles** - Data protection by design
- **SOC 2 Type II** - Applicable security controls

## Security Monitoring

### Logging
- Authentication attempts
- Failed authorization checks
- Rate limit violations
- Input validation failures
- System errors and exceptions

### Metrics
- Request rates per endpoint
- Authentication success/failure rates
- Error rates and patterns
- Performance metrics

### Alerting
- Multiple failed authentication attempts
- Unusual traffic patterns
- System performance degradation
- Security policy violations

---

*Last updated: 2024-01-05*
*Security review cycle: Monthly*