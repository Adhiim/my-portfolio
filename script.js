/**
 * =========================================================================
 * FILE: assets/js/script.js
 * FUNGSI: Mengatur SEMUA interaktivitas & animasi di index.html:
 *         - Inisialisasi AOS (Animate On Scroll)
 *         - Navbar scroll effect & scroll-spy
 *         - Menu hamburger mobile
 *         - Typing effect bergantian 3 role di Hero
 *         - Animasi counter angka statistik
 *         - Particle effect di background Hero
 *         - Tombol Back to Top
 *
 * "use strict" membuat JavaScript lebih ketat mendeteksi kesalahan umum,
 * sehingga bug lebih cepat ketahuan saat development.
 * =========================================================================
 */
'use strict';

// Semua kode dijalankan SETELAH seluruh HTML halaman selesai dimuat,
// supaya elemen yang ingin kita atur (tombol, section, dll) sudah ada.
document.addEventListener('DOMContentLoaded', function () {

  /* =======================================================================
     1. INISIALISASI AOS (Animate On Scroll)
     Library eksternal ini otomatis menganimasikan SEMUA elemen yang
     punya atribut "data-aos" di HTML (misal data-aos="fade-up"), saat
     elemen tersebut mulai terlihat ketika pengguna scroll halaman.
     ======================================================================= */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,     // lama animasi tiap elemen (ms)
      easing: 'ease-out-cubic',
      once: true,         // animasi cukup terjadi 1x saja per elemen, tidak
                           // berulang setiap kali discroll naik-turun
      offset: 80,          // animasi mulai terpicu 80px sebelum elemen
                           // benar-benar masuk penuh ke layar
    });
  }


  /* =======================================================================
     2. NAVBAR — efek blur saat discroll + scroll-spy (highlight menu aktif)
     ======================================================================= */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.navbar__link');
  const sections = document.querySelectorAll('section[id]');

  function handleScroll() {
    // --- Efek blur navbar saat discroll lebih dari 50px ---
    if (window.scrollY > 50) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }

    // --- Scroll-spy: highlight menu sesuai section yang sedang terlihat ---
    let currentSectionId = '';
    sections.forEach(function (section) {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop <= 140) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('navbar__link--active');
      if (link.getAttribute('href') === '#' + currentSectionId) {
        link.classList.add('navbar__link--active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // jalankan sekali di awal supaya status awal sudah benar


  /* =======================================================================
     3. HAMBURGER MENU (Mobile)
     ======================================================================= */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navbarMenu = document.getElementById('navbarMenu');

  hamburgerBtn.addEventListener('click', function () {
    const isOpen = navbarMenu.classList.toggle('navbar__menu--mobile-open');
    hamburgerBtn.classList.toggle('navbar__hamburger--open');
    hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Otomatis menutup menu mobile setelah salah satu link diklik
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navbarMenu.classList.remove('navbar__menu--mobile-open');
      hamburgerBtn.classList.remove('navbar__hamburger--open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    });
  });


  /* =======================================================================
     4. TYPING EFFECT — 3 role bergantian di Hero
     Teks akan diketik huruf demi huruf, berhenti sejenak, lalu dihapus
     huruf demi huruf, lalu lanjut mengetik role berikutnya — berulang
     terus dalam sebuah perulangan (loop).
     ======================================================================= */
  const roleList = [
    'Warehouse Operations Specialist',
    'Information Systems Graduate',
    'Inventory Control Professional'
  ];

  const typedRoleEl = document.getElementById('typedRole');

  if (typedRoleEl) {
    let roleIndex = 0;       // role yang mana sedang ditampilkan (0,1,2,...)
    let charIndex = 0;       // posisi huruf yang sedang diketik/dihapus
    let sedangMenghapus = false;

    function jalankanTypingEffect() {
      const roleSaatIni = roleList[roleIndex];

      if (!sedangMenghapus) {
        // --- Mode MENGETIK: tambah 1 huruf setiap kali dipanggil ---
        charIndex++;
        typedRoleEl.textContent = roleSaatIni.substring(0, charIndex);

        if (charIndex === roleSaatIni.length) {
          // Teks sudah selesai diketik penuh: berhenti sejenak (jeda baca),
          // baru mulai proses menghapus
          sedangMenghapus = true;
          setTimeout(jalankanTypingEffect, 1800); // jeda 1.8 detik sebelum mulai menghapus
          return;
        }
      } else {
        // --- Mode MENGHAPUS: kurangi 1 huruf setiap kali dipanggil ---
        charIndex--;
        typedRoleEl.textContent = roleSaatIni.substring(0, charIndex);

        if (charIndex === 0) {
          // Teks sudah terhapus habis: pindah ke role berikutnya (looping
          // kembali ke index 0 setelah index terakhir, memakai modulo %)
          sedangMenghapus = false;
          roleIndex = (roleIndex + 1) % roleList.length;
        }
      }

      // Kecepatan mengetik (100ms/huruf) dibuat lebih cepat dibanding
      // menghapus (50ms/huruf), supaya terasa natural seperti orang mengetik
      const kecepatan = sedangMenghapus ? 50 : 100;
      setTimeout(jalankanTypingEffect, kecepatan);
    }

    jalankanTypingEffect();
  }


  /* =======================================================================
     5. ANIMASI COUNTER ANGKA STATISTIK
     Angka "0" di HTML dianimasikan naik perlahan menuju angka asli
     (data-count) saat Hero pertama kali terlihat di layar.
     ======================================================================= */
  const statNumbers = document.querySelectorAll('.hero__stat-number[data-count]');

  function animasiCounter(elemen) {
    const target = parseInt(elemen.getAttribute('data-count'), 10) || 0;
    const durasi = 1500; // 1.5 detik
    const waktuMulai = performance.now();

    function update(waktuSekarang) {
      const elapsed = waktuSekarang - waktuMulai;
      const progress = Math.min(elapsed / durasi, 1);
      // easeOutExpo: gerakan cepat di awal, melambat di akhir (terasa halus)
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      elemen.textContent = Math.round(eased * target);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  let counterSudahJalan = false;
  const heroSection = document.getElementById('home');
  if (heroSection && statNumbers.length > 0) {
    const observerHero = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !counterSudahJalan) {
          statNumbers.forEach(animasiCounter);
          counterSudahJalan = true;
        }
      });
    }, { threshold: 0.3 });
    observerHero.observe(heroSection);
  }


  /* =======================================================================
     6. ANIMASI BACKGROUND HERO — particle network yang bergerak penuh
     Foto profil tidak dianimasikan berputar; gerak visual dipindahkan ke
     background melalui canvas agar hero terasa hidup tetapi tetap rapi.
     ======================================================================= */
  const canvas = document.getElementById('particleCanvas');

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let canvasWidth = 0;
    let canvasHeight = 0;

    function resizeCanvas() {
      const heroEl = document.getElementById('home');
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvasWidth = heroEl.offsetWidth;
      canvasHeight = heroEl.offsetHeight;

      canvas.width = Math.floor(canvasWidth * pixelRatio);
      canvas.height = Math.floor(canvasHeight * pixelRatio);
      canvas.style.width = canvasWidth + 'px';
      canvas.style.height = canvasHeight + 'px';

      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }

    function buatPartikel() {
      const warnaPartikel = [
        { r: 249, g: 115, b: 22 },
        { r: 56, g: 189, b: 248 },
        { r: 20, g: 184, b: 166 }
      ];
      const kepadatan = Math.round((canvasWidth * canvasHeight) / 18000);
      const jumlahPartikel = window.innerWidth < 640
        ? Math.min(Math.max(kepadatan, 28), 40)
        : Math.min(Math.max(kepadatan, 54), 84);

      particles = [];

      for (let i = 0; i < jumlahPartikel; i++) {
        const warna = warnaPartikel[i % warnaPartikel.length];

        particles.push({
          x: Math.random() * canvasWidth,
          y: Math.random() * canvasHeight,
          radius: Math.random() * 1.8 + 0.8,
          speedX: (Math.random() - 0.5) * 0.42,
          speedY: (Math.random() - 0.5) * 0.36,
          opacity: Math.random() * 0.34 + 0.2,
          color: warna
        });
      }
    }

    function gambarKoneksi() {
      const jarakMaksimal = window.innerWidth < 640 ? 92 : 132;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const jarak = Math.sqrt(dx * dx + dy * dy);

          if (jarak < jarakMaksimal) {
            const opacity = (1 - jarak / jarakMaksimal) * 0.2;
            const warna = particles[i].color;

            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(' + warna.r + ',' + warna.g + ',' + warna.b + ',' + opacity + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    }

    function gambarFrame() {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.globalCompositeOperation = 'lighter';

      gambarKoneksi();

      particles.forEach(function (p) {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvasWidth;
        if (p.x > canvasWidth) p.x = 0;
        if (p.y < 0) p.y = canvasHeight;
        if (p.y > canvasHeight) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.color.r + ',' + p.color.g + ',' + p.color.b + ',' + p.opacity + ')';
        ctx.fill();
      });

      ctx.globalCompositeOperation = 'source-over';
      requestAnimationFrame(gambarFrame);
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      resizeCanvas();
      buatPartikel();
      requestAnimationFrame(gambarFrame);

      window.addEventListener('resize', function () {
        resizeCanvas();
        buatPartikel();
      });
    }
  }


  /* =======================================================================
     7. TOMBOL BACK TO TOP
     ======================================================================= */
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', function () {
    if (window.scrollY > window.innerHeight) {
      backToTopBtn.classList.add('back-to-top--visible');
    } else {
      backToTopBtn.classList.remove('back-to-top--visible');
    }
  });

  backToTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* =======================================================================
     8. FALLBACK GAMBAR
     Jika sebuah gambar gagal dimuat (misal file belum diupload/rusak),
     sembunyikan elemen <img> tersebut agar tidak menampilkan ikon
     "gambar rusak" bawaan browser yang terlihat berantakan.
     ======================================================================= */
  document.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('error', function () {
      img.style.opacity = '0';
    });
  });

});
