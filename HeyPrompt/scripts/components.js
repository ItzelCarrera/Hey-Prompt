class Dropdown {
    constructor(selector, onChange) {
        this.dropdown = document.querySelector(selector);
        if (!this.dropdown) return; // Protección si no existe el elemento

        this.toggleButton = this.dropdown.querySelector('.dropdown-toggle');
        this.menu = this.dropdown.querySelector('.dropdown-menu');
        this.dropDownInput = this.dropdown.querySelector(".dropdown-input");
        this.onChange = onChange;
        
        // Bindings para no perder el contexto 'this'
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.closeDropdown = this.closeDropdown.bind(this);
        this.selectItem = this.selectItem.bind(this);

        // Event Listeners
        this.toggleButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita que el click llegue al document inmediatamente
            this.toggleDropdown();
        });

        this.lists = this.dropdown.querySelectorAll('li');
        this.lists.forEach(e => {
            e.addEventListener("click", () => this.selectItem(e));
        });

        // Iniciar cerrado
        this.menu.style.display = 'none';
    }
  
    toggleDropdown() {
        if (this.menu.style.display === 'block') {
            this.closeDropdown();
        } else {
            this.menu.style.display = 'block';
            // Agregamos el listener para cerrar solo cuando está abierto
            document.addEventListener('click', this.closeDropdown);
        }
    }

    selectItem(ele) {
        const selectedInput = this.toggleButton.querySelector(".dropdown-select-text");
        const selectIcon = this.toggleButton.querySelector(".dropdown-select-icon");
        const newValue = ele.querySelector(".dropdown-text").innerText.trim();

        // Actualizar Icono si existe
        const newIconImg = ele.querySelector(".dropdown-menu-icon");
        if (selectIcon && newIconImg) {
            selectIcon.style.visibility = "";
            selectIcon.setAttribute("src", newIconImg.src);
        }

        // Actualizar Texto
        selectedInput.innerText = newValue;
        
        // Actualizar Input oculto (para formularios)
        if (this.dropDownInput) this.dropDownInput.value = newValue;

        // Callback al index.js
        if (this.onChange) this.onChange(newValue);

        this.closeDropdown();
    }

    closeDropdown() {
        this.menu.style.display = 'none';
        document.removeEventListener('click', this.closeDropdown);
    }
}


class Prompt {
    constructor(target, onMaxPromptsReached) {
        this.playground = document.querySelector(target);
        if (!this.playground) return;

        this.promptWindow = this.playground.querySelector(".prompt-container");
        this.chatModel = "gpt 4o";
        this.messageCount = 0;
        this.maxPrompts = 3;
        this.onMaxPromptsReached = onMaxPromptsReached; // Función para mostrar el popup de registro

        // Limpiar mensaje inicial si existe
        this.hasClearedWelcome = false;
    }

    setAIModel(model) {
        this.chatModel = model.toLowerCase();
        console.log(`Modelo cambiado a: ${this.chatModel}`);
    }

    // Lógica de validación educativa (MOVIDA AQUÍ DESDE INDEX.JS)
    analizarPromptEducativo(texto) {
        const lower = texto.toLowerCase();
        
        if (texto.length < 15) {
            return "⚠️ <b>PROMPT MUY CORTO:</b>\nNecesito más información. Intenta escribir una oración completa.\nEjemplo: 'Actúa como un profesor y explícame...'";
        }
        
        const tieneRol = ["actúa", "actua", "eres", "experto", "rol", "pretende", "como un"].some(w => lower.includes(w));
        if (!tieneRol) {
            return "💡 <b>CONSEJO:</b>\nTu prompt mejoraría si asignas un ROL.\nEjemplo: 'Actúa como un experto en marketing...'";
        }

        const tieneFormato = ["lista", "tabla", "codigo", "código", "resumen", "paso a paso", "ensayo"].some(w => lower.includes(w));
        if (!tieneFormato) {
            return "ℹ️ <b>TIP DE FORMATO:</b>\nEspecifica cómo quieres la respuesta.\nEjemplo: '...dámelo en una lista de puntos'.";
        }

        return `✅ <b>¡EXCELENTE PROMPT!</b>\nEstás usando el modelo <b>${this.chatModel.toUpperCase()}</b>.\nHas incluido contexto, rol y formato.`;
    }

    clearWelcomeMessage() {
        if (!this.hasClearedWelcome) {
            this.promptWindow.innerHTML = "";
            this.promptWindow.classList.add("tw-pt-4");
            this.hasClearedWelcome = true;
        }
    }

    addPrompt(msg) {
        // 1. Verificar límite de mensajes
        if (this.messageCount >= this.maxPrompts) {
            if (this.onMaxPromptsReached) this.onMaxPromptsReached();
            return; // Detener ejecución
        }

        this.clearWelcomeMessage();
        this.messageCount++;

        // 2. Pintar mensaje del usuario
        const textDiv = document.createElement("div");
        textDiv.className = "tw-w-fit tw-ml-auto tw-p-3 tw-rounded-xl tw-rounded-tr-none tw-bg-gray-200 dark:tw-bg-[#262626] tw-text-right tw-text-gray-800 dark:tw-text-gray-200";
        textDiv.innerText = msg;

        const wrapper = document.createElement("div");
        wrapper.className = "tw-w-full tw-flex tw-p-2";
        wrapper.appendChild(textDiv);
        this.promptWindow.appendChild(wrapper);

        this.scrollToBottom();

        // 3. Simular pensamiento y respuesta de la IA
        setTimeout(() => {
            const feedback = this.analizarPromptEducativo(msg);
            this.addAIResponse(feedback);
        }, 800);
    }

    addAIResponse(msg) {
        const textDiv = document.createElement("div");
        textDiv.className = "tw-w-fit tw-mr-auto tw-p-3 tw-rounded-xl tw-rounded-tl-none tw-bg-indigo-100 dark:tw-bg-indigo-900 tw-text-indigo-900 dark:tw-text-indigo-100 tw-whitespace-pre-line";
        textDiv.innerHTML = `<strong class="tw-block tw-mb-1">🤖 Mentor IA:</strong>${msg}`;

        const wrapper = document.createElement("div");
        wrapper.className = "tw-w-full tw-flex tw-p-2";
        wrapper.appendChild(textDiv);
        this.promptWindow.appendChild(wrapper);

        this.scrollToBottom();
    }

    scrollToBottom() {
        setTimeout(() => {
            this.promptWindow.scrollTop = this.promptWindow.scrollHeight;
        }, 150);
    }
}