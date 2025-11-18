// Calcula dinámicamente las alturas reales de la menu bar y bottom bar
// y las expone como variables CSS para evitar solapamientos o huecos.
// Si el JavaScript no se ejecuta, se usan los valores de respaldo en CSS.

const MOBILE_BREAKPOINT = 1100;

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
  const submenuTriggers = menuLinks.querySelectorAll('.submenu-trigger');

  function closeSubmenus() {
    submenuTriggers.forEach((trigger) => {
      const parent = trigger.closest('.has-submenu');
      trigger.setAttribute('aria-expanded', 'false');
      if (parent) {
        parent.dataset.open = 'false';
      }
    });
  }

  const submenuDirectLinks = menuLinks.querySelectorAll('.submenu-direct-link');
  submenuDirectLinks.forEach((directLink) => {
    directLink.addEventListener('click', () => {
      closeSubmenus();
      closeMenu();
    });
  });

  submenuTriggers.forEach((trigger) => {
    const parent = trigger.closest('.has-submenu');
    if (parent && !parent.dataset.open) {
      parent.dataset.open = 'false';
    }
    trigger.setAttribute('aria-expanded', 'false');

    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!parent) {
        return;
      }

      const targetSelector = trigger.dataset.target;
      const isDesktop = window.innerWidth > MOBILE_BREAKPOINT;
      if (isDesktop && targetSelector) {
        closeSubmenus();
        parent.dataset.open = 'false';
        trigger.setAttribute('aria-expanded', 'false');
        const target = document.querySelector(targetSelector);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Actualizar el hash en la URL después de hacer scroll
          window.location.hash = targetSelector;
        } else {
          window.location.hash = targetSelector;
        }
        return;
      }

      const isOpen = parent.dataset.open === 'true';
      if (isOpen) {
        parent.dataset.open = 'false';
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        closeSubmenus();
        parent.dataset.open = 'true';
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (!menuLinks.contains(event.target)) {
      closeSubmenus();
    }
  });

  hamburger.addEventListener('click', (e) => {
    e.preventDefault();
    const visible = menuLinks.dataset.visible === 'true';
    
    if (visible) {
      // Cerrar menú
      closeMenu();
    } else {
      // Abrir menú
      menuLinks.style.display = 'flex';
      document.body.classList.add('menu-open');
      menuLinks.scrollTop = 0;
      closeSubmenus();
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
    if (e.target.tagName === 'A') {
      closeSubmenus();
    }

    if (e.target.tagName === 'A' && window.innerWidth <= MOBILE_BREAKPOINT) {
      closeMenu();
    }
  });

  // Función para cerrar el menú completamente
  function closeMenu() {
      menuLinks.dataset.visible = 'false';
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    closeSubmenus();
    // Esperar a que termine la animación antes de ocultar
      setTimeout(() => {
      if (window.innerWidth <= MOBILE_BREAKPOINT) {
        menuLinks.style.display = 'none';
      }
      }, 300);
    }

  window.addEventListener('resize', () => {
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    
    closeSubmenus();

    if (!isMobile) {
      // Modo desktop: mostrar menú normal y cerrar cualquier estado de móvil
      menuLinks.style.display = 'flex';
      menuLinks.dataset.visible = 'false';
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
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
        document.body.classList.remove('menu-open');
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

  const getScrollTop = () => {
    const winOffset = typeof window.pageYOffset === 'number' ? window.pageYOffset
      : (typeof window.scrollY === 'number' ? window.scrollY : 0);
    const docElement = document.documentElement ? document.documentElement.scrollTop : 0;
    const body = document.body ? document.body.scrollTop : 0;
    return Math.max(winOffset, docElement, body);
  };

  // Detectar scroll
  const onScroll = () => {
    const scrollTop = getScrollTop();
    
    // Si está en la parte superior (top 0-10px), quitar transparencia
    if (scrollTop <= 10) {
      menu.classList.remove('transparent');
      bottomBar.classList.remove('transparent');
    } else {
      // Si hace scroll hacia abajo, agregar transparencia
      menu.classList.add('transparent');
      bottomBar.classList.add('transparent');
  }
  };

  const scrollTargets = [window, document];
  if (document.documentElement) {
    scrollTargets.push(document.documentElement);
  }
  if (document.body) {
    scrollTargets.push(document.body);
  }

  scrollTargets.forEach((target) => {
    if (target && typeof target.addEventListener === 'function') {
      target.addEventListener('scroll', onScroll, { passive: true });
    }
  });

  // Evaluar estado inicial
  requestAnimationFrame(onScroll);

  // Detectar clicks en enlaces del menú
  const menuLinks = document.querySelectorAll('#menu .menu-links a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('transparent');
      bottomBar.classList.add('transparent');
      // Después de 1 segundo, verificar si está en el top
      setTimeout(() => {
        const scrollTop = getScrollTop();
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
        const scrollTop = getScrollTop();
        if (scrollTop <= 10) {
          menu.classList.remove('transparent');
          bottomBar.classList.remove('transparent');
        }
      }, 1000);
    });
  });
}

/* ===== Toggle de información ampliada en Servicios ===== */
function setupServiceToggles() {
  const serviceCards = document.querySelectorAll('.service-card.has-toggle');

  serviceCards.forEach((card) => {
    const toggleButton = card.querySelector('.service-toggle');
    const extraContent = card.querySelector('.service-extra');

    if (!toggleButton || !extraContent) {
      return;
    }

    const collapsedLabel = toggleButton.dataset.collapsedText || 'Ver más';
    const expandedLabel = toggleButton.dataset.expandedText || 'Ver menos';

    const setState = (expanded) => {
      card.classList.toggle('expanded', expanded);
      toggleButton.setAttribute('aria-expanded', expanded);
      extraContent.hidden = !expanded;
      toggleButton.textContent = expanded ? expandedLabel : collapsedLabel;
    };

    setState(false);

    toggleButton.addEventListener('click', () => {
      const isExpanded = card.classList.contains('expanded');
      setState(!isExpanded);
    });
  });
}


/* ===== Botón de Contactanos ===== */
function setupWhatsAppButton() {
  // El botón ahora es un enlace que navega a #contacto
  // La navegación se maneja automáticamente por el href
  // Esta función se mantiene por compatibilidad pero ya no es necesaria
}

/* ===== Menú desplegable del chatbot de WhatsApp ===== */
function setupWhatsAppChat() {
  const toggleBtn = document.getElementById('whatsapp-toggle-btn');
  const chatWindow = document.getElementById('whatsapp-chat-window');
  const closeBtn = document.getElementById('chat-close-btn');

  if (!toggleBtn || !chatWindow || !closeBtn) {
    return;
  }

  function openChat() {
    chatWindow.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
  }

  function closeChat() {
    chatWindow.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
  }

  toggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const isOpen = chatWindow.getAttribute('aria-hidden') === 'false';
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  });

  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closeChat();
  });
  
  // Cerrar al hacer clic fuera del chat
  document.addEventListener('click', (e) => {
    const container = document.querySelector('.whatsapp-chat-container');
    if (container && !container.contains(e.target)) {
      const isOpen = chatWindow.getAttribute('aria-hidden') === 'false';
      if (isOpen) {
        closeChat();
      }
    }
  });

  // Cerrar con la tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const isOpen = chatWindow.getAttribute('aria-hidden') === 'false';
      if (isOpen) {
        closeChat();
        toggleBtn.focus();
      }
    }
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
  setupServiceToggles();
  setupWhatsAppButton();
  setupWhatsAppChat();
  updateCopyrightYear();
  // Recalcular en resize por si el alto cambia (responsive)
  window.addEventListener('resize', applyChromeHeights);
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      applyChromeHeights();
    }, 250);

    const hamburger = document.getElementById('hamburger');
    const menuLinks = document.querySelector('#menu .menu-links');

    if (!hamburger || !menuLinks) {
      return;
    }

    const submenuTriggers = menuLinks.querySelectorAll('.submenu-trigger');
    submenuTriggers.forEach((trigger) => {
      const parent = trigger.closest('.has-submenu');
      trigger.setAttribute('aria-expanded', 'false');
      if (parent) {
        parent.dataset.open = 'false';
      }
    });

    if (window.innerWidth <= MOBILE_BREAKPOINT) {
      menuLinks.style.display = 'none';
      menuLinks.dataset.visible = 'false';
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      menuLinks.scrollTop = 0;
    } else {
      menuLinks.style.display = 'flex';
      menuLinks.dataset.visible = 'false';
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }
  });
  
  // Activar animaciones de entrada del menu bar y bottom bar
  // Pequeño delay para que se vea el efecto
  setTimeout(() => {
    document.body.classList.add('page-loaded');
  }, 50);
    });

