// Imports removed. Relying on global variables loaded via <script> tags.

document.addEventListener('DOMContentLoaded', () => {
    // Defines available apps (Globals)
    const apps = [Rascunho, Ruido, Rodar, Notas];

    // Initialize Systems (Globals)
    const wm = new WindowManager('windows-container');
    const taskbar = new Taskbar();
    const desktop = new Desktop(apps);

    console.log('Puro Suco OS Initialized');
    eventBus.emit('system-log', 'Sistema iniciado com sucesso.');
});
