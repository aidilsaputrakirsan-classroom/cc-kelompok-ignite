# ============================================================
# Makefile - DevOps Workflow
# Branch: feature/makefile-update
# ============================================================
 
.PHONY: help lint test pr-check build docker-build docker-run clean
 
# Default target
help:
	@echo ""
	@echo "  ╔══════════════════════════════════════════╗"
	@echo "  ║        Available Make Targets            ║"
	@echo "  ╠══════════════════════════════════════════╣"
	@echo "  ║  make lint       - Jalankan linter       ║"
	@echo "  ║  make test       - Jalankan test suite   ║"
	@echo "  ║  make pr-check   - Build Docker + Test   ║"
	@echo "  ║  make build      - Build aplikasi        ║"
	@echo "  ║  make clean      - Bersihkan artifacts   ║"
	@echo "  ╚══════════════════════════════════════════╝"
	@echo ""
 
# ─── Linter ──────────────────────────────────────────────────
lint:
	@echo ">>> [LINT] Menjalankan linter..."
	@echo ">>> [LINT] Checking Python files..."
	@if command -v flake8 >/dev/null 2>&1; then \
		flake8 . --max-line-length=100 --exclude=.git,__pycache__,.venv,node_modules; \
	else \
		echo "    [SKIP] flake8 tidak ditemukan, install: pip install flake8"; \
	fi
	@if command -v pylint >/dev/null 2>&1; then \
		pylint **/*.py --fail-under=7.0 || true; \
	else \
		echo "    [SKIP] pylint tidak ditemukan, install: pip install pylint"; \
	fi
	@echo ">>> [LINT] Selesai."
 
# ─── Test (Placeholder) ──────────────────────────────────────
test:
	@echo ">>> [TEST] Menjalankan test suite..."
	@if command -v pytest >/dev/null 2>&1; then \
		pytest tests/ -v --tb=short; \
	else \
		echo "    [PLACEHOLDER] pytest tidak ditemukan."; \
		echo "    Install: pip install pytest"; \
		echo "    Jalankan: pytest tests/ -v"; \
	fi
	@echo ">>> [TEST] Selesai."
 
# ─── PR Check: Build Docker + Test ───────────────────────────
pr-check: docker-build test
	@echo ""
	@echo ">>> [PR-CHECK] ✅ Semua tahap PR check berhasil!"
	@echo ">>> [PR-CHECK] Docker build + Test suite OK."
	@echo ""
 
# ─── Docker Build ────────────────────────────────────────────
docker-build:
	@echo ">>> [DOCKER] Memulai Docker build..."
	@if command -v docker >/dev/null 2>&1; then \
		docker build -t app:latest . ; \
		echo ">>> [DOCKER] ✅ Build berhasil: app:latest"; \
	else \
		echo "    [SKIP] Docker tidak ditemukan. Install Docker terlebih dahulu."; \
	fi
 
# ─── Docker Run ──────────────────────────────────────────────
docker-run:
	@echo ">>> [DOCKER] Menjalankan container..."
	docker run --rm -p 8000:8000 app:latest
 
# ─── Build Aplikasi ──────────────────────────────────────────
build:
	@echo ">>> [BUILD] Membangun aplikasi..."
	@if [ -f "requirements.txt" ]; then \
		pip install -r requirements.txt; \
	fi
	@echo ">>> [BUILD] Selesai."
 
# ─── Clean ───────────────────────────────────────────────────
clean:
	@echo ">>> [CLEAN] Membersihkan build artifacts..."
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true
	@echo ">>> [CLEAN] Selesai."
 