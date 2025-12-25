const Notas = {
    id: 'notas',
    title: 'Notas',
    init: (container, windowId) => {
        // Layout: Sidebar (List) + Main (Editor)
        container.style.display = 'flex';
        container.style.gap = '10px';
        container.style.height = '100%';

        // --- Sidebar ---
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

        // --- Main Editor ---
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

        // --- Logic ---
        let notes = JSON.parse(localStorage.getItem('purosuco_notas') || '[]');
        let currentNoteId = null;

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

        const loadNote = (id) => {
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
            // Save immediately so it exists
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

        // Bindings
        newBtn.onclick = createNew;
        saveBtn.onclick = saveCurrent;
        deleteBtn.onclick = deleteCurrent;

        // Auto-save on typing? Optional. Let's stick to manual save button for "raw" feel as per prompt, 
        // but user might expect auto. Let's do manual for now as it's safer.

        renderList();
    }
};
