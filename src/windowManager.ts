// import { eventBus } from './eventBus.js'; -> Globals now

class WindowManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.windows = new Map(); // id -> { element, zIndex, ... }
        this.baseZIndex = 100;
        this.activeWindowId = null;
        this.windowCount = 0;

        // Global drag state
        this.isDragging = false;
        this.dragTarget = null;
        this.dragOffset = { x: 0, y: 0 };

        this.setupGlobalEvents();
        this.setupEventBusListeners();
    }

    setupGlobalEvents() {
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mouseup', (e) => this.onMouseUp(e));
    }

    setupEventBusListeners() {
        eventBus.on('open-app', (appConfig) => this.openWindow(appConfig));
        eventBus.on('focus-window', ({ id }) => this.focusWindow(id));
        eventBus.on('restore-window', ({ id }) => this.restoreWindow(id));
    }

    openWindow(appConfig) {
        // Check if allow multiple instances or not. For this MVP, let's allow multiple or single based on ID.
        // If we want single instance, we check if it exists.
        // For simplicity/MVP, let's assume one instance per app ID for now, OR generate unique IDs.
        // Let's generate a unique instance ID.
        const instanceId = `${appConfig.id}-${this.windowCount++}`;

        const winEl = this.createWindowDOM(instanceId, appConfig.title);
        this.container.appendChild(winEl);

        // Position - cascade simple logic
        const offset = (this.windowCount % 10) * 20;
        winEl.style.top = `${50 + offset}px`;
        winEl.style.left = `${50 + offset}px`;

        this.windows.set(instanceId, {
            element: winEl,
            id: instanceId,
            appId: appConfig.id,
            title: appConfig.title,
            minimized: false
        });

        // Initialize App Content
        const contentContainer = winEl.querySelector('.window-content');
        if (appConfig.init) {
            appConfig.init(contentContainer, instanceId);
        }

        this.focusWindow(instanceId);
        eventBus.emit('window-opened', { id: instanceId, title: appConfig.title, appId: appConfig.id });
    }

    createWindowDOM(id, title) {
        const win = document.createElement('div');
        win.classList.add('window');
        win.id = id;
        win.addEventListener('mousedown', () => this.focusWindow(id));

        const titleBar = document.createElement('div');
        titleBar.classList.add('title-bar');

        // Dragging start
        titleBar.addEventListener('mousedown', (e) => this.onDragStart(e, wins, id));

        const titleText = document.createElement('span');
        titleText.classList.add('title-text');
        titleText.innerText = title;

        const controls = document.createElement('div');
        controls.classList.add('window-controls');

        const minBtn = document.createElement('button');
        minBtn.classList.add('control-btn');
        minBtn.innerText = '_';
        minBtn.title = 'Minimizar';
        minBtn.onclick = (e) => { e.stopPropagation(); this.minimizeWindow(id); };

        const closeBtn = document.createElement('button');
        closeBtn.classList.add('control-btn');
        closeBtn.innerText = 'X';
        closeBtn.title = 'Fechar';
        closeBtn.onclick = (e) => { e.stopPropagation(); this.closeWindow(id); };

        controls.appendChild(minBtn);
        controls.appendChild(closeBtn);
        titleBar.appendChild(titleText);
        titleBar.appendChild(controls);

        const content = document.createElement('div');
        content.classList.add('window-content');

        win.appendChild(titleBar);
        win.appendChild(content);

        // Need the variable 'win' inside the event listener for drag, 
        // passing 'win' directly to onDragStart via closure or bind
        titleBar.removeEventListener('mousedown', (e) => this.onDragStart(e, wins, id)); // remove fail safe placeholder
        titleBar.addEventListener('mousedown', (e) => this.onDragStart(e, win, id));

        return win;
    }

    focusWindow(id) {
        if (!this.windows.has(id)) return;
        const meta = this.windows.get(id);

        // Bring to front
        this.baseZIndex++;
        meta.element.style.zIndex = this.baseZIndex;
        meta.element.classList.add('active');

        // Remove active class from others
        this.windows.forEach(w => {
            if (w.id !== id) w.element.classList.remove('active');
        });

        this.activeWindowId = id;
        // Don't emit 'window-focused' if we are here because of it? 
        // Actually, emit so Taskbar updates style
        eventBus.emit('window-focused', { id });
        eventBus.emit('system-log', `Janela focada: ${meta.title}`);
    }

    minimizeWindow(id) {
        if (!this.windows.has(id)) return;
        const meta = this.windows.get(id);
        meta.element.style.display = 'none';
        meta.minimized = true;

        eventBus.emit('window-minimized', { id });
        eventBus.emit('system-log', `Janela minimizada: ${meta.title}`);
    }

    restoreWindow(id) {
        if (!this.windows.has(id)) return;
        const meta = this.windows.get(id);
        meta.element.style.display = 'flex';
        meta.minimized = false;
        this.focusWindow(id);
        eventBus.emit('window-restored', { id });
    }

    closeWindow(id) {
        if (!this.windows.has(id)) return;
        const meta = this.windows.get(id);
        meta.element.remove();
        this.windows.delete(id);
        eventBus.emit('window-closed', { id });
        eventBus.emit('system-log', `App fechado: ${meta.title}`);
    }

    // --- Drag Logic ---

    onDragStart(e, winElement, id) {
        if (e.target.closest('.control-btn')) return; // Ignore if clicking buttons
        this.isDragging = true;
        this.dragTarget = winElement;
        this.focusWindow(id);

        const rect = winElement.getBoundingClientRect();
        this.dragOffset.x = e.clientX - rect.left;
        this.dragOffset.y = e.clientY - rect.top;

        e.preventDefault(); // Prevent text selection
    }

    onMouseMove(e) {
        if (!this.isDragging || !this.dragTarget) return;

        let newX = e.clientX - this.dragOffset.x;
        let newY = e.clientY - this.dragOffset.y;

        // Basic bounds checking (optional, but good)
        // newX = Math.max(0, Math.min(newX, window.innerWidth - this.dragTarget.offsetWidth));
        // newY = Math.max(0, Math.min(newY, window.innerHeight - 40 - this.dragTarget.offsetHeight));

        this.dragTarget.style.left = `${newX}px`;
        this.dragTarget.style.top = `${newY}px`;
    }

    onMouseUp(e) {
        this.isDragging = false;
        this.dragTarget = null;
    }
}
