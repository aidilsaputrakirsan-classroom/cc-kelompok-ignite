#!/bin/bash

# ============================================================
# Wait for PostgreSQL Database Ready Script
# ============================================================
# Script ini mengecek apakah PostgreSQL siap sebelum start uvicorn
# Mencegah error saat application start ketika DB belum siap

set -e

# Load environment variables
if [ -f ../.env ]; then
    export $(cat ../.env | grep -v '^#' | xargs)
fi

# Default values
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-}"
DB_NAME="${DB_NAME:-athsnack}"
MAX_ATTEMPTS=30
ATTEMPT=0

echo "=========================================="
echo "Waiting for PostgreSQL to be ready..."
echo "=========================================="
echo "Host: $DB_HOST"
echo "Port: $DB_PORT"
echo "Database: $DB_NAME"
echo "Max attempts: $MAX_ATTEMPTS"
echo ""

# Function untuk check database connection
check_db_connection() {
    if [ -z "$DB_PASSWORD" ]; then
        # Jika tidak ada password
        pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" > /dev/null 2>&1
    else
        # Jika ada password
        PGPASSWORD="$DB_PASSWORD" pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" > /dev/null 2>&1
    fi
}

# Loop untuk check database sampai siap atau timeout
while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    ATTEMPT=$((ATTEMPT + 1))
    echo "[$ATTEMPT/$MAX_ATTEMPTS] Checking database connection..."
    
    if check_db_connection; then
        echo ""
        echo "✓ PostgreSQL is ready!"
        echo "Starting uvicorn server..."
        echo ""
        
        # Start the application
        cd /app
        exec uvicorn main:app --host 0.0.0.0 --port 8000
    fi
    
    if [ $ATTEMPT -lt $MAX_ATTEMPTS ]; then
        echo "   PostgreSQL not ready yet. Waiting 2 seconds..."
        sleep 2
    fi
done

# Jika masih gagal setelah max attempts
echo ""
echo "✗ Failed to connect to PostgreSQL after $MAX_ATTEMPTS attempts"
echo "Please check your database configuration and try again."
exit 1
