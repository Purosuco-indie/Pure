import { FileData } from './types.ts';
import { eventBus } from './eventBus.ts';

class VirtualFileSystem {
    private storageKey: string;
    private cache: FileData[];

    constructor() {
        this.storageKey = 'purosuco_virtual_fs';
        this.cache = this.load();

        // Seed if empty
        if (this.cache.length === 0) {
            this.createFile('bem_vindo.txt', 'text', 'Bem vindo ao Puro Suco OS!');
            this.createFile('todo_list.txt', 'text', '- Fazer café\n- Dominar o mundo');
        }
    }

    private load(): FileData[] {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    private save(): void {
        localStorage.setItem(this.storageKey, JSON.stringify(this.cache));
        eventBus.emit('fs-change');
    }

    public getFiles(includeDeleted: boolean = false): FileData[] {
        return this.cache.filter(f => !!f.deleted === includeDeleted); // ensure boolean comparison
    }

    public createFile(name: string, type: 'text' | 'other', content: string = ''): FileData {
        const file: FileData = {
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

    public deleteFile(id: string): void {
        const file = this.cache.find(f => f.id === id);
        if (file) {
            file.deleted = true;
            this.save();
        }
    }

    public restoreFile(id: string): void {
        const file = this.cache.find(f => f.id === id);
        if (file) {
            file.deleted = false;
            this.save();
        }
    }

    public permanentDelete(id: string): void {
        this.cache = this.cache.filter(f => f.id !== id);
        this.save();
    }
}

export const fileSystem = new VirtualFileSystem();
