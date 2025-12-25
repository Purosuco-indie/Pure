const Rodar = {
    id: 'rodar',
    title: 'Rodar',
    init: (container, windowId) => {
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
        let x = 10;
        let y = 10;
        let dx = 2;
        let dy = 2;
        let running = false;
        let animId;

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

        // Cleanup if window removed?
        // Again, assuming MVP scale.
    }
};
