# ============================================================
# Stage 1: Build — Install deps & build React app
# ============================================================
# Menggunakan image Node.js berbasis Alpine untuk tahap build (lebih ringan)
FROM node:22-alpine AS builder

# Menetapkan folder /app dalam container
WORKDIR /app

# Copy dependency files dulu (cache optimization)
# Menyalin file package.json dan package-lock.json (jika ada) ke dalam container
COPY package.json package-lock.json* ./ 

# Install dependencies
# npm ci = clean install (lebih cepat & reproducible dari npm install)
# Menjalankan perintah install dependency
RUN npm ci

# Copy source code
COPY . .

# Set API URL untuk production build
# Ini akan di-embed ke dalam bundle JavaScript
# Membuat variabel sementara saat proses build docker bernama VITE_API_URL
ARG VITE_API_URL=http://localhost:8000
# Menetapkan variabel lingkungan
ENV VITE_API_URL=$VITE_API_URL

# Build React app → output di /app/dist/
# Menjalankan build React menjadi file production
RUN npm run build

# ============================================================
# Stage 2: Production — Serve dengan Nginx
# ============================================================
# Mengambil image Nginx ringan
FROM nginx:alpine

# Copy build output dari stage 1
# Menyalin hasil build dari stage builder
COPY --from=builder /app/dist/ /usr/share/nginx/html/

# Copy custom nginx config
# Menyalin konfigurasi nginx khusus ke dalam container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx default port
# Mengekspos port 80 untuk akses HTTP
EXPOSE 80

# Nginx berjalan di foreground
# Menjalankan nginx dengan opsi untuk tetap berjalan di foreground
CMD ["nginx", "-g", "daemon off;"]