type EventHandler = (data: any) => void;

class EventBus {
    private listeners: Record<string, EventHandler[]>;

    constructor() {
        this.listeners = {};
    }

    on(event: string, callback: EventHandler): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    off(event: string, callback: EventHandler): void {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }

    emit(event: string, data: any = {}): void {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
        if (event !== '*') {
            this.emit('*', { event, data });
        }
    }
}

export const eventBus = new EventBus();
