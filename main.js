document.querySelector('.command-line').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const input = event.target.value.trim().toLowerCase();
        const messageBox = document.getElementById('message-box');
        const canvas = document.getElementById('diagonal-line');
        const ctx = canvas.getContext('2d');
        if (input === 'help') {
            messageBox.textContent = 'Available commands: help, test';
        } else if (input === 'test') {
            messageBox.textContent = 'Test command executed';
            // Draw red diagonal line
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(canvas.width, canvas.height);
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.stroke();
        } else {
            messageBox.textContent = 'Unrecognized command. Did you mean "help" or "test"?';
        }
        event.target.value = ''; // Clear the input field
    }
});