#!/bin/bash

# RiskFortress Production Deployment Script
# Usage: ./scripts/deploy.sh [environment]

set -e  # Exit on error
set -u  # Exit on undefined variable

ENVIRONMENT=${1:-production}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DEPLOY_LOG="/tmp/riskfortress_deploy_${TIMESTAMP}.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$DEPLOY_LOG"
}

success() {
    echo -e "${GREEN}✓${NC} $1" | tee -a "$DEPLOY_LOG"
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1" | tee -a "$DEPLOY_LOG"
}

error() {
    echo -e "${RED}✗${NC} $1" | tee -a "$DEPLOY_LOG"
    exit 1
}

check_dependencies() {
    log "Checking dependencies..."
    
    local missing=()
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        missing+=("Node.js")
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        missing+=("npm")
    fi
    
    # Check Docker
    if [ "$ENVIRONMENT" = "production" ] && ! command -v docker &> /dev/null; then
        missing+=("Docker")
    fi
    
    # Check AWS CLI for production
    if [ "$ENVIRONMENT" = "production" ] && ! command -v aws &> /dev/null; then
        warning "AWS CLI not found. Some deployment features may not work."
    fi
    
    if [ ${#missing[@]} -ne 0 ]; then
        error "Missing dependencies: ${missing[*]}"
    fi
    
    success "All dependencies are installed"
}

check_environment() {
    log "Checking environment configuration..."
    
    # Check .env file
    if [ ! -f ".env.$ENVIRONMENT" ]; then
        warning ".env.$ENVIRONMENT not found. Using .env.example as template"
        cp .env.example ".env.$ENVIRONMENT"
    fi
    
    # Validate required variables
    local required_vars=("NODE_ENV" "DATABASE_URL" "ENCRYPTION_KEY")
    
    for var in "${required_vars[@]}"; do
        if ! grep -q "^$var=" ".env.$ENVIRONMENT"; then
            warning "$var is not set in .env.$ENVIRONMENT"
        fi
    done
    
    success "Environment configuration validated"
}

run_tests() {
    log "Running tests..."
    
    # Type checking
    log "Running TypeScript type checking..."
    if ! npm run type-check >> "$DEPLOY_LOG" 2>&1; then
        error "TypeScript type checking failed"
    fi
    
    # Linting
    log "Running ESLint..."
    if ! npm run lint >> "$DEPLOY_LOG" 2>&1; then
        error "ESLint checks failed"
    fi
    
    # Unit tests
    log "Running unit tests..."
    if ! npm test -- --coverage=false >> "$DEPLOY_LOG" 2>&1; then
        error "Unit tests failed"
    fi
    
    success "All tests passed"
}

build_application() {
    log "Building application..."
    
    # Clean previous builds
    rm -rf .next
    
    # Install dependencies
    log "Installing dependencies..."
    npm ci --only=production --legacy-peer-deps >> "$DEPLOY_LOG" 2>&1
    
    # Build application
    log "Running Next.js build..."
    NODE_ENV=production npm run build >> "$DEPLOY_LOG" 2>&1
    
    if [ ! -d ".next" ]; then
        error "Build failed - .next directory not found"
    fi
    
    success "Application built successfully"
    
    # Analyze bundle size
    log "Analyzing bundle size..."
    npm run analyze >> "$DEPLOY_LOG" 2>&1 || warning "Bundle analysis failed (non-critical)"
}

security_checks() {
    log "Running security checks..."
    
    # npm audit
    log "Running npm audit..."
    if ! npm audit --production >> "$DEPLOY_LOG" 2>&1; then
        warning "npm audit found vulnerabilities (check log)"
    fi
    
    # Snyk security scan
    if command -v snyk &> /dev/null; then
        log "Running Snyk security scan..."
        if ! snyk test >> "$DEPLOY_LOG" 2>&1; then
            warning "Snyk scan found vulnerabilities"
        fi
    fi
    
    # Check for secrets in code
    log "Checking for secrets in code..."
    if grep -r "password\|secret\|key\|token" --include="*.ts" --include="*.tsx" --include="*.js" src/ | grep -v "//\|test\|mock" | head -10; then
        warning "Potential secrets found in code (check manually)"
    fi
    
    success "Security checks completed"
}

deploy_production() {
    log "Starting production deployment..."
    
    # Load environment variables
    set -a
    source ".env.$ENVIRONMENT"
    set +a
    
    # Check Docker is running
    if ! docker info > /dev/null 2>&1; then
        error "Docker daemon is not running"
    fi
    
    # Build Docker image
    log "Building Docker image..."
    docker build -t riskfortress:$TIMESTAMP -f docker/Dockerfile . >> "$DEPLOY_LOG" 2>&1
    
    # Tag for production
    docker tag riskfortress:$TIMESTAMP riskfortress:latest >> "$DEPLOY_LOG" 2>&1
    
    # Stop and remove old container
    log "Stopping existing containers..."
    docker-compose -f docker/docker-compose.prod.yml down --remove-orphans >> "$DEPLOY_LOG" 2>&1 || true
    
    # Deploy with Docker Compose
    log "Deploying with Docker Compose..."
    docker-compose -f docker/docker-compose.prod.yml up -d >> "$DEPLOY_LOG" 2>&1
    
    # Health check
    log "Running health check..."
    sleep 30  # Wait for services to start
    
    if curl -f http://localhost:3000/api/health; then
        success "Application is healthy"
    else
        error "Application health check failed"
    fi
    
    # Run database migrations
    log "Running database migrations..."
    docker exec riskfortress-app npm run db:migrate >> "$DEPLOY_LOG" 2>&1 || warning "Database migrations may have failed"
    
    success "Production deployment completed successfully"
}

deploy_staging() {
    log "Starting staging deployment..."
    
    # Build for staging
    NODE_ENV=staging npm run build >> "$DEPLOY_LOG" 2>&1
    
    # Deploy to Vercel Preview
    log "Deploying to Vercel Preview..."
    if command -v vercel &> /dev/null; then
        vercel --prod --confirm >> "$DEPLOY_LOG" 2>&1
        success "Staging deployment completed on Vercel"
    else
        warning "Vercel CLI not found. Skipping Vercel deployment."
    fi
}

cleanup() {
    log "Cleaning up..."
    
    # Remove old Docker images (keep last 5)
    docker images riskfortress --format "{{.Tag}}" | grep -v latest | sort -r | tail -n +6 | \
        xargs -I {} docker rmi riskfortress:{} 2>/dev/null || true
    
    # Clean up node_modules for development
    if [ "$ENVIRONMENT" = "development" ]; then
        rm -rf node_modules
    fi
    
    success "Cleanup completed"
}

main() {
    log "Starting RiskFortress deployment for $ENVIRONMENT environment"
    
    # Create deployment log
    touch "$DEPLOY_LOG"
    log "Deployment log: $DEPLOY_LOG"
    
    # Run deployment steps
    check_dependencies
    check_environment
    run_tests
    security_checks
    build_application
    
    case "$ENVIRONMENT" in
        production)
            deploy_production
            ;;
        staging)
            deploy_staging
            ;;
        *)
            log "Development build completed"
            ;;
    esac
    
    cleanup
    
    success "🚀 Deployment completed successfully!"
    log "Deployment time: $(($(date +%s) - $(date -d "$TIMESTAMP" +%s))) seconds"
}

# Handle interrupts
trap 'error "Deployment interrupted by user"' INT TERM

# Run main function
main