const version = '1.0.3.1';
const versionTitle = 'Establish Graph Visual Framework'



const definedList = [];

class FUNCTION {
    constructor(functionName, functionVariable, functionDefinition) {
        this.functionName = functionName;
        this.functionVariable = functionVariable;
        this.functionDefinition = functionDefinition;
    }

    evaluate(value) {
        const variable = this.functionVariable;
        const expression = this.functionDefinition.replace(variable, value);
        expression = expression.replace('^', '**');
        return eval(expression);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('version-number').textContent = `V${version} - ${new Date().getFullYear()} : ${versionTitle}`;
});

document.querySelector('.command-line').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const input = event.target.value.trim();
        const messageBox = document.getElementById('message-box');
        const infoBox = document.getElementById('info-box');
        const definitionsBox = document.getElementById('definitions-box');
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
        } else if (input.startsWith('graph ')) {
            const FunctionName = input.split(' ')[1];
            const FunctionGrabbed = definedList.find(func => func.functionName === FunctionName);
            if (!FunctionGrabbed) {
                messageBox.textContent = 'Function not defined';
                infoBox.textContent = 'Nothing is being drawn';
                return;
            }
            messageBox.textContent = 'Graphing y = x^3';
            infoBox.textContent = 'Drawing y = x^3';

            // Draw y = x^3
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
            ctx.beginPath();
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 2;;

            for (let x = -canvas.width / 2; x <= canvas.width / 2; x++) {
                const y = FunctionGrabbed.evaluate(x) / Math.pow(canvas.width / 2, 2); // Scale the curve to fit the canvas
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
        } else if (input === 'check defined') {
            if (definedList.length === 0) {
                messageBox.textContent = 'No defined parameters';
            } else {
                messageBox.textContent = 'Defined parameters: ' + definedList.join(', ');
            }
            infoBox.textContent = 'Nothing is being drawn';
        } else if (input.startsWith('define ')) {
            // EXAMPLE INPUT => 'define FUNC f(x) := x^2'
            const parameters = input.split(' ');
            parameters.shift(); // Remove 'define' from the array
            alert(parameters[0]);
            if (parameters[0] === 'FUNC') { // Defining a function
                alert("HI");
                const functionName = parameters[1].split('(')[0];
                const functionVariable = parameters[1].replace(/[()]/g, '').replace(functionName, '');
                const functionExpression = parameters[3];
                const newFunction = new FUNCTION(functionName, functionVariable, functionExpression);
                definedList.push(newFunction);
            }
            messageBox.textContent = `Define command executed with parameter: ${parameter}`;
            infoBox.textContent = `Defining: ${parameters}`;
            definitionsBox.textContent = `Defined parameters: ${definedList.join(', ')}`;
        } else {
            messageBox.textContent = 'Unrecognized command. Did you mean "help" or "test"?';
            infoBox.textContent = 'Nothing is being drawn';
        }
        event.target.value = ''; // Clear the input field
    }
});