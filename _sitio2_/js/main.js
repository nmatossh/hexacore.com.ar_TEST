// Calcula dinámicamente las alturas reales de la menu bar y bottom bar
// y las expone como variables CSS para evitar solapamientos o huecos.

function applyChromeHeights() {
  const root = document.documentElement;
  const menu = document.getElementById('menu');
  const bottomBar = document.querySelector('.bottom-bar');

  const menuH = menu ? menu.offsetHeight : 0;
  const bottomH = bottomBar ? bottomBar.offsetHeight : 0;

  root.style.setProperty('--nav-h', menuH + 'px');
  root.style.setProperty('--bottom-h', bottomH + 'px');
}

// Menú hamburguesa
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

window.addEventListener('DOMContentLoaded', () => {
  applyChromeHeights();
  setupMenu();
  setupScrollAnimations();
  // Recalcular en resize por si el alto cambia (responsive)
  window.addEventListener('resize', applyChromeHeights);
});



