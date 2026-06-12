# Reflection Paper – Lead QA & Documentation

**Nama:** Desnita Dwiputri
**NIM:** 10231030
**Peran:** Lead QA & Documentation
**Proyek:** ATHSNAC
**Mata Kuliah:** Cloud Computing

---

## Pendahuluan

Menjalankan peran sebagai Lead QA & Documentation dalam proyek ATHSNAC memberikan pengalaman yang berbeda dibandingkan peran pengembangan perangkat lunak yang lebih berfokus pada implementasi fitur. Pada awal proyek, saya memandang quality assurance sebagai aktivitas yang dilakukan setelah fitur selesai dikembangkan. Namun, seiring perkembangan sistem dari aplikasi monolith menjadi arsitektur microservices, saya menyadari bahwa kualitas bukanlah sesuatu yang diperiksa di akhir proses, melainkan harus dibangun dan dijaga sejak awal pengembangan.

Peran yang saya jalankan tidak hanya berkaitan dengan pengujian sistem, tetapi juga memastikan bahwa setiap proses, keputusan teknis, dan hasil implementasi terdokumentasi dengan baik. Dalam lingkungan pengembangan berbasis cloud yang melibatkan berbagai service, container, pipeline otomatis, serta deployment yang terus berkembang, dokumentasi menjadi komponen yang sama pentingnya dengan kode program itu sendiri. Pengalaman inilah yang menjadi dasar refleksi saya selama mengikuti seluruh rangkaian modul pada proyek ATHSNAC.

---

## Refleksi atas Peran dan Keputusan yang Diambil

Salah satu hal yang paling saya pelajari selama proyek berlangsung adalah pentingnya membangun budaya kualitas yang melibatkan seluruh anggota tim. Pada awal pengembangan, pengujian sering kali dilakukan setelah fitur dianggap selesai. Pendekatan tersebut terlihat sederhana, tetapi dalam praktiknya menimbulkan risiko ketika perubahan pada satu bagian sistem secara tidak sengaja memengaruhi bagian lain yang sebelumnya sudah berjalan dengan baik.

Ketika sistem mulai berkembang dan jumlah fitur bertambah, saya mulai memahami bahwa pengujian harus dirancang sebagai proses yang berkelanjutan. Oleh karena itu, saya berupaya menyusun skenario pengujian yang tidak hanya memeriksa apakah sebuah endpoint berhasil memberikan respons, tetapi juga memastikan bahwa integrasi antar komponen berjalan sesuai harapan. Pendekatan ini menjadi semakin penting ketika proyek memasuki tahap microservices, karena kegagalan pada satu service dapat berdampak pada service lain yang saling bergantung.

Selain aspek pengujian, saya juga mengambil keputusan untuk memperlakukan dokumentasi sebagai bagian dari proses pengembangan, bukan sebagai pekerjaan yang dilakukan menjelang pengumpulan tugas. Keputusan ini lahir dari pengalaman melihat bagaimana perubahan konfigurasi, endpoint, maupun deployment dapat menimbulkan kebingungan apabila tidak didokumentasikan dengan baik. Dengan adanya dokumentasi yang diperbarui secara berkala, proses koordinasi antar anggota tim menjadi lebih mudah dan pengetahuan mengenai sistem tidak hanya tersimpan pada individu tertentu.

---

## Tantangan yang Dihadapi

Tantangan terbesar yang saya hadapi adalah memastikan kualitas sistem ketika proyek mengalami perubahan yang cukup signifikan. Peralihan dari arsitektur monolith menuju microservices membawa banyak konsekuensi baru, baik dari sisi pengujian maupun dokumentasi. Jika sebelumnya pengujian dapat dilakukan pada satu aplikasi yang terpusat, pada arsitektur microservices saya harus memastikan bahwa komunikasi antar service berjalan dengan benar, token autentikasi dapat diverifikasi dengan baik, serta gateway mampu meneruskan request ke service yang sesuai.

Tantangan lain muncul ketika melakukan validasi pada lingkungan yang berbeda. Sistem yang berjalan dengan baik di lingkungan lokal belum tentu menunjukkan perilaku yang sama ketika dijalankan menggunakan Docker atau ketika diakses melalui gateway. Kondisi ini membuat saya memahami bahwa kualitas perangkat lunak tidak hanya dipengaruhi oleh kode program, tetapi juga oleh konfigurasi lingkungan tempat aplikasi dijalankan. Dari pengalaman tersebut, saya belajar untuk lebih memperhatikan proses deployment, health check, observability, dan troubleshooting sebagai bagian dari aktivitas quality assurance.

Di sisi dokumentasi, tantangan yang muncul adalah menjaga agar dokumen tetap relevan seiring perubahan sistem. Dokumentasi yang tidak diperbarui dapat menimbulkan kesalahan pemahaman dan justru menjadi sumber masalah baru. Oleh karena itu, saya berusaha memastikan bahwa setiap perubahan penting pada arsitektur, deployment, maupun pengujian selalu diikuti dengan pembaruan dokumen yang sesuai.

---

## Pembelajaran yang Diperoleh

Pengalaman selama proyek ATHSNACK mengubah cara pandang saya terhadap kualitas perangkat lunak. Saya menyadari bahwa kualitas bukanlah tanggung jawab satu orang atau satu peran tertentu, melainkan tanggung jawab seluruh tim. Peran QA bukan sekadar menemukan kesalahan, tetapi membantu membangun proses yang memungkinkan kualitas terjaga secara konsisten sepanjang siklus pengembangan.

Saya juga memperoleh pemahaman yang lebih mendalam mengenai pentingnya observability dalam sistem modern. Sebelum mempelajari konsep monitoring, logging, dan metrics, saya cenderung menganggap bahwa pengujian selesai ketika fitur berhasil dijalankan. Namun, implementasi observability menunjukkan bahwa kualitas juga perlu diamati ketika sistem sedang berjalan. Kemampuan untuk membaca log, melacak correlation ID, dan memantau metrics memberikan perspektif baru mengenai bagaimana sebuah sistem dapat dipelihara dan ditingkatkan setelah di-deploy.

Selain itu, saya belajar bahwa dokumentasi yang baik merupakan investasi jangka panjang. Dokumentasi tidak hanya membantu anggota tim saat ini, tetapi juga menjadi sumber pengetahuan yang memudahkan proses pemeliharaan dan pengembangan di masa depan. Dalam proyek berbasis cloud dan microservices yang kompleks, kemampuan untuk menjelaskan sistem secara tertulis sama pentingnya dengan kemampuan membangun sistem tersebut.

---

## Kesimpulan

Melalui peran sebagai Lead QA & Documentation, saya memperoleh pemahaman yang lebih komprehensif mengenai bagaimana kualitas perangkat lunak dibangun, diuji, dan dipertahankan dalam lingkungan pengembangan modern. Pengalaman ini mengajarkan bahwa quality assurance bukan hanya aktivitas pengujian, tetapi mencakup proses perencanaan, validasi, monitoring, dokumentasi, dan kolaborasi antar anggota tim.

Perjalanan proyek ATHSNACK, mulai dari aplikasi monolith hingga menjadi sistem berbasis microservices, memberikan banyak pembelajaran mengenai pentingnya pengujian yang terstruktur, dokumentasi yang konsisten, serta observability yang memadai. Pengalaman tersebut tidak hanya meningkatkan kemampuan teknis saya, tetapi juga membentuk cara berpikir yang lebih kritis terhadap kualitas, keberlanjutan, dan keandalan sebuah sistem perangkat lunak.

Sebagai hasil dari pengalaman ini, saya menjadi lebih memahami bahwa keberhasilan sebuah proyek tidak hanya ditentukan oleh fitur yang berhasil dibuat, tetapi juga oleh seberapa baik kualitas sistem dapat dijaga dan dipahami oleh seluruh tim dalam jangka panjang.
