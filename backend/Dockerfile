# ============================================================
# Stage: Production Image
# ============================================================

# 1. Base image — Python 3.12 slim
FROM python:3.12-slim

# 2. Set working directory
WORKDIR /app

# 3. Copy requirements (cache optimization)
COPY requirements.txt .

# 4. Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy seluruh kode
COPY . .

# 6. Buat non-root user + kasih permission
RUN useradd -m appuser && chown -R appuser /app

# 7. Gunakan user tersebut
USER appuser

# 8. Expose port
EXPOSE 8000

# 9. Run aplikasi
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]