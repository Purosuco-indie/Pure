class VirtualFileSystem {
    constructor() {
        this.storageKey = 'purosuco_virtual_fs';
        this.cache = this.load();

        // Seed if empty
        if (this.cache.length === 0) {
            this.createFile('bem_vindo.txt', 'text', 'Bem vindo ao Puro Suco OS!');
            this.createFile('todo_list.txt', 'text', '- Fazer café\n- Dominar o mundo');
        }
    }

    load() {
        return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.cache));
        // Emit global change event so apps update
        if (typeof eventBus !== 'undefined') {
            eventBus.emit('fs-change');
        }
    }

    getFiles(includeDeleted = false) {
        return this.cache.filter(f => !!f.deleted === includeDeleted);
    }

    createFile(name, type, content = '') {
        const file = {
            id: Date.now().toString() + Math.random().toString().slice(2, 5),
            name,
            type,
            content,
            createdAt: new Date().toISOString(),
            deleted: false
        };
        this.cache.push(file);
        this.save();
        return file;
    }

    deleteFile(id) {
        const file = this.cache.find(f => f.id === id);
        if (file) {
            file.deleted = true;
            this.save();
        }
    }

    restoreFile(id) {
        const file = this.cache.find(f => f.id === id);
        if (file) {
            file.deleted = false;
            this.save();
        }
    }

    permanentDelete(id) {
        this.cache = this.cache.filter(f => f.id !== id);
        this.save();
    }
}

const fileSystem = new VirtualFileSystem();
