/*
  JS unificado: navegación, UI y secciones
  - Mantiene clic de flecha, visibilidad de menú/footer y evita overlays invisibles
*/
document.addEventListener('DOMContentLoaded', () => {
  setupMenu();
  setupUI();
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
    menuLinks.style.display = visible ? 'none' : 'flex';
    menuLinks.dataset.visible = visible ? 'false' : 'true';
    
    // Mejorar accesibilidad
    hamburger.setAttribute('aria-expanded', !visible);
  });

  // Cerrar menú al hacer clic en un enlace (solo en móvil)
  menuLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && window.innerWidth <= 900) {
      menuLinks.style.display = 'none';
      menuLinks.dataset.visible = 'false';
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      menuLinks.style.display = 'flex';
      menuLinks.dataset.visible = 'false';
      hamburger.setAttribute('aria-expanded', 'false');
    } else {
      menuLinks.style.display = 'none';
      menuLinks.dataset.visible = 'false';
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

/* Stubs de secciones */
function initHome()    { console.log('Sección Home cargada'); }
function initAbout()   { console.log('Sección About cargada'); }
function initServices(){
  const cards = document.querySelectorAll('.service-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => { card.style.transform = 'translateY(-5px)'; });
    card.addEventListener('mouseleave', () => { card.style.transform = 'translateY(0)'; });
  });
  
  // Efectos hover removidos de content-item
}
function initProjects(){ console.log('Sección Projects cargada'); }
function initContact() { console.log('Sección Contact cargada'); }

