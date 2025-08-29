document.addEventListener('DOMContentLoaded', function() {
    // Efecto de scroll para el header
    const header = document.querySelector('.main-header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.style.transform = 'translateY(0)';
            return;
        }
        
        if (currentScroll > lastScroll) {
            // Scroll hacia abajo
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scroll hacia arriba
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    // Menú móvil (se puede expandir)
    const menuBtn = document.createElement('button');
    menuBtn.className = 'menu-btn';
    menuBtn.innerHTML = '☰';
    document.querySelector('.main-header .container').appendChild(menuBtn);
    
    menuBtn.addEventListener('click', function() {
        document.querySelector('.main-nav').classList.toggle('active');
    });
});