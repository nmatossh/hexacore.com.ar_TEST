// Calcula dinámicamente las alturas reales de la menu bar y bottom bar
// y las expone como variables CSS para evitar solapamientos o huecos.
// Si el JavaScript no se ejecuta, se usan los valores de respaldo en CSS.

function applyChromeHeights() {
  const root = document.documentElement;
  const menu = document.getElementById('menu');
  const bottomBar = document.querySelector('.bottom-bar');
  
  if (!menu || !bottomBar) {
    return;
  }
  
  const menuH = menu.offsetHeight;
  const bottomH = bottomBar.offsetHeight;

  // Actualizar variables CSS dinámicas
  root.style.setProperty('--nav-h', menuH + 'px');
  root.style.setProperty('--bottom-h', bottomH + 'px');
  
  // También actualizar las variables de respaldo para consistencia
  root.style.setProperty('--nav-height', menuH + 'px');
  root.style.setProperty('--bottom-height', bottomH + 'px');
}

// Menú hamburguesa
function setupMenu() {
  const hamburger = document.getElementById('hamburger');
  const menuLinks = document.querySelector('#menu .menu-links');
  if (!hamburger || !menuLinks) {
    return;
  }

  menuLinks.dataset.visible = 'false';

  hamburger.addEventListener('click', (e) => {
    e.preventDefault();
    const visible = menuLinks.dataset.visible === 'true';
    
    if (visible) {
      // Cerrar menú
      menuLinks.dataset.visible = 'false';
      hamburger.classList.remove('active');
    } else {
      // Abrir menú
      menuLinks.style.display = 'flex';
      // Pequeño delay para que el display se aplique antes de la animación
      setTimeout(() => {
        menuLinks.dataset.visible = 'true';
        hamburger.classList.add('active');
      }, 10);
    }
    
    // Mejorar accesibilidad
    hamburger.setAttribute('aria-expanded', !visible);
  });

  // Cerrar menú al hacer clic en un enlace (solo en móvil)
  menuLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && window.innerWidth <= 900) {
      menuLinks.dataset.visible = 'false';
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      // Ocultar después de la animación
      setTimeout(() => {
        menuLinks.style.display = 'none';
      }, 300);
    }
  });

  // Función para cerrar el menú completamente
  function closeMenu() {
    menuLinks.dataset.visible = 'false';
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    // Esperar a que termine la animación antes de ocultar
    setTimeout(() => {
      if (window.innerWidth <= 900) {
        menuLinks.style.display = 'none';
      }
    }, 300);
  }

  window.addEventListener('resize', () => {
    const isMobile = window.innerWidth <= 900;
    
    if (!isMobile) {
      // Modo desktop: mostrar menú normal y cerrar cualquier estado de móvil
      menuLinks.style.display = 'flex';
      menuLinks.dataset.visible = 'false';
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    } else {
      // Modo móvil: cerrar el menú si está abierto
      if (menuLinks.dataset.visible === 'true') {
        closeMenu();
      } else {
        // Si ya está cerrado, solo asegurar que esté oculto
        menuLinks.style.display = 'none';
        menuLinks.dataset.visible = 'false';
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    }
  });
}

/* ===== Animaciones de Scroll ===== */
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observar todos los elementos con clases de animación
  const animatedElements = document.querySelectorAll(
    '.fade-in-scroll, .slide-in-left, .slide-in-right, .scale-in, .stagger-item'
  );
  
  animatedElements.forEach(el => observer.observe(el));
}

/* ===== Transparencia del Menu Bar y Bottom Bar en Scroll y Clicks ===== */
function setupMenuTransparency() {
  const menu = document.getElementById('menu');
  const bottomBar = document.querySelector('.bottom-bar');
  if (!menu || !bottomBar) return;

  // Detectar scroll
  let lastScrollTop = 0;
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Si está en la parte superior (top 0-10px), quitar transparencia
    if (scrollTop <= 10) {
      menu.classList.remove('transparent');
      bottomBar.classList.remove('transparent');
    } else {
      // Si hace scroll hacia abajo, agregar transparencia
      menu.classList.add('transparent');
      bottomBar.classList.add('transparent');
    }
    lastScrollTop = scrollTop;
  }, false);

  // Detectar clicks en enlaces del menú
  const menuLinks = document.querySelectorAll('#menu .menu-links a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('transparent');
      bottomBar.classList.add('transparent');
      // Después de 1 segundo, verificar si está en el top
    setTimeout(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop <= 10) {
          menu.classList.remove('transparent');
          bottomBar.classList.remove('transparent');
        }
      }, 1000);
    });
  });

  // Detectar clicks en iconos de la bottom bar
  const bottomBarIcons = document.querySelectorAll('.bottom-bar .icons a');
  bottomBarIcons.forEach(icon => {
    icon.addEventListener('click', () => {
      menu.classList.add('transparent');
      bottomBar.classList.add('transparent');
      // Después de 1 segundo, verificar si está en el top
      setTimeout(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop <= 10) {
          menu.classList.remove('transparent');
          bottomBar.classList.remove('transparent');
        }
      }, 1000);
    });
  });
}

/* ===== Validación del Formulario de Contacto ===== */
function setupFormValidation() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const nombre = document.getElementById('nombre');
  const email = document.getElementById('email');
  const telefono = document.getElementById('telefono');
  const mensaje = document.getElementById('mensaje');

  // Función para mostrar error
  function showError(input, message) {
    const formGroup = input.closest('.form-group');
    let errorElement = formGroup.querySelector('.error-message');
    
    if (!errorElement) {
      errorElement = document.createElement('span');
      errorElement.className = 'error-message';
      formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    input.classList.add('error');
  }

  // Función para limpiar error
  function clearError(input) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    if (errorElement) {
      errorElement.remove();
    }
    
    input.classList.remove('error');
  }

  // Validar email
  function validateEmail(emailValue) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  }

  // Validar teléfono (opcional, pero si se proporciona debe ser válido)
  function validatePhone(phoneValue) {
    if (!phoneValue.trim()) return true; // Opcional
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    return phoneRegex.test(phoneValue) && phoneValue.replace(/\D/g, '').length >= 8;
  }

  // Validación en tiempo real
  if (nombre) {
    nombre.addEventListener('blur', () => {
      const value = nombre.value.trim();
      if (value.length < 2) {
        showError(nombre, 'El nombre debe tener al menos 2 caracteres');
      } else {
        clearError(nombre);
      }
    });

    nombre.addEventListener('input', () => {
      if (nombre.value.trim().length >= 2) {
        clearError(nombre);
      }
    });
  }

  if (email) {
    email.addEventListener('blur', () => {
      const value = email.value.trim();
      if (!value) {
        showError(email, 'El correo electrónico es obligatorio');
      } else if (!validateEmail(value)) {
        showError(email, 'Por favor, ingresa un correo electrónico válido');
      } else {
        clearError(email);
      }
    });

    email.addEventListener('input', () => {
      if (validateEmail(email.value.trim())) {
        clearError(email);
      }
    });
  }

  if (telefono) {
    telefono.addEventListener('blur', () => {
      const value = telefono.value.trim();
      if (value && !validatePhone(value)) {
        showError(telefono, 'Por favor, ingresa un número de teléfono válido');
      } else {
        clearError(telefono);
      }
    });

    telefono.addEventListener('input', () => {
      if (!telefono.value.trim() || validatePhone(telefono.value.trim())) {
        clearError(telefono);
      }
    });
  }

  if (mensaje) {
    mensaje.addEventListener('blur', () => {
      const value = mensaje.value.trim();
      if (value.length < 10) {
        showError(mensaje, 'El mensaje debe tener al menos 10 caracteres');
      } else {
        clearError(mensaje);
      }
    });

    mensaje.addEventListener('input', () => {
      if (mensaje.value.trim().length >= 10) {
        clearError(mensaje);
      }
    });
  }

  // Validación al enviar
  form.addEventListener('submit', (e) => {
    let isValid = true;

    // Validar nombre
    if (nombre) {
      const nombreValue = nombre.value.trim();
      if (nombreValue.length < 2) {
        showError(nombre, 'El nombre debe tener al menos 2 caracteres');
        isValid = false;
      } else {
        clearError(nombre);
      }
    }

    // Validar email
    if (email) {
      const emailValue = email.value.trim();
      if (!emailValue) {
        showError(email, 'El correo electrónico es obligatorio');
        isValid = false;
      } else if (!validateEmail(emailValue)) {
        showError(email, 'Por favor, ingresa un correo electrónico válido');
        isValid = false;
      } else {
        clearError(email);
      }
    }

    // Validar teléfono
    if (telefono) {
      const telefonoValue = telefono.value.trim();
      if (telefonoValue && !validatePhone(telefonoValue)) {
        showError(telefono, 'Por favor, ingresa un número de teléfono válido');
        isValid = false;
      } else {
        clearError(telefono);
      }
    }

    // Validar mensaje
    if (mensaje) {
      const mensajeValue = mensaje.value.trim();
      if (mensajeValue.length < 10) {
        showError(mensaje, 'El mensaje debe tener al menos 10 caracteres');
        isValid = false;
      } else {
        clearError(mensaje);
      }
    }

    if (!isValid) {
      e.preventDefault();
      // Scroll al primer error
      const firstError = form.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
    }
  });
}

/* ===== Cambio de Tema (Claro/Oscuro) ===== */
function updateLogos(theme) {
  const homeLogos = document.querySelectorAll('.home-logo');
  
  // Siempre usar logo.svg en ambos temas
  homeLogos.forEach(logo => {
    logo.src = './img/logo.svg';
  });
}

function setupThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const html = document.documentElement;
  
  if (!themeToggle || !themeIcon) return;

  // Detectar preferencia del sistema
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const systemTheme = prefersDark ? 'dark' : 'light';

  // Cargar tema guardado, o usar preferencia del sistema, o tema oscuro por defecto
  const savedTheme = localStorage.getItem('theme') || systemTheme;
  if (savedTheme === 'light') {
    html.setAttribute('data-theme', 'light');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
    updateLogos('light');
  } else {
    html.setAttribute('data-theme', 'dark');
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
    updateLogos('dark');
  }

  // Cambiar tema al hacer clic
  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Optimización: agregar will-change temporalmente para mejor rendimiento
    document.body.style.willChange = 'background-color, color';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Cambiar icono
    if (newTheme === 'light') {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    } else {
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    }
    
    // Actualizar logos
    updateLogos(newTheme);
    
    // Remover will-change después de la transición para liberar recursos
    setTimeout(() => {
      document.body.style.willChange = 'auto';
    }, 350);
  });
}

// Manejo de errores para imágenes rotas
window.handleImageError = function(img) {
  // Ocultar la imagen si falla al cargar
  img.style.display = 'none';
  // Opcional: mostrar un placeholder o mensaje
  // Por ahora solo ocultamos para no romper el layout
};

// Actualizar año del copyright automáticamente
function updateCopyrightYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  applyChromeHeights();
  setupMenu();
  setupScrollAnimations();
  setupMenuTransparency();
  setupFormValidation();
  setupThemeToggle();
  updateCopyrightYear();
  // Recalcular en resize por si el alto cambia (responsive)
  window.addEventListener('resize', applyChromeHeights);
  
  // Activar animaciones de entrada del menu bar y bottom bar
  // Pequeño delay para que se vea el efecto
  setTimeout(() => {
    document.body.classList.add('page-loaded');
  }, 50);
    });



