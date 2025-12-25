// Requires fileSystem global

const Lixeira = {
    id: 'lixeira',
    title: 'Lixeira',
    init: (container, windowId) => {
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
            const files = fileSystem.getFiles(true); // Only deleted

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
