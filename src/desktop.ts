// import { eventBus } from './eventBus.js';

class Desktop {
    constructor(apps) {
        this.container = document.getElementById('desktop');
        this.apps = apps;

        // Drag state
        this.draggingIcon = null;
        this.dragOffset = { x: 0, y: 0 };

        this.loadPositions();
        this.renderIcons();
        this.setupDragEvents();
    }

    loadPositions() {
        this.positions = JSON.parse(localStorage.getItem('purosuco_icon_positions') || '{}');
    }

    savePositions() {
        const positions = {};
        const icons = this.container.querySelectorAll('.desktop-icon');
        icons.forEach(icon => {
            const appId = icon.dataset.appId;
            positions[appId] = {
                left: icon.style.left,
                top: icon.style.top
            };
        });
        localStorage.setItem('purosuco_icon_positions', JSON.stringify(positions));
    }

    renderIcons() {
        this.container.innerHTML = '';

        this.apps.forEach((app, index) => {
            const iconEl = document.createElement('div');
            iconEl.classList.add('desktop-icon');
            iconEl.dataset.appId = app.id;

            // Positioning Logic
            if (this.positions[app.id]) {
                iconEl.style.left = this.positions[app.id].left;
                iconEl.style.top = this.positions[app.id].top;
            } else {
                // Default Grid: Vertical column on the left
                const col = Math.floor(index / 6);
                const row = index % 6;
                iconEl.style.left = `${20 + col * 100}px`;
                iconEl.style.top = `${20 + row * 110}px`;
            }

            // Events
            iconEl.addEventListener('dblclick', () => {
                eventBus.emit('open-app', app);
                eventBus.emit('system-log', `App aberto: ${app.title}`);
            });

            iconEl.addEventListener('mousedown', (e) => this.onDragStart(e, iconEl));

            // Content
            const imgEl = document.createElement('div');
            imgEl.classList.add('icon-img');
            imgEl.innerText = app.title.substring(0, 2).toUpperCase();

            const labelEl = document.createElement('div');
            labelEl.classList.add('icon-label');
            labelEl.innerText = app.title;

            iconEl.appendChild(imgEl);
            iconEl.appendChild(labelEl);
            this.container.appendChild(iconEl);
        });
    }

    setupDragEvents() {
        document.addEventListener('mousemove', (e) => this.onDragMove(e));
        document.addEventListener('mouseup', () => this.onDragEnd());
    }

    onDragStart(e, iconEl) {
        // Prevent interfering with double click? Usually fine.
        e.preventDefault(); // Stop text selection
        this.draggingIcon = iconEl;

        const rect = iconEl.getBoundingClientRect();
        // Since container is relative, we can use client coords offset or offsetLeft/Top.
        // But mousemove gives clientX/Y.
        // We need to calculate offset relative to the cursor inside the element.
        this.dragOffset.x = e.clientX - rect.left;
        this.dragOffset.y = e.clientY - rect.top;

        // Bring to front while dragging simply by likely relying on DOM order, 
        // or we can set z-index temporarily.
        iconEl.style.zIndex = 100;
        iconEl.style.border = '1px dashed black';
    }

    onDragMove(e) {
        if (!this.draggingIcon) return;

        const containerRect = this.container.getBoundingClientRect();

        // Calculate new position relative to container
        let newX = e.clientX - containerRect.left - this.dragOffset.x;
        let newY = e.clientY - containerRect.top - this.dragOffset.y;

        // Basic bounds defaults
        // newX = Math.max(0, newX);
        // newY = Math.max(0, newY);

        this.draggingIcon.style.left = `${newX}px`;
        this.draggingIcon.style.top = `${newY}px`;
    }

    onDragEnd() {
        if (this.draggingIcon) {
            this.draggingIcon.style.zIndex = '';
            this.draggingIcon.style.border = '';
            this.draggingIcon = null;
            this.savePositions();
        }
    }
}
