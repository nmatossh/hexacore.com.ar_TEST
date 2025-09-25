export function setupUI() {
    const arrow = document.getElementById('arrow');
    const bottomBar = document.querySelector('.bottom-bar');
    const menu = document.getElementById('menu');
    const logo = document.querySelector('.logo img');
    const menuLinks = document.querySelector('#menu .menu-links');

    // Estado inicial oculto
    menu.style.opacity = '0';
    menu.style.transform = 'translateY(-10px)';
    bottomBar.style.opacity = '0';
    bottomBar.style.transform = 'translateY(10px)';
    bottomBar.style.pointerEvents = 'none';
    arrow.style.opacity = '0';
    menuLinks.dataset.visible = 'false'; // menú hamburguesa cerrado
    if(window.innerWidth > 900) menuLinks.style.display = 'flex'; // desktop

    // Mostrar flecha cuando termine la animación del logo
    logo.addEventListener('animationend', () => {
        arrow.style.opacity = '1';
    });

    // Función para mostrar la UI (menu y bottom bar)
    const showUI = () => {
        menu.style.opacity = '1';
        menu.style.transform = 'translateY(0)';
        bottomBar.style.opacity = '1';
        bottomBar.style.transform = 'translateY(0)';
        bottomBar.style.pointerEvents = 'auto';

        // Mostrar menú según ancho de pantalla
        if(window.innerWidth > 900){
            menuLinks.style.display = 'flex';
        } else if(menuLinks.dataset.visible === 'true'){
            menuLinks.style.display = 'flex';
        }
    };

    // Función para ocultar la UI
    const hideUI = () => {
        menu.style.opacity = '0';
        menu.style.transform = 'translateY(-10px)';
        bottomBar.style.opacity = '0';
        bottomBar.style.transform = 'translateY(10px)';
        bottomBar.style.pointerEvents = 'none';
        if(window.innerWidth <= 900){
            menuLinks.style.display = 'none';
            menuLinks.dataset.visible = 'false';
        }
    };

    // Scroll a contenido al hacer click en flecha
    const scrollToContent = () => {
        window.scrollTo({ top: logo.parentElement.offsetHeight, behavior: 'smooth' });
        showUI();
    };

    if (arrow) {
        arrow.addEventListener('click', scrollToContent);
        arrow.addEventListener('keydown', (e) => {
            if(e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                scrollToContent();
            }
        });
    }

    // Mostrar u ocultar UI según scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY <= 10) { hideUI(); }
        else { showUI(); }
    });
}
