# ==============================================
# Makefile — Cloud Team XX
# ==============================================
# Targets:
#   make dev     → jalankan environment development (hot-reload)
#   make prod    → jalankan environment production
#   make logs    → tampilkan logs semua service
#   make status  → tampilkan status semua container
#
# Usage:
#   make dev
#   make prod
#   make logs service=auth-service
#   make status

# Nama project Docker Compose
PROJECT_NAME=cc-kelompok-ignite

# Compose files
COMPOSE_BASE=docker-compose.yml
COMPOSE_DEV=docker-compose.dev.yml
COMPOSE_PROD=docker-compose.prod.yml

# Env file production
PROD_ENV_FILE=.env.production

# Warna output terminal
GREEN=\033[0;32m
YELLOW=\033[1;33m
RED=\033[0;31m
NC=\033[0m # No Color

.PHONY: dev prod logs status down clean help

# ================================
# DEFAULT TARGET
# ================================
help:
	@echo ""
	@echo "$(GREEN)Cloud Team XX — Makefile Commands$(NC)"
	@echo "======================================"
	@echo "  $(YELLOW)make dev$(NC)            Jalankan environment development (hot-reload)"
	@echo "  $(YELLOW)make prod$(NC)           Jalankan environment production"
	@echo "  $(YELLOW)make logs$(NC)           Tampilkan logs semua service (Ctrl+C untuk keluar)"
	@echo "  $(YELLOW)make logs s=<name>$(NC)  Tampilkan logs service tertentu, contoh: make logs s=auth-service"
	@echo "  $(YELLOW)make status$(NC)         Tampilkan status semua container"
	@echo "  $(YELLOW)make down$(NC)           Stop dan hapus semua container"
	@echo "  $(YELLOW)make clean$(NC)          Stop container + hapus volumes (HATI-HATI: data hilang)"
	@echo ""

# ================================
# DEV — Development dengan hot-reload
# ================================
dev:
	@echo "$(GREEN)🚀 Starting development environment...$(NC)"
	@echo "$(YELLOW)   Hot-reload aktif untuk semua service$(NC)"
	docker compose \
		-p $(PROJECT_NAME) \
		-f $(COMPOSE_BASE) \
		-f $(COMPOSE_DEV) \
		up -d --build
	@echo ""
	@echo "$(GREEN)✅ Development environment is up!$(NC)"
	@echo "   Frontend  → http://localhost:5173"
	@echo "   Auth API  → http://localhost:8001/docs"
	@echo "   Item API  → http://localhost:8002/docs"
	@echo "   Gateway   → http://localhost"
	@echo ""
	@echo "   Run $(YELLOW)make logs$(NC) to follow logs"
	@echo "   Run $(YELLOW)make status$(NC) to check container status"

# ================================
# PROD — Production
# ================================
prod:
	@echo "$(GREEN)🚀 Starting production environment...$(NC)"
	@if [ ! -f $(PROD_ENV_FILE) ]; then \
		echo "$(RED)❌ File $(PROD_ENV_FILE) tidak ditemukan!$(NC)"; \
		echo "   Buat dulu: cp .env.production.example .env.production"; \
		echo "   Lalu isi nilai yang sesuai"; \
		exit 1; \
	fi
	docker compose \
		-p $(PROJECT_NAME) \
		-f $(COMPOSE_BASE) \
		-f $(COMPOSE_PROD) \
		--env-file $(PROD_ENV_FILE) \
		up -d
	@echo ""
	@echo "$(GREEN)✅ Production environment is up!$(NC)"
	@echo "   Application → http://localhost"
	@echo ""
	@echo "   Run $(YELLOW)make status$(NC) to check container status"
	@echo "   Run $(YELLOW)make logs$(NC) to follow logs"

# ================================
# LOGS — Tampilkan logs
# ================================
logs:
ifdef s
	@echo "$(GREEN)📋 Logs for service: $(s)$(NC)"
	docker compose -p $(PROJECT_NAME) logs -f $(s)
else
	@echo "$(GREEN)📋 Logs for all services (Ctrl+C to exit)$(NC)"
	docker compose -p $(PROJECT_NAME) logs -f
endif

# ================================
# STATUS — Tampilkan status container
# ================================
status:
	@echo "$(GREEN)📊 Container Status$(NC)"
	@echo "======================================"
	docker compose -p $(PROJECT_NAME) ps
	@echo ""
	@echo "$(GREEN)📊 Resource Usage$(NC)"
	@echo "======================================"
	docker stats --no-stream \
		$(PROJECT_NAME)-auth-db-1 \
		$(PROJECT_NAME)-item-db-1 \
		$(PROJECT_NAME)-auth-service-1 \
		$(PROJECT_NAME)-item-service-1 \
		$(PROJECT_NAME)-frontend-1 \
		$(PROJECT_NAME)-gateway-1 \
		2>/dev/null || docker stats --no-stream

# ================================
# DOWN — Stop semua container
# ================================
down:
	@echo "$(YELLOW)🛑 Stopping all containers...$(NC)"
	docker compose -p $(PROJECT_NAME) down
	@echo "$(GREEN)✅ All containers stopped$(NC)"

# ================================
# CLEAN — Stop + hapus volumes
# ================================
clean:
	@echo "$(RED)⚠️  WARNING: Ini akan menghapus semua data database!$(NC)"
	@read -p "Yakin? (yes/no): " confirm; \
	if [ "$$confirm" = "yes" ]; then \
		docker compose -p $(PROJECT_NAME) down --volumes --remove-orphans; \
		echo "$(GREEN)✅ All containers and volumes removed$(NC)"; \
	else \
		echo "$(YELLOW)Cancelled$(NC)"; \
	fi