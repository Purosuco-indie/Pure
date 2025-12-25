import { WindowManager } from './windowManager.js';
import { Taskbar } from './taskbar.js';
import { Desktop } from './desktop.js';
import { eventBus } from './eventBus.js';

import { Rascunho } from './apps/rascunho.js';
import { Ruido } from './apps/ruido.js';
import { Rodar } from './apps/rodar.js';

document.addEventListener('DOMContentLoaded', () => {
    // Defines available apps
    const apps = [Rascunho, Ruido, Rodar];

    // Initialize Systems
    const wm = new WindowManager('windows-container');
    const taskbar = new Taskbar();
    const desktop = new Desktop(apps);

    console.log('Puro Suco OS Initialized');
    eventBus.emit('system-log', 'Sistema iniciado com sucesso.');
});
