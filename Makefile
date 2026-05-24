# ==============================================
# Makefile — Microservices Dev Commands
# Cloud Team XX
# ==============================================

.PHONY: up down logs restart build ps health clean help

# Default target
.DEFAULT_GOAL := help

# ================================
# CORE TARGETS
# ================================

## up: Build dan jalankan semua services
up:
	@echo "🚀 Starting all services..."
	docker compose up --build -d
	@echo "✅ All services started. Run 'make logs' to follow logs."

## down: Hentikan dan hapus semua containers
down:
	@echo "🛑 Stopping all services..."
	docker compose down
	@echo "✅ All services stopped."

## logs: Tampilkan logs semua services (atau SERVICE=nama untuk satu service)
logs:
	@if [ -n "$(SERVICE)" ]; then \
		echo "📋 Showing logs for service: $(SERVICE)"; \
		docker compose logs -f $(SERVICE); \
	else \
		echo "📋 Showing logs for all services..."; \
		docker compose logs -f; \
	fi

## restart: Restart semua services (atau SERVICE=nama untuk satu service)
restart:
	@if [ -n "$(SERVICE)" ]; then \
		echo "🔄 Restarting service: $(SERVICE)"; \
		docker compose restart $(SERVICE); \
		echo "✅ Service $(SERVICE) restarted."; \
	else \
		echo "🔄 Restarting all services..."; \
		docker compose restart; \
		echo "✅ All services restarted."; \
	fi

# ================================
# EXTRA TARGETS
# ================================

## build: Build ulang semua images tanpa menjalankan
build:
	@echo "🔨 Building all images..."
	docker compose build

## ps: Tampilkan status semua containers
ps:
	@echo "📊 Services status:"
	docker compose ps

## health: Cek health status semua services
health:
	@echo "🏥 Health check status:"
	@docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Health}}"

## clean: Hapus containers, volumes, dan images (HATI-HATI: data hilang!)
clean:
	@echo "⚠️  WARNING: This will delete all containers, volumes, and images!"
	@read -p "Are you sure? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	docker compose down -v --rmi local
	@echo "🧹 Cleanup complete."

## help: Tampilkan daftar perintah yang tersedia
help:
	@echo ""
	@echo "╔══════════════════════════════════════════════╗"
	@echo "║     Microservices - Available Commands       ║"
	@echo "╚══════════════════════════════════════════════╝"
	@echo ""
	@grep -E '^## [a-zA-Z_-]+:' Makefile | sed 's/## /  make /' | sed 's/:/ \t→/'
	@echo ""
	@echo "Examples:"
	@echo "  make logs SERVICE=auth-service   → logs satu service"
	@echo "  make restart SERVICE=gateway     → restart satu service"
	@echo ""