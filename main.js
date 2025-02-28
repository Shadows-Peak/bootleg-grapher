document.querySelector('.command-line').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const input = event.target.value.trim().toLowerCase();
        const messageBox = document.getElementById('message-box');
        const infoBox = document.getElementById('info-box');
        const canvas = document.getElementById('draw-space');
        const ctx = canvas.getContext('2d');

        if (input === 'help') {
            messageBox.textContent = 'Available commands: help, test';
        } else if (input === 'test') {
            messageBox.textContent = 'Test command executed';
            infoBox.textContent = 'Drawing red diagonal line';

            // Draw red diagonal line
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(canvas.width, canvas.height);
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.stroke();
        } else if (input === 'graph') {
            messageBox.textContent = 'Graphing y = x^3';
            infoBox.textContent = 'Drawing y = x^3';

            // Draw y = x^3
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
            ctx.beginPath();
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 2;

            const Function = input => Math.pow(input, 3);

            for (let x = -canvas.width / 2; x <= canvas.width / 2; x++) {
                const y = Function(x) / Math.pow(canvas.width / 2, 2); // Scale the curve to fit the canvas
                if (x === -canvas.width / 2) {
                    ctx.moveTo(canvas.width / 2 + x, canvas.height / 2 - y);
                } else {
                    ctx.lineTo(canvas.width / 2 + x, canvas.height / 2 - y);
                }
            }
            ctx.stroke();
        } else if (input === 'clear') {
            messageBox.textContent = 'Canvas cleared';
            infoBox.textContent = 'Nothing is being drawn';
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        } else {
            messageBox.textContent = 'Unrecognized command. Did you mean "help" or "test"?';
            infoBox.textContent = 'Nothing is being drawn';
        }
        event.target.value = ''; // Clear the input field
    }
});