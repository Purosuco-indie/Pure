import { WindowManager } from './windowManager.ts';
import { Taskbar } from './taskbar.ts';
import { Desktop } from './desktop.ts';
import { eventBus } from './eventBus.ts';

import { Rascunho, Ruido, Rodar, Notas, Arquivos, Lixeira } from './apps/all.ts';

document.addEventListener('DOMContentLoaded', () => {
    // Defines available apps
    const apps = [Arquivos, Lixeira, Notas, Rascunho, Ruido, Rodar];

    // Initialize Systems
    const wm = new WindowManager('windows-container');
    const taskbar = new Taskbar();
    const desktop = new Desktop(apps);

    console.log('Puro Suco OS Initialized');
    eventBus.emit('system-log', 'Sistema iniciado com sucesso.');
});
