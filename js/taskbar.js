// import { eventBus } from './eventBus.js';

class Taskbar {
    constructor() {
        this.clockEl = document.getElementById('clock');
        this.taskListEl = document.getElementById('task-list');
        this.startBtn = document.getElementById('start-btn');
        this.tasks = new Map(); // windowId -> element

        this.startClock();
        this.setupListeners();
        this.setupStartMenu();
    }

    setupListeners() {
        eventBus.on('window-opened', (data) => this.addTask(data));
        eventBus.on('window-closed', (data) => this.removeTask(data.id));
        eventBus.on('window-focused', (data) => this.highlightTask(data.id));
    }

    setupStartMenu() {
        this.startBtn.addEventListener('click', () => {
            // For MVP, "Start" could just minimize all windows to show desktop, or log something.
            // Or maybe reset? Let's make it toggle minimize all for now or just log.
            // Prompt says "Botão inicial simples".
            console.log("Start clicked");
            eventBus.emit('system-log', 'Botão Início clicado');
        });
    }

    startClock() {
        const updateTime = () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            this.clockEl.innerText = `${hours}:${minutes}`;
        };
        updateTime();
        setInterval(updateTime, 1000);
    }

    addTask({ id, title, appId }) {
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

    removeTask(id) {
        if (this.tasks.has(id)) {
            this.tasks.get(id).remove();
            this.tasks.delete(id);
        }
    }

    highlightTask(id) {
        this.tasks.forEach((btn, key) => {
            if (key === id) btn.classList.add('active');
            else btn.classList.remove('active');
        });
    }
}
