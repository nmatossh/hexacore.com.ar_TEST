/*
  JS unificado: navegación, UI, secciones y animaciones
  - Mantiene clic de flecha, visibilidad de menú/footer y evita overlays invisibles
  - Incluye animaciones de scroll y efectos interactivos
*/
document.addEventListener('DOMContentLoaded', () => {
  setupMenu();
  setupUI();
  setupScrollAnimations();
  initHome();
  initAbout();
  initServices();
  initProjects();
  initContact();
});

/* Menú hamburguesa */
function setupMenu() {
  const hamburger = document.getElementById('hamburger');
  const menuLinks = document.querySelector('#menu .menu-links');
  if (!hamburger || !menuLinks) {
    console.warn('Elementos del menú no encontrados');
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

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      menuLinks.style.display = 'flex';
      menuLinks.dataset.visible = 'false';
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    } else {
      menuLinks.style.display = 'none';
      menuLinks.dataset.visible = 'false';
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

/* UI: flecha + menú + bottom bar */
function setupUI() {
  const arrow = document.getElementById('arrow');
  const bottomBar = document.querySelector('.bottom-bar');
  const menu = document.getElementById('menu');
  const logo = document.querySelector('.logo img');
  const menuLinks = document.querySelector('#menu .menu-links');

  if (!arrow || !menu || !bottomBar || !logo || !menuLinks) {
    console.warn('Elementos de UI no encontrados');
    return;
  }

  // Estado inicial: oculto y sin capturar eventos
  menu.style.opacity = '0';
  menu.style.transform = 'translateX(-50%) translateY(-10px)';
  menu.style.pointerEvents = 'none';

  bottomBar.style.opacity = '0';
  bottomBar.style.transform = 'translateX(-50%) translateY(10px)';
  bottomBar.style.pointerEvents = 'none';

  if (window.innerWidth > 900) {
    menuLinks.style.display = 'flex';
  } else {
    menuLinks.style.display = 'none';
    menuLinks.dataset.visible = 'false';
  }

  const showUI = () => {
    menu.style.opacity = '1';
    menu.style.transform = 'translateX(-50%) translateY(0)';
    menu.style.pointerEvents = 'auto';

    bottomBar.style.opacity = '1';
    bottomBar.style.transform = 'translateX(-50%) translateY(0)';
    bottomBar.style.pointerEvents = 'auto';

    // En desktop, siempre mostrar el menú
    if (window.innerWidth > 900) {
      menuLinks.style.display = 'flex';
      menuLinks.dataset.visible = 'false';
    } else if (menuLinks.dataset.visible === 'true') {
      menuLinks.style.display = 'flex';
    }
    
    // Ocultar la flecha cuando se muestra la UI
    arrow.style.opacity = '0';
  };

  const hideUI = () => {
    menu.style.opacity = '0';
    menu.style.transform = 'translateX(-50%) translateY(-10px)';
    menu.style.pointerEvents = 'none';

    bottomBar.style.opacity = '0';
    bottomBar.style.transform = 'translateX(-50%) translateY(10px)';
    bottomBar.style.pointerEvents = 'none';

    if (window.innerWidth <= 900) {
      menuLinks.style.display = 'none';
      menuLinks.dataset.visible = 'false';
    }
    
    // Mostrar la flecha cuando se oculta la UI
    arrow.style.opacity = '1';
  };

  // Mostrar flecha al finalizar animación del logo (+ fallback)
  logo.addEventListener('animationend', () => { arrow.style.opacity = '1'; });
  setTimeout(() => { if (getComputedStyle(arrow).opacity === '0') arrow.style.opacity = '1'; }, 2000);

  const scrollToContent = () => {
    const logoHeight = logo.parentElement.offsetHeight || 0;
    const menuHeight = menu.offsetHeight || 0;
    const offset = logoHeight - menuHeight; // Restar la altura del menú
    window.scrollTo({ top: offset, behavior: 'smooth' });
    showUI();
    arrowClicked = true; // Marcar que se hizo clic en la flecha
  };

  arrow.addEventListener('click', scrollToContent);
  arrow.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scrollToContent(); }
  });

  // Variable para controlar si el usuario hizo clic en la flecha
  let arrowClicked = false;

  window.addEventListener('scroll', () => {
    if (window.scrollY <= 10) {
      // Si el usuario vuelve al inicio, ocultar UI y resetear estado
      hideUI();
      arrowClicked = false; // Resetear para permitir mostrar la flecha nuevamente
    } else if (window.scrollY > 10) {
      showUI();
    }
  });
}

/* ===== Animaciones de Scroll ===== */
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
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

/* ===== Efectos Interactivos Mejorados ===== */
function initHome() {
  console.log('Sección Home cargada');
  
  // Efecto de typing para el título principal
  const mainTitle = document.querySelector('.section-title');
  if (mainTitle) {
    mainTitle.style.opacity = '0';
    setTimeout(() => {
      mainTitle.style.opacity = '1';
      mainTitle.style.transition = 'opacity 0.8s ease';
    }, 500);
  }
}

function initAbout() {
  console.log('Sección About cargada');
  
  // Efecto de hover mejorado para miembros del equipo
  const teamMembers = document.querySelectorAll('.team-member');
  teamMembers.forEach(member => {
    member.addEventListener('mouseenter', () => {
      member.style.transform = 'translateY(-8px) scale(1.02)';
    });
    member.addEventListener('mouseleave', () => {
      member.style.transform = 'translateY(0) scale(1)';
    });
  });
}

function initServices() {
  console.log('Sección Services cargada');
  
  // Efectos hover mejorados para tarjetas de servicios
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px) rotate(1deg)';
      card.style.boxShadow = '0 8px 25px rgba(152, 43, 43, 0.3)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) rotate(0deg)';
      card.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    });
  });
}

function initProjects() {
  console.log('Sección Projects cargada');
  
  // Efectos hover mejorados para tarjetas de proyectos
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px) scale(1.02)';
      card.style.boxShadow = '0 12px 35px rgba(152, 43, 43, 0.25)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
      card.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    });
  });
}

function initContact() {
  console.log('Sección Contact cargada');
  
  // Efectos de focus mejorados para el formulario
  const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
  formInputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.style.borderColor = '#982b2b';
      input.style.boxShadow = '0 0 0 2px rgba(152, 43, 43, 0.2)';
    });
    input.addEventListener('blur', () => {
      input.style.borderColor = '#555';
      input.style.boxShadow = 'none';
    });
  });
  
  // Efecto de ripple para el botón de envío
  const submitBtn = document.querySelector('.submit-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
      const rect = submitBtn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      `;
      
      submitBtn.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  }
}
