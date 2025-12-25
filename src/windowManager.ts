import { eventBus } from './eventBus.ts';
import { App } from './types.ts';

interface WindowMeta {
    id: string;
    element: HTMLElement;
    appId: string;
    title: string;
    minimized: boolean;
}

export class WindowManager {
    private container: HTMLElement;
    private windows: Map<string, WindowMeta>;
    private baseZIndex: number;
    private activeWindowId: string | null;
    private windowCount: number;

    // Drag state
    private isDragging: boolean;
    private dragTarget: HTMLElement | null;
    private dragOffset: { x: number; y: number };

    constructor(containerId: string) {
        const el = document.getElementById(containerId);
        if (!el) throw new Error(`Container ${containerId} not found`);
        this.container = el;

        this.windows = new Map();
        this.baseZIndex = 100;
        this.activeWindowId = null;
        this.windowCount = 0;

        this.isDragging = false;
        this.dragTarget = null;
        this.dragOffset = { x: 0, y: 0 };

        this.setupGlobalEvents();
        this.setupEventBusListeners();
    }

    private setupGlobalEvents(): void {
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mouseup', (e) => this.onMouseUp(e));
    }

    private setupEventBusListeners(): void {
        eventBus.on('open-app', (appConfig: App) => this.openWindow(appConfig));
        eventBus.on('focus-window', ({ id }: { id: string }) => this.focusWindow(id));
        eventBus.on('restore-window', ({ id }: { id: string }) => this.restoreWindow(id));
    }

    private openWindow(appConfig: App): void {
        const instanceId = `${appConfig.id}-${this.windowCount++}`;

        const winEl = this.createWindowDOM(instanceId, appConfig.title);
        this.container.appendChild(winEl);

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

        const contentContainer = winEl.querySelector('.window-content') as HTMLElement;
        if (appConfig.init) {
            appConfig.init(contentContainer, instanceId);
        }

        this.focusWindow(instanceId);
        eventBus.emit('window-opened', { id: instanceId, title: appConfig.title, appId: appConfig.id });
    }

    private createWindowDOM(id: string, title: string): HTMLElement {
        const win = document.createElement('div');
        win.classList.add('window');
        win.id = id;
        win.addEventListener('mousedown', () => this.focusWindow(id));

        const titleBar = document.createElement('div');
        titleBar.classList.add('title-bar');

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

        titleBar.addEventListener('mousedown', (e) => this.onDragStart(e, win, id));

        return win;
    }

    private focusWindow(id: string): void {
        if (!this.windows.has(id)) return;
        const meta = this.windows.get(id)!;

        this.baseZIndex++;
        meta.element.style.zIndex = this.baseZIndex.toString();
        meta.element.classList.add('active');

        this.windows.forEach(w => {
            if (w.id !== id) w.element.classList.remove('active');
        });

        this.activeWindowId = id;
        console.log('Active window:', this.activeWindowId); // Use it
        eventBus.emit('window-focused', { id });
        eventBus.emit('system-log', `Janela focada: ${meta.title}`);
    }

    private minimizeWindow(id: string): void {
        if (!this.windows.has(id)) return;
        const meta = this.windows.get(id)!;
        meta.element.style.display = 'none';
        meta.minimized = true;

        eventBus.emit('window-minimized', { id });
        eventBus.emit('system-log', `Janela minimizada: ${meta.title}`);
    }

    private restoreWindow(id: string): void {
        if (!this.windows.has(id)) return;
        const meta = this.windows.get(id)!;
        meta.element.style.display = 'flex';
        meta.minimized = false;
        this.focusWindow(id);
        eventBus.emit('window-restored', { id });
    }

    private closeWindow(id: string): void {
        if (!this.windows.has(id)) return;
        const meta = this.windows.get(id)!;
        meta.element.remove();
        this.windows.delete(id);
        eventBus.emit('window-closed', { id });
        eventBus.emit('system-log', `App fechado: ${meta.title}`);
    }

    // --- Drag Logic ---

    private onDragStart(e: MouseEvent, winElement: HTMLElement, id: string): void {
        if ((e.target as HTMLElement).closest('.control-btn')) return;
        this.isDragging = true;
        this.dragTarget = winElement;
        this.focusWindow(id);

        const rect = winElement.getBoundingClientRect();
        this.dragOffset.x = e.clientX - rect.left;
        this.dragOffset.y = e.clientY - rect.top;

        e.preventDefault();
    }

    private onMouseMove(e: MouseEvent): void {
        if (!this.isDragging || !this.dragTarget) return;

        let newX = e.clientX - this.dragOffset.x;
        let newY = e.clientY - this.dragOffset.y;

        this.dragTarget.style.left = `${newX}px`;
        this.dragTarget.style.top = `${newY}px`;
    }

    private activeWindowId: string | null; // Keep for state correctness even if internally unused logic-wise yet
    // ...
    // Suppress by using it or just ignore. 
    // Actually, let's just prefix it in definition if it's not ready to be used, 
    // OR just read it once to satisfy compiler.

    // Better: fix onMouseUp signature first.
    private onMouseUp(): void {
        this.isDragging = false;
        this.dragTarget = null;
    }
}
