# Reflection Paper – Lead Backend

**Nama:** Andini Permata Dewanti;
**NIM:** 10231014;
**Peran:** Lead Backend;
**Proyek:** ATHSNACK;
**Mata Kuliah:** Cloud Computing

---

## Pendahuluan

Menjadi Lead Backend pada proyek ATHSNACK merupakan pengalaman baru bagi saya. Pada awalnya, saya menganggap bahwa tanggung jawab utama seorang Lead Backend hanya berfokus pada pembuatan dan pengelolaan endpoint agar dapat berjalan sesuai kebutuhan sistem. Namun, selama proses pengembangan berlangsung, saya mulai memahami bahwa peran tersebut memiliki cakupan yang jauh lebih luas. Saya tidak hanya bertanggung jawab terhadap implementasi fitur backend, tetapi juga harus mempertimbangkan berbagai keputusan teknis yang dapat memengaruhi keseluruhan sistem, mulai dari struktur aplikasi, integrasi antar layanan, hingga proses deployment ke lingkungan cloud.

Seiring berkembangnya proyek, arsitektur sistem yang digunakan juga mengalami perubahan dari pendekatan yang relatif sederhana menjadi arsitektur berbasis microservices. Perubahan ini memberikan tantangan baru karena setiap layanan memiliki fungsi, basis data, dan proses pengelolaannya masing-masing. Dalam kondisi tersebut, saya dituntut untuk memastikan bahwa setiap layanan dapat saling terhubung dan berkomunikasi dengan baik tanpa mengurangi stabilitas sistem secara keseluruhan.

Melalui reflection paper ini, saya ingin merefleksikan berbagai pengalaman yang saya peroleh selama menjalankan peran sebagai Lead Backend. Fokus refleksi ini tidak hanya pada apa yang telah saya kerjakan, tetapi lebih kepada bagaimana saya mengambil keputusan teknis, menghadapi berbagai kendala selama pengembangan, serta pelajaran yang saya peroleh dari setiap proses tersebut. Pengalaman ini memberikan pemahaman yang lebih mendalam mengenai pentingnya perencanaan arsitektur, kolaborasi tim, serta penerapan praktik pengembangan perangkat lunak yang baik dalam membangun sistem yang dapat berjalan secara andal dan berkelanjutan.

---

## Refleksi atas Keputusan Teknis

### 1. Pemilihan FastAPI sebagai Framework Backend

Salah satu keputusan teknis pertama yang saya ambil adalah menggunakan FastAPI sebagai framework backend utama. Saya memilih FastAPI karena memiliki performa yang baik, dokumentasi yang lengkap, serta fitur dokumentasi API otomatis yang memudahkan proses integrasi dengan frontend. Keputusan ini memberikan dampak positif selama pengembangan berlangsung. Dokumentasi API yang tersedia secara otomatis membuat komunikasi antara tim backend dan frontend menjadi lebih efisien karena spesifikasi endpoint dapat diakses secara langsung. Selain itu, struktur FastAPI yang cukup jelas membantu proses pengembangan layanan yang semakin berkembang seiring bertambahnya fitur dan kompleksitas sistem.

Meskipun demikian, saya juga menyadari bahwa pemilihan teknologi tidak hanya mempertimbangkan kemudahan implementasi, tetapi juga kesiapan sistem dalam menghadapi kebutuhan yang lebih besar. Ketika mulai mempelajari lebih dalam mengenai performa aplikasi dan pengelolaan koneksi database, saya memahami bahwa masih terdapat beberapa aspek yang dapat dioptimalkan. Dari pengalaman ini saya belajar bahwa keputusan teknologi yang baik bukan hanya yang paling mudah digunakan saat ini, tetapi juga yang mampu mendukung kebutuhan sistem dalam jangka panjang.

### 2. Perancangan Arsitektur dan Pemisahan Layanan

Seiring berjalannya proyek, sistem yang awalnya dikembangkan dengan pendekatan yang lebih sederhana mulai diarahkan menuju arsitektur microservices. Sebagai Lead Backend, saya mendukung pemisahan layanan berdasarkan tanggung jawab masing-masing, seperti layanan autentikasi dan layanan pengelolaan data utama. Keputusan ini diambil karena saya ingin setiap layanan dapat dikembangkan, diuji, dan dipelihara secara lebih mandiri tanpa terlalu bergantung pada komponen lainnya.

Pada praktiknya, pendekatan tersebut memang memberikan fleksibilitas yang lebih tinggi. Setiap layanan memiliki database dan proses deployment yang terpisah sehingga risiko gangguan dapat diminimalkan. Namun, saya juga menyadari bahwa pemisahan layanan menghadirkan tantangan baru, terutama dalam komunikasi antar layanan. Data yang sebelumnya dapat diakses secara langsung harus diperoleh melalui mekanisme komunikasi antar service sehingga ketergantungan terhadap jaringan dan stabilitas layanan menjadi lebih penting untuk diperhatikan.

Pengalaman ini mengubah cara pandang saya terhadap arsitektur perangkat lunak. Saya memahami bahwa microservices bukan sekadar memecah aplikasi menjadi beberapa layanan, tetapi juga memerlukan perencanaan yang matang terkait integrasi, keamanan, serta pengelolaan dependensi antar layanan. Keputusan ini memang meningkatkan kompleksitas sistem, tetapi memberikan fondasi yang lebih baik untuk pengembangan aplikasi yang lebih besar di masa mendatang.

### 3. Integrasi Full-Stack dan Pengelolaan Akses Layanan

Ketika proses integrasi backend dengan frontend dimulai, saya mengetahui bahwa tantangan utama bukan hanya pada pembuatan endpoint, melainkan bagaimana seluruh komponen dapat berkomunikasi dengan baik dalam lingkungan yang terdistribusi. Oleh karena itu, saya memutuskan untuk menerapkan mekanisme routing terpusat agar akses menuju berbagai layanan backend dapat dikelola melalui satu titik masuk yang sama.

Keputusan ini memberikan beberapa keuntungan. Dari sisi frontend, proses integrasi menjadi lebih sederhana karena tidak perlu berkomunikasi langsung dengan banyak layanan yang berbeda. Dari sisi backend, pengelolaan keamanan, konfigurasi, serta alur komunikasi menjadi lebih terstruktur. Pendekatan ini juga membantu mengurangi permasalahan integrasi yang sebelumnya muncul ketika beberapa layanan harus diakses secara bersamaan.

Melalui proses ini saya belajar bahwa integrasi full-stack tidak hanya berkaitan dengan memastikan data dapat dikirim dan diterima dengan benar. Lebih dari itu, integrasi yang baik memerlukan desain komunikasi yang jelas agar sistem tetap mudah dikelola ketika jumlah layanan dan fitur terus bertambah.

### 4. Containerization, Orkestrasi, dan Deployment

Penerapan Docker dan Docker Compose menjadi salah satu pengalaman yang paling berpengaruh selama proyek berlangsung. Sebelum mengikuti praktikum ini, saya lebih sering menjalankan aplikasi secara langsung pada lingkungan lokal. Namun ketika sistem mulai terdiri dari beberapa layanan yang saling terhubung, saya menyadari bahwa containerization memberikan solusi yang jauh lebih konsisten dan terstruktur.

Sebagai Lead Backend, saya harus memastikan bahwa setiap layanan dapat berjalan pada lingkungan yang sama, baik ketika dikembangkan oleh anggota tim maupun ketika dijalankan pada server deployment. Penggunaan Docker membantu mengurangi perbedaan konfigurasi antar lingkungan, sedangkan Docker Compose memudahkan proses orkestrasi berbagai layanan yang saling bergantung satu sama lain.

Pengalaman ini semakin diperkuat ketika memasuki modul Continuous Integration dan Continuous Deployment. Saya mulai memahami bahwa proses pengembangan modern tidak berhenti pada tahap implementasi kode, tetapi juga mencakup otomatisasi pengujian, build, dan deployment. Dari sini saya belajar bahwa kualitas backend tidak hanya ditentukan oleh kode yang ditulis, melainkan juga oleh kemampuan sistem untuk dibangun, diuji, dan dijalankan secara konsisten di berbagai lingkungan.

---

## Tantangan dan Proses Penyelesaian

### 1. Menjaga Stabilitas Komunikasi Antar Layanan

Salah satu tantangan terbesar yang saya hadapi ketika mulai menerapkan arsitektur microservices adalah memastikan setiap layanan dapat berkomunikasi dengan baik tanpa menimbulkan gangguan pada layanan lainnya. Pada sistem yang terdiri dari beberapa service, kegagalan pada satu layanan berpotensi memengaruhi layanan lain yang bergantung padanya. Kondisi ini membuat saya mulai menyadari bahwa membangun backend bukan hanya tentang menyediakan endpoint yang berjalan dengan baik, tetapi juga memastikan sistem tetap stabil ketika terjadi gangguan.

Dari permasalahan tersebut, saya mempelajari pentingnya konsep reliability dalam sistem terdistribusi. Saya mulai memahami bahwa setiap layanan harus memiliki mekanisme untuk menangani kegagalan komunikasi secara terkontrol agar tidak menimbulkan efek berantai pada komponen lainnya. Pengalaman ini mengubah cara pandang saya terhadap pengembangan backend. Sebelumnya saya lebih fokus pada bagaimana fitur dapat berjalan dengan benar, sedangkan sekarang saya juga mempertimbangkan bagaimana sistem tetap dapat beroperasi ketika sebagian komponennya mengalami masalah.

Melalui modul Microservices dan Reliability, saya memahami bahwa ketahanan sistem merupakan bagian penting dari desain arsitektur. Tantangan ini mengajarkan saya bahwa kualitas sebuah layanan tidak hanya diukur dari fungsinya ketika kondisi normal, tetapi juga dari kemampuannya menghadapi kondisi yang tidak ideal.

### 2. Integrasi Antar Komponen dalam Lingkungan Full-Stack

Tantangan berikutnya muncul ketika proses integrasi antara frontend dan backend mulai dilakukan. Pada tahap ini saya menyadari bahwa permasalahan tidak selalu berasal dari logika aplikasi atau database. Beberapa kendala justru muncul karena perbedaan cara setiap komponen berkomunikasi dalam lingkungan yang terdiri dari banyak layanan dan container.

Proses penyelesaiannya membutuhkan koordinasi yang cukup intens dengan anggota tim lain, khususnya yang bertanggung jawab pada frontend. Saya harus memahami bagaimana request dikirim dari sisi client, bagaimana layanan backend menerima request tersebut, serta bagaimana konfigurasi pada lingkungan deployment memengaruhi proses komunikasi tersebut. Dari pengalaman ini saya belajar bahwa keberhasilan integrasi tidak hanya ditentukan oleh kualitas kode yang dibuat masing-masing anggota tim, tetapi juga oleh kesesuaian konfigurasi dan pemahaman bersama mengenai alur komunikasi sistem.

Tantangan ini memberikan pemahaman yang lebih baik mengenai pentingnya kolaborasi dalam pengembangan full-stack. Sebagai Lead Backend, saya tidak bisa hanya berfokus pada layanan backend yang saya kelola, tetapi juga perlu memahami bagaimana layanan tersebut digunakan oleh komponen lain dalam sistem secara keseluruhan.

### 3. Pengelolaan Database yang Terus Berkembang

Selama proses pengembangan, kebutuhan sistem beberapa kali mengalami perubahan sehingga struktur database juga harus disesuaikan. Awalnya saya menganggap perubahan skema database merupakan hal yang sederhana dan dapat dilakukan secara langsung selama tahap pengembangan. Namun seiring bertambahnya fitur dan data yang digunakan, saya mulai menyadari bahwa perubahan tersebut memerlukan pengelolaan yang lebih terstruktur.

Pengalaman ini membuat saya memahami pentingnya strategi migrasi database dalam pengembangan perangkat lunak modern. Tanpa mekanisme migrasi yang jelas, setiap perubahan berpotensi menimbulkan risiko terhadap konsistensi data dan proses deployment. Meskipun pada proyek ini perubahan masih dapat ditangani karena skala sistem yang relatif kecil, saya menyadari bahwa pendekatan tersebut tidak akan efektif jika diterapkan pada sistem yang lebih besar atau digunakan oleh banyak pengguna.

Dari tantangan ini saya memperoleh pelajaran bahwa perancangan backend tidak hanya berkaitan dengan pembuatan API dan pengelolaan database saat ini, tetapi juga harus mempertimbangkan bagaimana sistem dapat dipelihara dan dikembangkan di masa mendatang. Pemahaman tersebut menjadi salah satu wawasan penting yang saya peroleh selama menjalankan peran sebagai Lead Backend.

### 4. Mengelola Workflow Pengembangan dan Deployment

Selain tantangan teknis pada aplikasi, saya juga menghadapi tantangan dalam menjaga konsistensi proses pengembangan ketika banyak perubahan dilakukan secara bersamaan. Penggunaan Git, branching strategy, serta penerapan Continuous Integration dan Continuous Deployment memberikan pengalaman baru mengenai bagaimana sebuah sistem dikembangkan secara kolaboratif.

Pada awalnya saya lebih berfokus pada penyelesaian fitur, namun seiring berjalannya proyek saya memahami bahwa kualitas perangkat lunak juga dipengaruhi oleh proses pengembangannya. Adanya automated testing, proses build yang terstandarisasi, dan deployment yang lebih terstruktur membantu mengurangi kesalahan yang sebelumnya sering terjadi ketika aplikasi dipindahkan ke lingkungan yang berbeda.

Pengalaman ini membuat saya memahami bahwa tanggung jawab Lead Backend tidak berhenti pada penulisan kode. Saya juga harus memastikan bahwa perubahan yang dilakukan dapat diintegrasikan, diuji, dan dijalankan secara konsisten melalui pipeline yang telah disiapkan. Pembelajaran ini menjadi salah satu pengalaman yang paling berharga karena memberikan gambaran yang lebih dekat dengan praktik pengembangan perangkat lunak di lingkungan industri.

## Pelajaran yang Diperoleh

### 1. Setiap Keputusan Teknis Memiliki Konsekuensi

Salah satu pelajaran yang paling saya rasakan selama menjalankan peran sebagai Lead Backend adalah bahwa setiap keputusan teknis selalu memiliki kelebihan dan kekurangan. Pada awalnya saya sering berpikir bahwa dalam pengembangan sistem pasti ada satu solusi yang paling tepat untuk digunakan. Namun setelah terlibat langsung dalam proses perancangan dan pengembangan sistem, saya menyadari bahwa keputusan yang diambil sangat bergantung pada kebutuhan, kondisi tim, dan tujuan yang ingin dicapai.

Ketika mulai menerapkan konsep microservices, misalnya, saya melihat bahwa pemisahan layanan memang memberikan fleksibilitas yang lebih baik dibandingkan pendekatan yang lebih sederhana. Akan tetapi, keputusan tersebut juga membawa tantangan baru dalam hal komunikasi antar layanan, pengelolaan database, serta proses deployment. Dari pengalaman tersebut saya belajar bahwa seorang Lead Backend tidak hanya perlu memahami teknologi yang digunakan, tetapi juga harus mampu mempertimbangkan dampak dari setiap keputusan yang diambil terhadap keseluruhan sistem.

Pemahaman ini mengubah cara saya dalam melihat proses pengembangan perangkat lunak. Saya tidak lagi berfokus mencari solusi yang dianggap paling baik secara umum, melainkan berusaha memilih solusi yang paling sesuai dengan kebutuhan dan kondisi proyek yang sedang dikerjakan.

### 2. Pentingnya Monitoring dan Observability dalam Pengelolaan Sistem

Sebelum mengikuti praktikum ini, saya menganggap bahwa pekerjaan backend selesai ketika aplikasi dapat berjalan dan seluruh fitur berfungsi sesuai kebutuhan. Namun setelah mempelajari monitoring, logging, dan observability, saya mulai memahami bahwa menjalankan sistem merupakan tantangan yang berbeda dengan membangun sistem.

Melalui proses pengembangan dan pengujian aplikasi, saya menyadari bahwa informasi mengenai performa layanan, aktivitas pengguna, maupun kondisi sistem sangat membantu ketika terjadi masalah. Dengan adanya monitoring dan logging, proses identifikasi kesalahan menjadi lebih terarah karena keputusan dapat diambil berdasarkan data yang tersedia, bukan sekadar dugaan.

Pengalaman ini memberikan pemahaman baru bahwa kualitas sebuah backend tidak hanya ditentukan oleh fitur yang berhasil dibuat. Kemampuan untuk memantau, menganalisis, dan memahami kondisi sistem setelah dijalankan juga merupakan bagian penting dari tanggung jawab seorang backend developer.

### 3. Pentingnya Otomatisasi dalam Proses Pengembangan

Pelajaran berikutnya saya peroleh dari penerapan Git Workflow, Continuous Integration, dan Continuous Deployment. Sebelum mempelajari materi tersebut, saya terbiasa melakukan sebagian besar proses pengujian dan deployment secara manual. Cara tersebut memang masih dapat dilakukan pada proyek kecil, tetapi menjadi kurang efisien ketika jumlah perubahan kode semakin banyak dan melibatkan beberapa anggota tim.

Melalui penerapan pipeline otomatis, saya mulai memahami bagaimana proses pengembangan perangkat lunak modern dilakukan. Setiap perubahan kode dapat diperiksa, diuji, dan dipastikan kualitasnya sebelum digabungkan ke dalam sistem utama. Hal ini membantu mengurangi kesalahan yang sebelumnya sering muncul akibat proses pengujian yang tidak konsisten.

Dari pengalaman tersebut saya belajar bahwa otomatisasi bukan hanya bertujuan mempercepat pekerjaan, tetapi juga membantu menjaga kualitas dan stabilitas aplikasi. Sebagai Lead Backend, saya menyadari bahwa membangun proses pengembangan yang baik sama pentingnya dengan membangun aplikasi itu sendiri.

### 4. Pentingnya Dokumentasi dan Kolaborasi Tim

Selama proyek berlangsung, saya juga belajar bahwa komunikasi yang baik memiliki peran yang sangat penting dalam keberhasilan pengembangan sistem. Sebagai Lead Backend, saya tidak bekerja sendiri, tetapi harus berkoordinasi dengan anggota tim lain, terutama yang bertanggung jawab pada frontend dan integrasi sistem.

Dokumentasi API yang tersedia secara otomatis melalui FastAPI menjadi salah satu hal yang sangat membantu proses kolaborasi. Dengan adanya dokumentasi yang jelas dan selalu diperbarui, anggota tim lain dapat memahami layanan backend tanpa harus terus-menerus meminta penjelasan secara langsung. Hal ini membuat proses integrasi berjalan lebih efisien dan mengurangi potensi kesalahan komunikasi.

Dari pengalaman tersebut saya memahami bahwa dokumentasi bukan hanya pelengkap proyek, melainkan bagian penting yang mendukung kolaborasi dan keberlanjutan pengembangan sistem. Semakin kompleks sebuah sistem, semakin besar pula kebutuhan akan dokumentasi yang jelas dan mudah dipahami.

## Kesimpulan

Menjalankan peran sebagai Lead Backend dalam proyek ATHSNACK memberikan banyak pengalaman dan pembelajaran yang tidak saya peroleh hanya dari mempelajari teori. Saya belajar bahwa pengembangan backend tidak hanya berkaitan dengan pembuatan API atau pengelolaan database, tetapi juga mencakup perancangan arsitektur, integrasi layanan, deployment, monitoring, serta pengelolaan proses pengembangan secara keseluruhan.

Melalui seluruh modul yang dipelajari, mulai dari cloud computing, pengembangan REST API, Docker, CI/CD, hingga microservices dan observability, saya memperoleh pemahaman yang lebih luas mengenai bagaimana sebuah sistem modern dibangun dan dikelola. Pengalaman ini juga mengubah cara pandang saya terhadap peran seorang backend developer yang tidak hanya bertanggung jawab terhadap kode, tetapi juga terhadap kualitas, stabilitas, dan keberlangsungan sistem yang dikembangkan.

Meskipun masih banyak hal yang perlu saya pelajari lebih lanjut, pengalaman selama proyek ini telah memberikan fondasi yang kuat mengenai praktik pengembangan backend modern. Pembelajaran yang saya peroleh tidak hanya berupa pemahaman teknis, tetapi juga kemampuan untuk berpikir lebih kritis dalam mengambil keputusan, mempertimbangkan berbagai konsekuensi dari setiap pilihan, serta memahami pentingnya kolaborasi dalam pengembangan perangkat lunak.
