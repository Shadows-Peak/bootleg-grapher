const version = '1.0.6.5.3';
const iteration = 'DEV';
const versionTitle = 'Establish Graph Visual Framework'



const definedList = [];
const VisualDefinedList = [];

class FUNCTION {
    constructor(functionName, functionVariable, functionDefinition) {
        this.functionName = functionName;
        this.functionVariable = functionVariable;
        this.functionDefinition = functionDefinition;
    }

    evaluate(value) {
        const variable = (this.functionVariable).toString();
        let expression = ((this.functionDefinition).toString()).replace(variable, "("+value.toString()+")");
        expression = expression.replace('^', '**');
        return eval(expression);
    }

    printOut() {
        return `${this.functionName}(${this.functionVariable}) := ${this.functionDefinition}`;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('version-number').textContent = `${iteration} V${version} - ${new Date().getFullYear()} : ${versionTitle}`;
    updateTickMarks();
});

function updateTickMarks() {
    const canvas = document.getElementById('draw-space');
    const tickMarksX = document.getElementById('tick-marks-x');
    const tickMarksY = document.getElementById('tick-marks-y');
    const tickSpacing = 30;
    const numTicksX = canvas.width / tickSpacing;
    const numTicksY = canvas.height / tickSpacing;

    tickMarksX.innerHTML = '';
    tickMarksY.innerHTML = '';

    // Draw x-axis tick marks
    for (let i = 0; i <= numTicksX; i++) {
        const x = i * tickSpacing;
        const label = document.createElement('div');
        label.style.position = 'absolute';
        label.style.left = `${x}px`;
        label.style.transform = 'translateX(-50%)';
        label.textContent = (i - numTicksX / 2).toString();
        tickMarksX.appendChild(label);
    }

    // Draw y-axis tick marks
    for (let i = 0; i <= numTicksY; i++) {
        const y = i * tickSpacing;
        const label = document.createElement('div');
        label.style.position = 'absolute';
        label.style.top = `${y}px`;
        label.style.transform = 'translateY(-50%)';
        label.textContent = (numTicksY / 2 - i).toString();
        tickMarksY.appendChild(label);
    }
}

document.querySelector('.command-line').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const input = event.target.value.trim();
        const messageBox = document.getElementById('message-box');
        const infoBox = document.getElementById('info-box');
        const definitionsBox = document.getElementById('definitions-box');
        const canvas = document.getElementById('draw-space');
        const ctx = canvas.getContext('2d');

        if (input === 'help') {
            messageBox.textContent = 'Available commands: help, test, clear, check defined, define, graph';
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
            messageBox.textContent = 'Graphing y = '+(FunctionGrabbed.functionDefinition).toString();
            infoBox.textContent = 'Drawing y = x^3';

            // Draw y = x^3
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
            ctx.beginPath();
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;

            const scaleX = canvas.width / 2;
            const scaleY = canvas.height / 2;

            for (let x = -scaleX; x <= scaleX; x+=scaleX/10) {
                const y = 5*(FunctionGrabbed.evaluate(5*(x / scaleX)) / scaleY); // Scale the curve to fit the canvas
                alert('('+(x).toString()+','+(y).toString()+')');
                if (x === -scaleX) {
                    ctx.moveTo(scaleX + x, scaleY - y);
                } else {
                    ctx.lineTo(scaleX + x, scaleY - y);
                }
            }
        } else if (input === 'clear') {
            messageBox.textContent = 'Canvas cleared';
            infoBox.textContent = 'Nothing is being drawn';
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        } else if (input === 'check defined') {
            if (definedList.length === 0) {
                messageBox.textContent = 'No defined parameters';
            } else {
                messageBox.textContent = 'Defined parameters: ' + VisualDefinedList.join(', ');
            }
            infoBox.textContent = 'Nothing is being drawn';
        } else if (input.startsWith('define ')) {
            // EXAMPLE INPUT => 'define FUNC f(x) := x^2'
            const parameters = input.split(' ');
            parameters.shift(); // Remove 'define' from the array
            if (parameters[0] === 'FUNC') { // Defining a function
                const functionName = parameters[1].split('(')[0];
                const functionVariable = parameters[1].replace(/[()]/g, '').replace(functionName, '');
                const functionExpression = parameters[3];
                const newFunction = new FUNCTION(functionName, functionVariable, functionExpression);
                definedList.push(newFunction);
                VisualDefinedList.push(newFunction.printOut());
            }
            messageBox.textContent = `Define command executed with parameter: ${parameters}`;
            infoBox.textContent = `Defining: ${parameters}`;
            definitionsBox.textContent = `Defined parameters: ${VisualDefinedList.join(', ')}`;
        } else if (input.startsWith('evaluate ')) {
            const parameters = input.split(' ');
            parameters.shift(); // Remove 'evaluate' from the array
            const FunctionName = parameters[0];
            const FunctionGrabbed = definedList.find(func => func.functionName === FunctionName);
            if (!FunctionGrabbed) {
                messageBox.textContent = 'Function not defined';
                return;
            }
            const value = parameters[1];
            const result = FunctionGrabbed.evaluate(value);
            messageBox.textContent = `Evaluated ${FunctionName}(${value}) to be ${result}`;
            infoBox.textContent = `Evaluating: ${FunctionName}(${value})`;
        } else if (input === 'evaluate') {
            messageBox.textContent = 'You must enter parameters. For example: "evaluate FunctionName Value"';
        } else if (input === 'graph') {
            messageBox.textContent = 'You must enter parameters. For example: "graph FunctionName"';
        } else if (input === 'define') {
            messageBox.textContent = 'You must enter parameters. For example: "define FUNC" to define a function. Then follow that with: "FUNC FunctionName(FunctionVariable) := FunctionDefinition"';
        } else {
            messageBox.textContent = 'Unrecognized command. Try "help"';
            infoBox.textContent = 'Nothing is being drawn';
        }
        event.target.value = ''; // Clear the input field
    }
});