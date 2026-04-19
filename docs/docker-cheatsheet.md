Dokumen ini berisi kumpulan perintah dasar Docker yang sering digunakan dalam proses pengembangan dan pengelolaan aplikasi pada proyek cc-kelompok-ignite. Cheatsheet ini disusun untuk membantu memahami dan menjalankan container, mulai dari proses build, run, hingga deployment secara lebih praktis dan efisien.

# 🚀 1. Build & Run

| Command                                                              | Fungsi                      | Contoh (Proyek)                                                      |
| -------------------------------------------------------------------- | --------------------------- | -------------------------------------------------------------------- |
| `docker build -t ignite-app:v1 .`                                    | Build image dari Dockerfile | `docker build -t ignite-app:v1 .`                                    |
| `docker run --name cc-kelompok-ignite ignite-app:v1`                 | Jalankan container          | `docker run --name cc-kelompok-ignite ignite-app:v1`                 |
| `docker run -p 8000:8000 --name cc-kelompok-ignite ignite-app:v1`    | Jalankan + mapping port     | `docker run -p 8000:8000 --name cc-kelompok-ignite ignite-app:v1`    |
| `docker run -d -p 8000:8000 --name cc-kelompok-ignite ignite-app:v1` | Background mode             | `docker run -d -p 8000:8000 --name cc-kelompok-ignite ignite-app:v1` |
| `docker run --env-file .env --name cc-kelompok-ignite ignite-app:v1` | Gunakan env file            | `docker run --env-file .env --name cc-kelompok-ignite ignite-app:v1` |

---

# 🔍 2. Monitoring & Debugging

| Command                             | Fungsi                | Contoh                              |
| ----------------------------------- | --------------------- | ----------------------------------- |
| `docker ps`                         | Lihat container aktif | `docker ps`                         |
| `docker ps -a`                      | Semua container       | `docker ps -a`                      |
| `docker logs cc-kelompok-ignite`    | Lihat log container   | `docker logs cc-kelompok-ignite`    |
| `docker logs -f cc-kelompok-ignite` | Log real-time         | `docker logs -f cc-kelompok-ignite` |
| `docker stats`                      | Monitor CPU/RAM       | `docker stats`                      |
| `docker inspect cc-kelompok-ignite` | Detail container      | `docker inspect cc-kelompok-ignite` |

---

# ⚙️ 3. Container Management

| Command                             | Fungsi          | Contoh                              |
| ----------------------------------- | --------------- | ----------------------------------- |
| `docker start cc-kelompok-ignite`   | Start container | `docker start cc-kelompok-ignite`   |
| `docker stop cc-kelompok-ignite`    | Stop container  | `docker stop cc-kelompok-ignite`    |
| `docker restart cc-kelompok-ignite` | Restart         | `docker restart cc-kelompok-ignite` |
| `docker rm cc-kelompok-ignite`      | Hapus container | `docker rm cc-kelompok-ignite`      |
| `docker rm -f cc-kelompok-ignite`   | Hapus paksa     | `docker rm -f cc-kelompok-ignite`   |

---

# 🖥️ 4. Akses Container

| Command                                       | Fungsi              | Contoh                                        |
| --------------------------------------------- | ------------------- | --------------------------------------------- |
| `docker exec -it cc-kelompok-ignite bash`     | Masuk ke container  | `docker exec -it cc-kelompok-ignite bash`     |
| `docker exec -it cc-kelompok-ignite sh`       | Alternatif shell    | `docker exec -it cc-kelompok-ignite sh`       |
| `docker cp file.txt cc-kelompok-ignite:/app`  | Copy ke container   | `docker cp test.txt cc-kelompok-ignite:/app`  |
| `docker cp cc-kelompok-ignite:/app/log.txt .` | Copy dari container | `docker cp cc-kelompok-ignite:/app/log.txt .` |

---

# 📦 5. Image & Registry

| Command                                        | Fungsi               | Contoh                                         |
| ---------------------------------------------- | -------------------- | ---------------------------------------------- |
| `docker images`                                | Lihat image          | `docker images`                                |
| `docker rmi ignite-app:v1`                     | Hapus image          | `docker rmi ignite-app:v1`                     |
| `docker tag ignite-app:v1 putri/ignite-app:v1` | Tag image            | `docker tag ignite-app:v1 putri/ignite-app:v1` |
| `docker push putri/ignite-app:v1`              | Push ke Docker Hub   | `docker push putri/ignite-app:v1`              |
| `docker pull putri/ignite-app:v1`              | Pull dari Docker Hub | `docker pull putri/ignite-app:v1`              |

---

# 💾 6. Volume (Data Persistence)

| Command                                             | Fungsi       | Contoh                                              |
| --------------------------------------------------- | ------------ | --------------------------------------------------- |
| `docker volume create ignite-data`                  | Buat volume  | `docker volume create ignite-data`                  |
| `docker volume ls`                                  | List volume  | `docker volume ls`                                  |
| `docker run -v ignite-data:/app/data ignite-app:v1` | Pakai volume | `docker run -v ignite-data:/app/data ignite-app:v1` |

---

# 🌐 7. Docker Compose 

| Command                  | Fungsi                 | Contoh                   |
| ------------------------ | ---------------------- | ------------------------ |
| `docker compose up -d`   | Jalankan semua service | `docker compose up -d`   |
| `docker compose down`    | Stop semua             | `docker compose down`    |
| `docker compose build`   | Build ulang            | `docker compose build`   |
| `docker compose logs -f` | Log semua service      | `docker compose logs -f` |
| `docker compose ps`      | List container         | `docker compose ps`      |

---

# 🧹 8. Cleanup

| Command                  | Fungsi                     |
| ------------------------ | -------------------------- |
| `docker system prune`    | Bersihkan cache            |
| `docker system prune -a` | Hapus semua termasuk image |
| `docker volume prune`    | Hapus volume               |
| `docker network prune`   | Hapus network              |

---

# 💡 Tips Khusus Proyek

| Situasi                  | Penjelasan                                                                     | Perintah                                                         |
| ------------------------ | ------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| Penamaan container       | Gunakan nama container yang konsisten agar mudah saat monitoring dan debugging | `cc-kelompok-ignite`                                             |
| Mengecek error backend   | Lihat log container untuk mengetahui penyebab error                            | `docker logs -f cc-kelompok-ignite`                              |
| Container tidak berjalan | Cek semua container, termasuk yang sudah berhenti                              | `docker ps -a`                                                   |
| Development              | Gunakan volume agar perubahan kode langsung ter-update tanpa build ulang       | `docker run -v $(pwd):/app cc-kelompok-ignite`                   |
| Production               | Jalankan container di background dengan auto-restart agar lebih stabil         | `docker run -d --restart always -p 8000:8000 cc-kelompok-ignite` |

---