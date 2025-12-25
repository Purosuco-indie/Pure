export interface App {
    id: string;
    title: string;
    init: (container: HTMLElement, windowId: string) => void;
}

export interface WindowConfig {
    id: string;
    title: string;
    appId: string;
}

export interface FileData {
    id: string;
    name: string;
    type: 'text' | 'other';
    content: string;
    createdAt: string;
    deleted: boolean;
}
