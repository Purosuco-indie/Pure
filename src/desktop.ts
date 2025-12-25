import { eventBus } from './eventBus.ts';
import { App } from './types.ts';

export class Desktop {
    private container: HTMLElement;
    private apps: App[];
    private draggingIcon: HTMLElement | null;
    private dragOffset: { x: number; y: number };
    private positions: Record<string, { left: string, top: string }>;

    constructor(apps: App[]) {
        this.container = document.getElementById('desktop')!;
        this.apps = apps;

        this.draggingIcon = null;
        this.dragOffset = { x: 0, y: 0 };
        this.positions = {};

        this.loadPositions();
        this.renderIcons();
        this.setupDragEvents();
    }

    private loadPositions(): void {
        this.positions = JSON.parse(localStorage.getItem('purosuco_icon_positions') || '{}');
    }

    private savePositions(): void {
        const positions: Record<string, { left: string, top: string }> = {};
        const icons = this.container.querySelectorAll('.desktop-icon');
        icons.forEach(icon => {
            const el = icon as HTMLElement;
            const appId = el.dataset.appId!;
            positions[appId] = {
                left: el.style.left,
                top: el.style.top
            };
        });
        localStorage.setItem('purosuco_icon_positions', JSON.stringify(positions));
    }

    private renderIcons(): void {
        this.container.innerHTML = '';

        this.apps.forEach((app, index) => {
            const iconEl = document.createElement('div');
            iconEl.classList.add('desktop-icon');
            iconEl.dataset.appId = app.id;

            if (this.positions[app.id]) {
                iconEl.style.left = this.positions[app.id].left;
                iconEl.style.top = this.positions[app.id].top;
            } else {
                const col = Math.floor(index / 6);
                const row = index % 6;
                iconEl.style.left = `${20 + col * 100}px`;
                iconEl.style.top = `${20 + row * 110}px`;
            }

            iconEl.addEventListener('dblclick', () => {
                eventBus.emit('open-app', app);
                eventBus.emit('system-log', `App aberto: ${app.title}`);
            });

            iconEl.addEventListener('mousedown', (e) => this.onDragStart(e, iconEl));

            const imgEl = document.createElement('div');
            imgEl.classList.add('icon-img');
            imgEl.innerText = app.title.substring(0, 2).toUpperCase();

            const labelEl = document.createElement('div');
            labelEl.classList.add('icon-label');
            labelEl.innerText = app.title;

            iconEl.appendChild(imgEl);
            iconEl.appendChild(labelEl);
            this.container.appendChild(iconEl);
        });
    }

    private setupDragEvents(): void {
        document.addEventListener('mousemove', (e) => this.onDragMove(e));
        document.addEventListener('mouseup', () => this.onDragEnd());
    }

    private onDragStart(e: MouseEvent, iconEl: HTMLElement): void {
        e.preventDefault();
        this.draggingIcon = iconEl;

        const rect = iconEl.getBoundingClientRect();
        this.dragOffset.x = e.clientX - rect.left;
        this.dragOffset.y = e.clientY - rect.top;

        iconEl.style.zIndex = '100';
        iconEl.style.border = '1px dashed black';
    }

    private onDragMove(e: MouseEvent): void {
        if (!this.draggingIcon) return;

        const containerRect = this.container.getBoundingClientRect();

        let newX = e.clientX - containerRect.left - this.dragOffset.x;
        let newY = e.clientY - containerRect.top - this.dragOffset.y;

        this.draggingIcon.style.left = `${newX}px`;
        this.draggingIcon.style.top = `${newY}px`;
    }

    private onDragEnd(): void {
        if (this.draggingIcon) {
            this.draggingIcon.style.zIndex = '';
            this.draggingIcon.style.border = '1px solid transparent'; // Reset to CSS default
            this.draggingIcon = null;
            this.savePositions();
        }
    }
}
