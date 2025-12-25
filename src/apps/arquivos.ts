// Requires fileSystem global

const Arquivos = {
    id: 'arquivos',
    title: 'Arquivos',
    init: (container, windowId) => {
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.height = '100%';

        // Toolbar
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

        // File List Area
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
            const files = fileSystem.getFiles(false); // Only non-deleted

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

                // Icon placeholder
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

                // Simple click to log, maybe integrate with Rascunho later to open?
                // For MVP: Right click or double click to Delete?
                // Let's add a small "del" button on hover or keep it simple: click to select, UI button to delete? 
                // Let's do: Item click -> Open (alert content), Item right click -> Delete.

                item.onclick = () => {
                    alert(`Conteúdo de ${file.name}:\n\n${file.content}`);
                };

                // Add delete button inside item for visibility in MVP
                const delBtn = document.createElement('button');
                delBtn.innerText = 'X';
                delBtn.style.marginTop = '5px';
                delBtn.style.fontSize = '10px';
                delBtn.style.border = '1px solid black';
                delBtn.style.background = 'white';
                delBtn.onclick = (e) => {
                    e.stopPropagation();
                    fileSystem.deleteFile(file.id);
                    // Render will be triggered by eventBus
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

        // Listen for FS changes
        const onFsChange = () => render();
        eventBus.on('fs-change', onFsChange);

        // Cleanup listener when scope is lost? 
        // In this MVP structure, we don't have a clean way to unsubscribe when window closes easily 
        // without adding logic to WindowManager to call a 'destroy' method on the app.
        // We will accept the minor leak for now or implement destroy.
    }
};
