export const Rascunho = {
    id: 'rascunho',
    title: 'Rascunho',
    init: (container, windowId) => {
        const textarea = document.createElement('textarea');
        textarea.classList.add('rascunho-editor');
        textarea.placeholder = 'Escreva aqui...';

        // Load saved content
        const saved = localStorage.getItem('purosuco_rascunho');
        if (saved) {
            textarea.value = saved;
        }

        // Auto-save on keyup
        textarea.addEventListener('keyup', () => {
            localStorage.setItem('purosuco_rascunho', textarea.value);
        });

        container.appendChild(textarea);
    }
};
