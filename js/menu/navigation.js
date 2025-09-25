export function setupMenu() {
  const hamburger = document.getElementById('hamburger');
  const menuLinks = document.querySelector('#menu .menu-links');

  // Estado inicial del menú hamburguesa
  menuLinks.dataset.visible = 'false';

  hamburger.addEventListener('click', () => {
      if(menuLinks.style.display === 'flex') {
          menuLinks.style.display = 'none';
          menuLinks.dataset.visible = 'false';
      } else {
          menuLinks.style.display = 'flex';
          menuLinks.dataset.visible = 'true';
      }
  });

  // Ocultar menú hamburguesa si se cambia tamaño de pantalla
  window.addEventListener('resize', () => {
      if(window.innerWidth > 900){
          menuLinks.style.display = 'flex';
          menuLinks.dataset.visible = 'false';
      } else {
          menuLinks.style.display = 'none';
          menuLinks.dataset.visible = 'false';
      }
  });
}
