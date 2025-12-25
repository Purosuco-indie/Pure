import { App } from '../types.ts';
import { fileSystem } from '../fileSystem.ts';
import { eventBus } from '../eventBus.ts';

export const Arquivos: App = {
    id: 'arquivos',
    title: 'Arquivos',
    init: (container: HTMLElement, windowId: string) => {
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.height = '100%';

        const toolbar = document.createElement('div');
        toolbar.style.padding = '5px';
        toolbar.style.borderBottom = '2px solid black';
        toolbar.style.display = 'flex';
        toolbar.style.gap = '10px';

        const newBtn = document.createElement('button');
        newBtn.innerText = '+ Novo Arquivo';
        newBtn.style.background = 'white';
        newBtn.style.border = '1px solid black';
        newBtn.style.cursor = 'pointer';

        toolbar.appendChild(newBtn);
        container.appendChild(toolbar);

        const listArea = document.createElement('div');
        listArea.style.flex = '1';
        listArea.style.padding = '10px';
        listArea.style.overflowY = 'auto';
        listArea.style.display = 'grid';
        listArea.style.gridTemplateColumns = 'repeat(auto-fill, minmax(80px, 1fr))';
        listArea.style.gap = '10px';

        container.appendChild(listArea);

        const render = () => {
            listArea.innerHTML = '';
            const files = fileSystem.getFiles(false);

            if (files.length === 0) {
                listArea.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color:#999;">Pasta vazia</div>';
                return;
            }

            files.forEach(file => {
                const item = document.createElement('div');
                item.style.border = '1px solid black';
                item.style.padding = '5px';
                item.style.display = 'flex';
                item.style.flexDirection = 'column';
                item.style.alignItems = 'center';
                item.style.cursor = 'pointer';
                item.title = file.name;

                const icon = document.createElement('div');
                icon.innerText = 'DOC';
                icon.style.fontWeight = 'bold';
                icon.style.marginBottom = '5px';

                const label = document.createElement('div');
                label.innerText = file.name;
                label.style.fontSize = '12px';
                label.style.textAlign = 'center';
                label.style.wordBreak = 'break-all';

                item.appendChild(icon);
                item.appendChild(label);

                item.onclick = () => {
                    alert(`Conteúdo de ${file.name}:\n\n${file.content}`);
                };

                const delBtn = document.createElement('button');
                delBtn.innerText = 'X';
                delBtn.style.marginTop = '5px';
                delBtn.style.fontSize = '10px';
                delBtn.style.border = '1px solid black';
                delBtn.style.background = 'white';
                delBtn.onclick = (e) => {
                    e.stopPropagation();
                    fileSystem.deleteFile(file.id);
                };
                item.appendChild(delBtn);

                listArea.appendChild(item);
            });
        };

        newBtn.onclick = () => {
            const name = prompt('Nome do arquivo:', 'novo.txt');
            if (name) {
                const content = prompt('Conteúdo:', '');
                fileSystem.createFile(name, 'text', content || '');
            }
        };

        render();
        eventBus.on('fs-change', render);
    }
};

export const Lixeira: App = {
    id: 'lixeira',
    title: 'Lixeira',
    init: (container: HTMLElement, windowId: string) => {
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.height = '100%';

        const header = document.createElement('div');
        header.innerText = 'Itens excluídos';
        header.style.padding = '5px';
        header.style.borderBottom = '2px solid black';
        container.appendChild(header);

        const listArea = document.createElement('div');
        listArea.style.flex = '1';
        listArea.style.padding = '10px';
        listArea.style.overflowY = 'auto';

        container.appendChild(listArea);

        const render = () => {
            listArea.innerHTML = '';
            const files = fileSystem.getFiles(true);

            if (files.length === 0) {
                listArea.innerHTML = '<div style="text-align:center; color:#999; margin-top:20px;">Lixeira vazia</div>';
                return;
            }

            files.forEach(file => {
                const row = document.createElement('div');
                row.style.border = '1px dashed black';
                row.style.marginBottom = '5px';
                row.style.padding = '5px';
                row.style.display = 'flex';
                row.style.justifyContent = 'space-between';
                row.style.alignItems = 'center';

                const info = document.createElement('span');
                info.innerText = file.name;

                const actions = document.createElement('div');
                actions.style.display = 'flex';
                actions.style.gap = '5px';

                const restoreBtn = document.createElement('button');
                restoreBtn.innerText = 'Restaurar';
                restoreBtn.style.border = '1px solid black';
                restoreBtn.style.background = 'white';
                restoreBtn.style.fontSize = '12px';
                restoreBtn.onclick = () => fileSystem.restoreFile(file.id);

                const delBtn = document.createElement('button');
                delBtn.innerText = 'Excluir';
                delBtn.style.border = '1px solid black';
                delBtn.style.background = 'white';
                delBtn.style.fontSize = '12px';
                delBtn.onclick = () => fileSystem.permanentDelete(file.id);

                actions.appendChild(restoreBtn);
                actions.appendChild(delBtn);

                row.appendChild(info);
                row.appendChild(actions);
                listArea.appendChild(row);
            });
        };

        render();
        eventBus.on('fs-change', render);
    }
};

export const Notas: App = {
    id: 'notas',
    title: 'Notas',
    init: (container: HTMLElement, windowId: string) => {
        container.style.display = 'flex';
        container.style.gap = '10px';
        container.style.height = '100%';

        const sidebar = document.createElement('div');
        sidebar.style.width = '120px';
        sidebar.style.borderRight = '2px solid black';
        sidebar.style.display = 'flex';
        sidebar.style.flexDirection = 'column';
        sidebar.style.gap = '5px';
        sidebar.style.paddingRight = '5px';

        const newBtn = document.createElement('button');
        newBtn.innerText = '+ Nova';
        newBtn.style.border = '2px solid black';
        newBtn.style.background = 'white';
        newBtn.style.cursor = 'pointer';
        newBtn.style.fontWeight = 'bold';

        const noteList = document.createElement('ul');
        noteList.style.listStyle = 'none';
        noteList.style.padding = '0';
        noteList.style.margin = '0';
        noteList.style.flex = '1';
        noteList.style.overflowY = 'auto';

        sidebar.appendChild(newBtn);
        sidebar.appendChild(noteList);

        const editorArea = document.createElement('div');
        editorArea.style.flex = '1';
        editorArea.style.display = 'flex';
        editorArea.style.flexDirection = 'column';
        editorArea.style.gap = '5px';

        const titleInput = document.createElement('input');
        titleInput.placeholder = 'Título da nota...';
        titleInput.style.border = '1px solid black';
        titleInput.style.padding = '5px';
        titleInput.style.fontFamily = 'monospace';
        titleInput.style.fontWeight = 'bold';

        const contentInput = document.createElement('textarea');
        contentInput.placeholder = 'Escreva aqui...';
        contentInput.style.flex = '1';
        contentInput.style.resize = 'none';
        contentInput.style.border = '1px solid black';
        contentInput.style.padding = '5px';
        contentInput.style.fontFamily = 'monospace';

        const controls = document.createElement('div');
        controls.style.display = 'flex';
        controls.style.gap = '5px';

        const saveBtn = document.createElement('button');
        saveBtn.innerText = 'Salvar';
        saveBtn.style.border = '1px solid black';
        saveBtn.style.background = 'white';
        saveBtn.style.cursor = 'pointer';

        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Excluir';
        deleteBtn.style.border = '1px solid black';
        deleteBtn.style.background = 'white';
        deleteBtn.style.cursor = 'pointer';

        controls.appendChild(saveBtn);
        controls.appendChild(deleteBtn);

        editorArea.appendChild(titleInput);
        editorArea.appendChild(contentInput);
        editorArea.appendChild(controls);

        container.appendChild(sidebar);
        container.appendChild(editorArea);

        interface Note {
            id: string;
            title: string;
            content: string;
        }

        let notes: Note[] = JSON.parse(localStorage.getItem('purosuco_notas') || '[]');
        let currentNoteId: string | null = null;

        const renderList = () => {
            noteList.innerHTML = '';
            notes.forEach(note => {
                const li = document.createElement('li');
                li.innerText = note.title || 'Sem título';
                li.style.cursor = 'pointer';
                li.style.padding = '2px';
                li.style.borderBottom = '1px dashed #ccc';

                if (note.id === currentNoteId) {
                    li.style.background = 'black';
                    li.style.color = 'white';
                }

                li.onclick = () => loadNote(note.id);
                noteList.appendChild(li);
            });
        };

        const loadNote = (id: string) => {
            currentNoteId = id;
            const note = notes.find(n => n.id === id);
            if (note) {
                titleInput.value = note.title;
                contentInput.value = note.content;
            }
            renderList();
        };

        const saveCurrent = () => {
            if (!currentNoteId) return;
            const noteIndex = notes.findIndex(n => n.id === currentNoteId);
            if (noteIndex > -1) {
                notes[noteIndex].title = titleInput.value;
                notes[noteIndex].content = contentInput.value;
                localStorage.setItem('purosuco_notas', JSON.stringify(notes));
                renderList();
                eventBus.emit('system-log', `Nota salva: ${titleInput.value}`);
            }
        };

        const createNew = () => {
            const newNote = {
                id: Date.now().toString(),
                title: 'Nova Nota',
                content: ''
            };
            notes.push(newNote);
            currentNoteId = newNote.id;
            localStorage.setItem('purosuco_notas', JSON.stringify(notes));
            loadNote(newNote.id);
            eventBus.emit('system-log', 'Nova nota criada');
        };

        const deleteCurrent = () => {
            if (!currentNoteId) return;
            notes = notes.filter(n => n.id !== currentNoteId);
            localStorage.setItem('purosuco_notas', JSON.stringify(notes));

            currentNoteId = null;
            titleInput.value = '';
            contentInput.value = '';
            renderList();
            eventBus.emit('system-log', 'Nota excluída');
        };

        newBtn.onclick = createNew;
        saveBtn.onclick = saveCurrent;
        deleteBtn.onclick = deleteCurrent;

        renderList();
    }
};

export const Rascunho: App = {
    id: 'rascunho',
    title: 'Rascunho',
    init: (container: HTMLElement, windowId: string) => {
        const textarea = document.createElement('textarea');
        textarea.classList.add('rascunho-editor');
        textarea.placeholder = 'Escreva aqui...';

        const saved = localStorage.getItem('purosuco_rascunho');
        if (saved) {
            textarea.value = saved;
        }

        textarea.addEventListener('keyup', () => {
            localStorage.setItem('purosuco_rascunho', textarea.value);
        });

        container.appendChild(textarea);
    }
};

export const Ruido: App = {
    id: 'ruido',
    title: 'Ruído',
    init: (container: HTMLElement, windowId: string) => {
        const logContent = document.createElement('div');
        logContent.classList.add('ruido-log');
        container.appendChild(logContent);

        const addLog = (msg: string, isError: boolean = false) => {
            const entry = document.createElement('div');
            entry.classList.add('ruido-entry');
            if (isError) entry.classList.add('error');

            const time = new Date().toLocaleTimeString();
            entry.innerText = `[${time}] ${msg}`;

            logContent.prepend(entry);
        };

        addLog('Sistema de monitoramento iniciado.');

        eventBus.on('system-log', (msg: string) => {
            if (document.body.contains(logContent)) {
                addLog(msg);
            }
        });

        eventBus.on('*', (payload: any) => {
            if (document.body.contains(logContent)) {
                if (payload.event === 'system-log') return;
            }
        });
    }
};

export const Rodar: App = {
    id: 'rodar',
    title: 'Rodar',
    init: (container: HTMLElement, windowId: string) => {
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 200;
        canvas.style.border = '1px solid black';
        canvas.style.background = '#eee';

        container.appendChild(canvas);

        const btn = document.createElement('button');
        btn.innerText = 'Iniciar / Parar';
        btn.style.marginTop = '5px';
        btn.style.padding = '5px';
        btn.style.border = '1px solid black';
        btn.style.background = 'white';
        btn.style.cursor = 'pointer';
        container.appendChild(btn);

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let x = 10;
        let y = 10;
        let dx = 2;
        let dy = 2;
        let running = false;
        let animId: number;

        const loop = () => {
            if (!running) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'black';
            ctx.fillRect(x, y, 20, 20);

            x += dx;
            y += dy;

            if (x + 20 > canvas.width || x < 0) dx = -dx;
            if (y + 20 > canvas.height || y < 0) dy = -dy;

            animId = requestAnimationFrame(loop);
        };

        btn.onclick = () => {
            running = !running;
            if (running) {
                loop();
            } else {
                cancelAnimationFrame(animId);
            }
        };
    }
};
