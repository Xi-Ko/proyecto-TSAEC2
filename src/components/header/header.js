// Header Component JavaScript
(function () {
  // Variables para el scroll
  let lastScrollY = window.scrollY;
  let ticking = false;

  // Inicializar el menú
  function initHeaderMenu() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    const header = document.querySelector(".header-wave");

    if (!menuToggle || !navLinks || !header) return;

    // Toggle del menú móvil
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("active");
      navLinks.classList.toggle("active");
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener("click", (event) => {
      const isClickInside = header.contains(event.target);
      if (!isClickInside && navLinks.classList.contains("active")) {
        menuToggle.classList.remove("active");
        navLinks.classList.remove("active");
      }
    });

    // Cerrar menú al hacer click en un link
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.classList.remove("active");
        navLinks.classList.remove("active");
      });
    });

    // Resaltar link activo
    const currentPage = window.location.pathname;
    navLinks.querySelectorAll("a").forEach((link) => {
      if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });

    // Inicializar comportamiento de scroll
    initScrollBehavior();

    // Inicializar perfil rápido
    initQuickProfile();
  }

  // Control de scroll del header
  function initScrollBehavior() {
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const header = document.querySelector(".header-wave");
          if (!header) return;

          if (window.scrollY > lastScrollY && window.scrollY > 60) {
            header.classList.add("hide-on-scroll");
          } else {
            header.classList.remove("hide-on-scroll");
          }

          lastScrollY = window.scrollY;
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // Obtener datos del perfil
  function getUserProfile() {
    return {
      avatar:
        localStorage.getItem("user_avatar") ||
        "/frontend/src/assets/images/missa.webp",
      nombre: localStorage.getItem("user_nombre") || "Usuario TSAEC",
      comentarios: Number(localStorage.getItem("user_comentarios") || 0),
      apoyos: Number(localStorage.getItem("user_apoyos") || 0),
      sugerencias: Number(localStorage.getItem("user_sugerencias") || 0),
    };
  }

  // Mostrar popup del perfil
  function showQuickProfilePopup() {
    if (document.querySelector(".quick-profile-popup")) return;

    const user = getUserProfile(); // Hacer el tamaño responsive basado en el ancho de la pantalla
    const winWidth = Math.min(440, window.innerWidth * 0.9);
    const winHeight = Math.min(420, window.innerHeight * 0.9);
    const left = Math.max(0, (window.innerWidth - winWidth) / 2);
    const top = Math.max(40, (window.innerHeight - winHeight) / 2);

    const win = document.createElement("div");
    win.className = "floating-window quick-profile-popup";
    win.style.cssText = `
            z-index: 3000;
            width: ${winWidth}px;
            max-width: 90vw;
            left: ${left}px;
            top: ${top}px;
            transform: translate3d(0,0,0);
            touch-action: none;
        `;

    win.innerHTML = `
            <div class="browser-tab browser-tab-floating">
                <span class="tab-title"><span class="tab-icon">🌐</span> Perfil rápido</span>
                <button class="window-close" title="Cerrar">&#10005;</button>
            </div>
            <div class="window-content">
                <img src="${user.avatar}" alt="Avatar" class="profile-avatar" style="display:block;margin:0 auto 10px auto;" />
                <div class="profile-name">${user.nombre}</div>
                <div class="profile-stats">
                    <span><b>${user.comentarios}</b> comentarios</span><br>
                    <span><b>${user.apoyos}</b> apoyos</span><br>
                    <span><b>${user.sugerencias}</b> sugerencias</span>
                </div>
                <button class="profile-config-btn">Configurar perfil completo</button>
            </div>
        `;

    document.body.appendChild(win); // Cerrar ventana - mejorado para soporte táctil
    const closeButton = win.querySelector(".window-close");
    if (closeButton) {
      // Soporte para click del mouse
      closeButton.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        win.remove();
      });

      // Soporte para eventos táctiles
      closeButton.addEventListener(
        "touchend",
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          win.remove();
        },
        { passive: false }
      );
    }

    // Traer al frente al hacer click
    win.addEventListener("mousedown", () => {
      win.style.zIndex = ++window.zCounter || 3001;
    }); // Funcionalidad de arrastrar
    const titlebar = win.querySelector(".browser-tab");
    let offsetX,
      offsetY,
      dragging = false;
    function moveWindow(clientX, clientY) {
      let x = clientX - offsetX;
      let y = clientY - offsetY;

      // Permitir que la ventana se mueva hasta que al menos un 20% sea visible
      const maxX = window.innerWidth - win.offsetWidth;
      const maxY = window.innerHeight - win.offsetHeight;
      x = Math.max(
        -win.offsetWidth * 0.8,
        Math.min(x, maxX + win.offsetWidth * 0.8)
      );
      y = Math.max(
        -win.offsetHeight * 0.8,
        Math.min(y, maxY + win.offsetHeight * 0.8)
      );

      requestAnimationFrame(() => {
        win.style.left = x + "px";
        win.style.top = y + "px";
      });
    }

    // Eventos de mouse
    titlebar.addEventListener("mousedown", (e) => {
      dragging = true;
      win.style.zIndex = ++window.zCounter || 3001;
      const rect = win.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      document.body.style.userSelect = "none";
    });

    document.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      moveWindow(e.clientX, e.clientY);
    });

    document.addEventListener("mouseup", () => {
      dragging = false;
      document.body.style.userSelect = "";
    }); // Eventos táctiles mejorados
    let lastTouch = null;
    titlebar.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length === 1) {
          dragging = true;
          win.style.zIndex = ++window.zCounter || 3001;
          const rect = win.getBoundingClientRect();
          const touch = e.touches[0];
          offsetX = touch.clientX - rect.left;
          offsetY = touch.clientY - rect.top;
          lastTouch = touch;
          document.body.style.userSelect = "none";
          e.preventDefault();
        }
      },
      { passive: false }
    );

    document.addEventListener(
      "touchmove",
      (e) => {
        if (!dragging || e.touches.length !== 1) return;
        const touch = e.touches[0];

        // Calcular el delta del movimiento
        if (lastTouch) {
          const deltaX = touch.clientX - lastTouch.clientX;
          const deltaY = touch.clientY - lastTouch.clientY;

          // Si el movimiento es significativo, prevenir el scroll
          if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
            e.preventDefault();
          }
        }

        moveWindow(touch.clientX, touch.clientY);
        lastTouch = touch;
      },
      { passive: false }
    );

    document.addEventListener("touchend", () => {
      dragging = false;
      lastTouch = null;
      document.body.style.userSelect = "";
    });

    // Ir a perfil completo
    win.querySelector(".profile-config-btn").onclick = () => {
      window.location.href = "/frontend/src/pages/perfil.html";
    };
  }

  // Inicializar perfil rápido
  function initQuickProfile() {
    const btn = document.getElementById("profile-btn");
    if (!btn) return;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      showQuickProfilePopup();
    });
  }

  // Exponer funciones necesarias globalmente
  window.initHeaderMenu = initHeaderMenu;
  window.initQuickProfile = initQuickProfile;

  // Inicialización automática cuando el DOM está listo
  document.addEventListener("DOMContentLoaded", initHeaderMenu);
})();
