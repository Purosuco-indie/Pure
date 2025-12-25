import { eventBus } from './eventBus.ts';

export class Taskbar {
    private clockEl: HTMLElement;
    private taskListEl: HTMLElement;
    private startBtn: HTMLElement;
    private tasks: Map<string, HTMLElement>;

    constructor() {
        this.clockEl = document.getElementById('clock')!;
        this.taskListEl = document.getElementById('task-list')!;
        this.startBtn = document.getElementById('start-btn')!;
        this.tasks = new Map();

        this.startClock();
        this.setupListeners();
        this.setupStartMenu();
    }

    private setupListeners(): void {
        eventBus.on('window-opened', (data: any) => this.addTask(data));
        eventBus.on('window-closed', (data: any) => this.removeTask(data.id));
        eventBus.on('window-focused', (data: any) => this.highlightTask(data.id));
    }

    private setupStartMenu(): void {
        this.startBtn.addEventListener('click', () => {
            console.log("Start clicked");
            eventBus.emit('system-log', 'Botão Início clicado');
        });
    }

    private startClock(): void {
        const updateTime = () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            this.clockEl.innerText = `${hours}:${minutes}`;
        };
        updateTime();
        setInterval(updateTime, 1000);
    }

    private addTask({ id, title }: { id: string, title: string }): void {
        const btn = document.createElement('div');
        btn.classList.add('task-item');
        btn.dataset.id = id;
        btn.innerText = title;

        btn.onclick = () => {
            eventBus.emit('restore-window', { id });
            eventBus.emit('focus-window', { id });
        };

        this.taskListEl.appendChild(btn);
        this.tasks.set(id, btn);
    }

    private removeTask(id: string): void {
        if (this.tasks.has(id)) {
            this.tasks.get(id)!.remove();
            this.tasks.delete(id);
        }
    }

    private highlightTask(id: string): void {
        this.tasks.forEach((btn, key) => {
            if (key === id) btn.classList.add('active');
            else btn.classList.remove('active');
        });
    }
}
