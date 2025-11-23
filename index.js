// ==========================================
// 1. CONFIGURACIÓN INICIAL Y UI (Header/Tema)
// ==========================================

const RESPONSIVE_WIDTH = 1024;
let isHeaderCollapsed = window.innerWidth < RESPONSIVE_WIDTH;
const collapseBtn = document.getElementById("collapse-btn");
const collapseHeaderItems = document.getElementById("collapsed-header-items");

// Función para cerrar menú al hacer click fuera
function onHeaderClickOutside(e) {
    if (!collapseHeaderItems.contains(e.target) && e.target !== collapseBtn) {
        toggleHeader();
    }
}

// Toggle Menú Móvil
function toggleHeader() {
    if (isHeaderCollapsed) {
        // Abrir menú
        collapseHeaderItems.classList.add("max-lg:!tw-opacity-100", "tw-min-h-[90vh]");
        collapseHeaderItems.style.height = "90vh";
        collapseBtn.classList.replace("bi-list", "bi-x");
        collapseBtn.classList.add("max-lg:tw-fixed");
        isHeaderCollapsed = false;
        document.body.classList.add("modal-open");
        setTimeout(() => window.addEventListener("click", onHeaderClickOutside), 100);
    } else {
        // Cerrar menú
        collapseHeaderItems.classList.remove("max-lg:!tw-opacity-100", "tw-min-h-[90vh]");
        collapseHeaderItems.style.height = "0vh";
        collapseBtn.classList.replace("bi-x", "bi-list");
        collapseBtn.classList.remove("max-lg:tw-fixed");
        document.body.classList.remove("modal-open");
        isHeaderCollapsed = true;
        window.removeEventListener("click", onHeaderClickOutside);
    }
}

// Resetear menú al cambiar tamaño de pantalla
window.addEventListener("resize", () => {
    if (window.innerWidth > RESPONSIVE_WIDTH && !isHeaderCollapsed) {
        toggleHeader(); // Cerrar si pasamos a desktop
    }
});


// ==========================================
// 2. MODO OSCURO (DARK MODE)
// ==========================================
const toggleIcon = document.querySelector("#toggle-mode-icon");

function updateToggleModeBtn() {
    if (document.documentElement.classList.contains("tw-dark")) {
        toggleIcon.classList.replace("bi-sun", "bi-moon");
        localStorage.setItem("color-mode", "dark");
    } else {
        toggleIcon.classList.replace("bi-moon", "bi-sun");
        localStorage.setItem("color-mode", "light");
    }
}

// Inicializar modo según preferencia guardada o del sistema
if (localStorage.getItem('color-mode') === 'dark' || (!('color-mode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('tw-dark');
} else {
    document.documentElement.classList.remove('tw-dark');
}
updateToggleModeBtn();

// Función global para el botón del HTML
window.toggleMode = function() {
    document.documentElement.classList.toggle("tw-dark");
    updateToggleModeBtn();
};


// ==========================================
// 3. INICIALIZACIÓN DE COMPONENTES (Chat y Dropdown)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    
    // A. Inicializar Sistema de Chat (Prompt)
    // Pasamos una función para cuando llegue al límite de mensajes
    const chatSystem = new Prompt("#pixa-playground", () => {
        const signUpPrompt = document.querySelector("#signup-prompt");
        const promptInput = document.querySelector("input[name='prompt']");
        
        if(signUpPrompt) {
            signUpPrompt.classList.remove("tw-scale-0");
            signUpPrompt.classList.add("tw-scale-100");
        }
        if(promptInput) promptInput.disabled = true;
    });

    // B. Conectar el Formulario al Chat
    const promptForm = document.getElementById("prompt-form");
    const promptInput = promptForm.querySelector("input[name='prompt']");

    function enviarPrompt() {
        const texto = promptInput.value.trim();
        if (texto) {
            chatSystem.addPrompt(texto);
            promptInput.value = "";
        }
    }

    if (promptForm) {
        promptForm.addEventListener("submit", (e) => {
            e.preventDefault(); // Evitar recarga
            enviarPrompt();
        });
        
        const btnEnviar = promptForm.querySelector("button[type='submit']");
        if(btnEnviar) btnEnviar.addEventListener("click", (e) => {
             e.preventDefault();
             enviarPrompt();
        });
    }

    // C. Inicializar Dropdown (Selección de Modelo)
    // Cuando cambie, le avisamos al chatSystem
    new Dropdown('#dropdown1', (modeloSeleccionado) => {
        chatSystem.setAIModel(modeloSeleccionado);
    });
});


// ==========================================
// 4. ANIMACIONES Y VIDEO
// ==========================================

// Video Modal Logic
const videoBg = document.querySelector("#video-container-bg");
const videoContainer = document.querySelector("#video-container");

window.openVideo = function() { // Global para el HTML onclick
    if(!videoBg || !videoContainer) return;
    videoBg.classList.remove("tw-scale-0", "tw-opacity-0");
    videoBg.classList.add("tw-scale-100", "tw-opacity-100");
    videoContainer.classList.remove("tw-scale-0");
    videoContainer.classList.add("tw-scale-100");
    document.body.classList.add("modal-open");
};

window.closeVideo = function() { // Global para el HTML onclick
    if(!videoBg || !videoContainer) return;
    videoContainer.classList.add("tw-scale-0");
    videoContainer.classList.remove("tw-scale-100");
    setTimeout(() => {
        videoBg.classList.remove("tw-scale-100", "tw-opacity-100");
        videoBg.classList.add("tw-scale-0", "tw-opacity-0");
    }, 400);
    document.body.classList.remove("modal-open");
};

// Typed.js (Texto máquina de escribir)
if (typeof Typed !== 'undefined') {
    new Typed('#prompts-sample', {
        strings: ["¿Cómo aprender Python?", "¿Qué es un prompt?", "Explícame la fotosíntesis"],
        typeSpeed: 80,
        smartBackspace: true, 
        loop: true,
        backDelay: 2000,
    });
}

// GSAP Animations (Scroll Reveal)
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Inicializar elementos ocultos
    gsap.set(".reveal-up", { opacity: 0, y: "100%" });
    gsap.set("#dashboard", { scale: 1, translateY: 0, rotateX: 0, opacity: 1 });

    const sections = gsap.utils.toArray("section");
    sections.forEach((sec) => {
        // Animación para cada sección
        gsap.to(sec.querySelectorAll(".reveal-up"), {
            scrollTrigger: {
                trigger: sec,
                start: "top 80%", // Inicia cuando el top de la sección llega al 80% de la pantalla
                end: "bottom 90%",
                // toggleActions: "play none none reverse" // Opcional: revertir al subir
            },
            opacity: 1,
            y: "0%",
            duration: 0.8,
            stagger: 0.2, // Efecto cascada
            ease: "power2.out"
        });
    });
}

// FAQ Accordion Logic
const faqAccordion = document.querySelectorAll('.faq-accordion');
faqAccordion.forEach(function (btn) {
    btn.addEventListener('click', function () {
        // Cerrar otros (opcional, si quieres que solo uno esté abierto a la vez)
        // faqAccordion.forEach(b => { if(b !== btn) { ... lógica para cerrar ... }});

        this.classList.toggle('active');
        let content = this.nextElementSibling;
        let icon = this.querySelector("i");

        if (content.style.maxHeight) {
            content.style.maxHeight = null;
            content.style.padding = '0px 18px';
            if (icon) icon.style.transform = "rotate(0deg)";
        } else {
            content.style.maxHeight = content.scrollHeight + 40 + "px";
            content.style.padding = '20px 18px';
            if (icon) icon.style.transform = "rotate(45deg)";
        }
    });
});