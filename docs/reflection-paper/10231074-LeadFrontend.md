# Reflection Paper – Lead Frontend

**Nama:** Putri Rahmawati;
**NIM:** 10231074;
**Peran:** Lead Frontend;
**Proyek:** ATHSNACK;
**Mata Kuliah:** Cloud Computing

---

## Pendahuluan

Proyek pengembangan aplikasi berbasis cloud dan microservices memberikan pengalaman yang berbeda dibandingkan pengembangan aplikasi yang sebelumnya pernah saya pelajari. Sebagai Lead Frontend, saya tidak hanya berhadapan dengan tampilan antarmuka pengguna, tetapi juga harus memahami bagaimana frontend berinteraksi dengan berbagai layanan backend yang berjalan pada lingkungan cloud. Pada awal proyek, saya menganggap frontend hanya berfokus pada desain halaman dan pengolahan data dari API. Namun, selama proses pengembangan saya mulai memahami bahwa frontend merupakan bagian yang sangat bergantung pada stabilitas arsitektur sistem secara keseluruhan.

Melalui rangkaian modul cloud computing yang dipelajari, mulai dari pengenalan cloud, integrasi API, Docker, Git workflow, CI/CD, hingga implementasi microservices, saya memperoleh pemahaman baru mengenai hubungan antara pengembangan frontend dan infrastruktur sistem. Banyak keputusan yang awalnya terlihat sederhana ternyata memiliki dampak yang cukup besar terhadap kemudahan deployment, proses debugging, dan pengalaman pengguna. Pengalaman tersebut membuat saya mulai melihat pengembangan frontend sebagai bagian dari ekosistem perangkat lunak yang lebih luas, bukan sekadar lapisan presentasi.

---

## Refleksi atas Keputusan Teknis

Salah satu keputusan penting yang saya hadapi adalah penggunaan React sebagai framework frontend. Pada awalnya saya melihat React sebagai pilihan yang umum digunakan dan memiliki komunitas yang besar. Namun setelah proyek berkembang, saya mulai memahami bahwa keunggulan utama React bukan hanya popularitasnya, melainkan kemampuannya dalam membangun antarmuka yang modular dan mudah dipelihara. Struktur komponen yang terpisah membantu proses pengembangan ketika jumlah halaman dan fitur semakin bertambah. Di sisi lain, penggunaan React juga menuntut pengelolaan state dan struktur kode yang lebih disiplin agar tidak menimbulkan kompleksitas yang sulit dikendalikan.

Keputusan teknis berikutnya berkaitan dengan integrasi frontend dan backend menggunakan REST API. Awalnya saya menganggap proses pengambilan data dari API hanya sebatas mengirim request dan menampilkan hasilnya. Namun selama implementasi, saya menemukan bahwa integrasi tersebut melibatkan banyak aspek seperti penanganan error, validasi data, pengelolaan token autentikasi, serta sinkronisasi antara kebutuhan frontend dan layanan backend. Pengalaman menghadapi masalah CORS dan JWT Authentication membuat saya menyadari bahwa frontend tidak dapat dipisahkan dari pemahaman mengenai mekanisme komunikasi sistem secara keseluruhan. Jika aspek-aspek tersebut diabaikan, aplikasi dapat berjalan secara lokal tetapi gagal ketika dipindahkan ke lingkungan deployment.

Keputusan lain yang cukup berpengaruh adalah penggunaan Docker dalam proses pengembangan dan deployment. Pada awal pembelajaran, Docker terlihat seperti teknologi tambahan yang hanya digunakan untuk menjalankan aplikasi di container. Akan tetapi setelah mengalami perbedaan konfigurasi lingkungan antar anggota tim, saya mulai memahami manfaat utama Docker sebagai alat untuk menjaga konsistensi lingkungan pengembangan. Penggunaan Dockerfile, Docker Compose, serta konfigurasi network membantu mengurangi permasalahan yang sebelumnya sering muncul ketika aplikasi berjalan dengan baik di satu perangkat tetapi gagal di perangkat lain. Walaupun membutuhkan waktu lebih untuk mempelajari konsep container, manfaatnya terasa signifikan ketika proses deployment mulai dilakukan secara otomatis.

Ketika proyek mulai mengarah pada pendekatan microservices, saya juga memperoleh perspektif baru mengenai pemisahan layanan. Pada awalnya saya melihat arsitektur monolitik sebagai pendekatan yang lebih sederhana karena seluruh fitur berada dalam satu sistem. Namun setelah mempelajari konsep microservices, saya memahami bahwa pemisahan layanan dapat meningkatkan fleksibilitas pengembangan dan deployment. Di sisi frontend, perubahan ini menuntut perhatian lebih terhadap pengelolaan endpoint dan komunikasi antar layanan. Refleksi saya adalah bahwa microservices memang memberikan banyak keuntungan, tetapi kompleksitasnya juga meningkat sehingga penggunaannya perlu disesuaikan dengan kebutuhan proyek dan kesiapan tim.

---

## Tantangan dan Proses Penyelesaian

Tantangan terbesar yang saya hadapi selama proyek bukanlah pembuatan tampilan antarmuka, melainkan proses integrasi dengan layanan backend yang terus berkembang. Perubahan struktur API, perbedaan format data, serta munculnya error yang tidak selalu berasal dari frontend sering kali membuat proses debugging menjadi lebih sulit. Pada beberapa situasi, tampilan aplikasi terlihat mengalami masalah padahal penyebab utamanya berasal dari layanan backend yang tidak berjalan dengan semestinya. Pengalaman tersebut mengajarkan saya pentingnya memahami alur data secara menyeluruh sebelum mengambil kesimpulan mengenai sumber permasalahan.

Kesulitan lain muncul ketika mulai menerapkan Docker dan deployment berbasis cloud. Banyak error yang awalnya sulit dipahami karena perbedaan antara lingkungan lokal dan lingkungan container. Saya beberapa kali menghadapi kondisi ketika aplikasi dapat berjalan normal pada komputer pengembangan tetapi mengalami kegagalan saat proses build atau deployment. Dari pengalaman tersebut saya belajar bahwa pengujian tidak boleh hanya dilakukan pada lingkungan lokal. Validasi pada container dan pipeline deployment menjadi bagian penting untuk memastikan aplikasi benar-benar siap digunakan.

Dalam aspek kolaborasi tim, penggunaan Git workflow juga memberikan tantangan tersendiri. Konflik merge, perbedaan perubahan kode, dan koordinasi antar anggota tim menjadi pengalaman yang cukup berharga. Sebelum mengikuti proyek ini, saya cenderung melihat Git sebagai alat penyimpanan kode. Namun selama proyek berlangsung, saya memahami bahwa Git sebenarnya merupakan mekanisme kolaborasi yang sangat penting dalam pengembangan perangkat lunak modern. Penggunaan branch yang terstruktur membantu meminimalkan risiko perubahan yang saling bertabrakan dan meningkatkan kualitas integrasi kode.

Tantangan berikutnya berkaitan dengan implementasi CI/CD menggunakan GitHub Actions. Pada awalnya saya menganggap proses build dan deployment otomatis hanya bertujuan menghemat waktu. Akan tetapi ketika beberapa kali menemukan error yang terdeteksi langsung oleh pipeline CI, saya mulai memahami perannya sebagai mekanisme quality control. Tanpa proses tersebut, kemungkinan besar banyak masalah baru akan ditemukan setelah aplikasi dipublikasikan. Pengalaman ini mengubah pandangan saya bahwa otomatisasi bukan sekadar kenyamanan, tetapi bagian penting dari praktik rekayasa perangkat lunak modern.

---

## Pelajaran yang Diperoleh

Pembelajaran terbesar yang saya peroleh adalah perubahan cara pandang terhadap frontend sebagai bagian dari sistem yang terintegrasi. Sebelum mengikuti proyek ini, fokus saya lebih banyak pada tampilan dan interaksi pengguna. Namun setelah berhadapan dengan API, container, deployment cloud, dan microservices, saya menyadari bahwa kualitas frontend juga dipengaruhi oleh pemahaman terhadap infrastruktur dan arsitektur sistem. Seorang pengembang frontend tidak harus menjadi ahli backend atau DevOps, tetapi perlu memahami konsep-konsep tersebut agar dapat bekerja secara efektif dalam lingkungan pengembangan modern.

Saya juga memperoleh pemahaman yang lebih baik mengenai pentingnya observability, monitoring, dan logging. Ketika aplikasi mulai berjalan pada lingkungan cloud, proses identifikasi masalah menjadi jauh lebih sulit dibandingkan saat pengembangan lokal. Log aplikasi dan informasi monitoring membantu mempercepat proses investigasi ketika terjadi kegagalan layanan. Pengalaman ini membuat saya memahami bahwa keberhasilan sebuah aplikasi tidak hanya ditentukan oleh fitur yang tersedia, tetapi juga oleh kemampuan tim dalam memantau dan memelihara sistem setelah aplikasi digunakan.

Selain aspek teknis, proyek ini juga mengajarkan pentingnya proses pembelajaran yang berkelanjutan. Banyak konsep yang awalnya terasa rumit seperti Docker networking, GitHub Actions, atau microservices, menjadi lebih mudah dipahami setelah mengalami langsung berbagai kesalahan dan proses perbaikannya. Kesalahan-kesalahan tersebut justru memberikan pemahaman yang lebih mendalam dibandingkan sekadar mempelajari teori. Saya menyadari bahwa kemampuan seorang pengembang tidak hanya dibangun melalui keberhasilan implementasi, tetapi juga melalui pengalaman menghadapi dan menyelesaikan masalah.

Ke depannya, pengalaman ini akan memengaruhi cara saya mengembangkan sistem. Saya akan lebih mempertimbangkan aspek deployment, maintainability, dan integrasi sejak tahap awal perancangan aplikasi. Saya juga menjadi lebih memahami pentingnya kolaborasi lintas peran antara frontend, backend, dan DevOps dalam membangun sistem berbasis cloud. Pendekatan tersebut menurut saya semakin relevan dengan praktik industri modern yang menekankan otomatisasi, skalabilitas, dan kolaborasi berkelanjutan.

---

## Kesimpulan

Sebagai Lead Frontend, proyek ini memberikan pengalaman yang jauh lebih luas dibandingkan sekadar pengembangan antarmuka pengguna. Melalui berbagai modul cloud computing, saya belajar bahwa frontend merupakan bagian dari sistem yang saling terhubung dengan backend, infrastruktur cloud, pipeline CI/CD, dan arsitektur microservices. Berbagai tantangan yang muncul selama proses pengembangan memberikan pemahaman yang lebih mendalam mengenai pentingnya pengambilan keputusan teknis yang tepat, komunikasi tim yang efektif, serta kemampuan beradaptasi terhadap perubahan.

Refleksi utama yang saya peroleh adalah bahwa pengembangan perangkat lunak modern tidak hanya menuntut kemampuan menulis kode, tetapi juga kemampuan memahami bagaimana seluruh komponen sistem bekerja bersama. Meskipun masih banyak hal yang perlu dipelajari, pengalaman ini telah membantu saya membangun fondasi pemahaman yang lebih kuat mengenai pengembangan aplikasi berbasis cloud dan praktik rekayasa perangkat lunak modern. Pengalaman tersebut akan menjadi bekal penting dalam menghadapi proyek-proyek berikutnya yang semakin kompleks dan terintegrasi.