FROM golang:1.24-alpine AS builder

WORKDIR /app

# Install dependencies including tzdata for timezone support
RUN apk add --no-cache git ca-certificates tzdata

# Copy go mod files first for better caching
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the application with proper flags
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags='-w -s -extldflags "-static"' \
    -a -installsuffix cgo \
    -o main ./cmd/server

# Production stage
FROM alpine:latest

WORKDIR /app

# Install ca-certificates, tzdata, and wget for health checks
RUN apk --no-cache add ca-certificates tzdata wget

# Create non-root user for security
RUN addgroup -g 1001 -S golang && \
    adduser -u 1001 -S golang -G golang

# Copy binary from builder
COPY --from=builder /app/main .

# Change ownership to non-root user
RUN chown golang:golang /app/main

# Switch to non-root user
USER golang

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Run the binary
CMD ["./main"]