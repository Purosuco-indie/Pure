class EventBus {
    constructor() {
        this.listeners = {};
    }

    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    off(event, callback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }

    emit(event, data = {}) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
        // Also emit a wildcard for "Ruído" app to log everything
        if (event !== '*') {
            this.emit('*', { event, data });
        }
    }
}

export const eventBus = new EventBus();
