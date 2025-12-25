// import { eventBus } from './eventBus.js';

class Desktop {
    constructor(apps) {
        this.container = document.getElementById('desktop');
        this.apps = apps; // List of available app configs
        this.renderIcons();
    }

    renderIcons() {
        this.apps.forEach(app => {
            const iconEl = document.createElement('div');
            iconEl.classList.add('desktop-icon');
            iconEl.ondblclick = () => {
                eventBus.emit('open-app', app);
                eventBus.emit('system-log', `App aberto: ${app.title}`);
            };

            const imgEl = document.createElement('div');
            imgEl.classList.add('icon-img');
            // Simple visual distinction: first letter or short text
            imgEl.innerText = app.title.substring(0, 2).toUpperCase();

            const labelEl = document.createElement('div');
            labelEl.classList.add('icon-label');
            labelEl.innerText = app.title;

            iconEl.appendChild(imgEl);
            iconEl.appendChild(labelEl);
            this.container.appendChild(iconEl);
        });
    }
}
