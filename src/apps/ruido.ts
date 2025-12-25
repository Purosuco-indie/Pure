// import { eventBus } from '../eventBus.js';

const Ruido = {
    id: 'ruido',
    title: 'Ruído',
    init: (container, windowId) => {
        const logContent = document.createElement('div');
        logContent.classList.add('ruido-log');
        container.appendChild(logContent);

        const addLog = (msg, isError = false) => {
            const entry = document.createElement('div');
            entry.classList.add('ruido-entry');
            if (isError) entry.classList.add('error');

            const time = new Date().toLocaleTimeString();
            entry.innerText = `[${time}] ${msg}`;

            logContent.prepend(entry); // Newest on top
        };

        // Initial message
        addLog('Sistema de monitoramento iniciado.');

        // Subscribe to system logs
        // Note: For a real app, we might want to store the handler references to remove them when window closes.
        // But for MVP, let's keep it simple (memory leak isn't huge for this scale) or handle it better if time.
        // Let's create a wrapper to handle cleanup if we had a destroy method in WindowManager.
        // For now, simpler:

        const logHandler = ({ data }) => {
            // "data" coming from the wildcard event might be complex, or from specific system-log event
            // Let's reuse 'system-log' event specifically for cleaner text
            // But we can also show all raw events for "Noise/Ruído" effect
        };

        eventBus.on('system-log', (msg) => {
            // Only update if this element handles it. 
            // Currently this listener is global, so all open Ruído windows will update. This is acceptable for MVP.
            if (document.body.contains(logContent)) {
                addLog(msg);
            }
        });

        // Also listen to raw events for "noise"
        eventBus.on('*', (payload) => {
            if (document.body.contains(logContent)) {
                // Filter out system-log to avoid double printing if we use that
                if (payload.event === 'system-log') return;

                // Start simplistically
                // addLog(`EVENTO: ${payload.event}`);
            }
        });
    }
};
