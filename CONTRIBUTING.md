# Contributing to Markly

Thank you for your interest in contributing to Markly! This document provides guidelines and information for contributors.

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our code of conduct:
- Be respectful and inclusive
- Provide constructive feedback
- Focus on what's best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose
- Git
- Node.js 18+ (for local development)
- Go 1.24+ (for local development)

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/markly.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Set up the development environment:
   ```bash
   cp .env.example .env
   docker-compose up -d
   ```

## 📋 How to Contribute

### Reporting Bugs
1. Check if the bug has already been reported in [Issues](../../issues)
2. If not, create a new issue using the bug report template
3. Provide as much detail as possible, including steps to reproduce

### Suggesting Features
1. Check if the feature has already been suggested in [Issues](../../issues)
2. If not, create a new issue using the feature request template
3. Clearly describe the problem and proposed solution

### Making Changes
1. **Create an Issue First**: For significant changes, create an issue to discuss the approach
2. **Follow GitHub Flow**:
   - Create a feature branch from `main`
   - Make your changes in small, focused commits
   - Write clear commit messages
   - Push to your fork and create a pull request

## 🏗️ Development Guidelines

### Branch Naming Convention
- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test improvements

### Commit Message Format
```
type: brief description

Longer description explaining what and why vs. how.

Closes #123
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring without changing functionality
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

### Code Style

#### Backend (Go)
- Follow standard Go formatting with `gofmt`
- Use meaningful variable and function names
- Add comments for complex logic
- Include error handling
- Write unit tests for new functionality

#### Frontend (TypeScript/React)
- Use TypeScript for all new code
- Follow React best practices and hooks patterns
- Use Tailwind CSS for styling
- Add prop types and interfaces
- Write component tests

#### Database
- Use descriptive migration names
- Include rollback migrations
- Document schema changes
- Maintain referential integrity

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd backend && go test ./...

# Frontend tests
cd frontend && npm test

# Integration tests
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

### Test Requirements
- All new features must include tests
- Bug fixes should include regression tests
- Maintain or improve test coverage
- Tests should be deterministic and isolated

## 📚 Documentation

- Update README.md for user-facing changes
- Add inline code comments for complex logic
- Update API documentation for backend changes
- Include screenshots for UI changes

## 🔄 Pull Request Process

1. **Before Opening a PR**:
   - Ensure your branch is up to date with `main`
   - Run all tests locally
   - Review your own code changes
   - Update documentation as needed

2. **PR Requirements**:
   - Use the pull request template
   - Reference related issues
   - Include screenshots for UI changes
   - Ensure CI checks pass
   - Request reviews from maintainers

3. **Review Process**:
   - Address all feedback promptly
   - Make requested changes in new commits
   - Once approved, squash and merge

## 📦 Release Process

Releases follow semantic versioning (SemVer):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

## 🏷️ Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements or additions to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `needs-triage`: Needs initial review
- `priority-high`: High priority issue
- `priority-low`: Low priority issue

## 🆘 Getting Help

- Check existing [Issues](../../issues) and [Discussions](../../discussions)
- Join our community discussions
- Reach out to maintainers for guidance

## 📄 License

By contributing to Markly, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Markly! 🎉