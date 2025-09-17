const version = '1.3.0.7';
const iteration = 'DEV';
const versionTitle = 'Complex Function Support';



const definedList = [];
const VisualDefinedList = [];



let sampleAmount = 100;
let boundingX = 5;
let boundingY = 5;

let savedCanvas;
let currentlyGraphing = false;

function saveCanvas(GivenCanvas) {
    savedCanvas = GivenCanvas.toDataURL();
}

function revertCanvas(GivenCanvas) {
  const img = new Image();
  img.onload = function() {
    GivenCanvas.getContext('2d').clearRect(0, 0, GivenCanvas.width, GivenCanvas.height);
    GivenCanvas.getContext('2d').drawImage(img, 0, 0);
  };
  img.src = savedCanvas;
}

function graph(FUNCtion, CANVas, mode = null) {
    updateTickMarks();
    const ctx = CANVas.getContext('2d');
    ctx.clearRect(0, 0, CANVas.width, CANVas.height); // Clear previous drawings
    ctx.lineWidth = 2;
    const scaleX = CANVas.width / 2;
    const scaleY = CANVas.height / 2;

    if (FUNCtion.type === 'CFUNC') {
        // Complex function: mode is DUAL or ABS
        if (mode === 'DUAL') {
            // Real part (blue)
            ctx.beginPath();
            ctx.strokeStyle = 'blue';
            for (let x = -scaleX; x <= scaleX; x += scaleX / sampleAmount) {
                const adjustedX = boundingX * (x / scaleX);
                const z = new Complex(adjustedX, 0);
                let val;
                try {
                    val = FUNCtion.evaluate(z);
                } catch (e) {
                    console.error(`Error evaluating at x=${adjustedX}:`, e);
                    continue;
                }
                const y = val.re;
                const adjustedY = scaleY * (y / boundingY);
                if (x === -scaleX) {
                    ctx.moveTo(scaleX + x, scaleY - adjustedY);
                } else {
                    ctx.lineTo(scaleX + x, scaleY - adjustedY);
                }
            }
            ctx.stroke();
            // Imaginary part (red)
            ctx.beginPath();
            ctx.strokeStyle = 'red';
            for (let x = -scaleX; x <= scaleX; x += scaleX / sampleAmount) {
                const adjustedX = boundingX * (x / scaleX);
                const z = new Complex(adjustedX, 0);
                const val = FUNCtion.evaluate(z);
                const y = val.im;
                const adjustedY = scaleY * (y / boundingY);
                if (x === -scaleX) {
                    ctx.moveTo(scaleX + x, scaleY - adjustedY);
                } else {
                    ctx.lineTo(scaleX + x, scaleY - adjustedY);
                }
            }
            ctx.stroke();
        } else if (mode === 'ABS') {
            // Magnitude (red)
            ctx.beginPath();
            ctx.strokeStyle = 'red';
            for (let x = -scaleX; x <= scaleX; x += scaleX / sampleAmount) {
                const adjustedX = boundingX * (x / scaleX);
                const z = new Complex(adjustedX, 0);
                const val = FUNCtion.evaluate(z);
                const y = val.abs();
                const adjustedY = scaleY * (y / boundingY);
                if (x === -scaleX) {
                    ctx.moveTo(scaleX + x, scaleY - adjustedY);
                } else {
                    ctx.lineTo(scaleX + x, scaleY - adjustedY);
                }
            }
            ctx.stroke();
        } else {
            // Default: plot real part (blue)
            ctx.beginPath();
            ctx.strokeStyle = 'blue';
            for (let x = -scaleX; x <= scaleX; x += scaleX / sampleAmount) {
                const adjustedX = boundingX * (x / scaleX);
                const z = new Complex(adjustedX, 0);
                const val = FUNCtion.evaluate(z);
                const y = val.re;
                const adjustedY = scaleY * (y / boundingY);
                if (x === -scaleX) {
                    ctx.moveTo(scaleX + x, scaleY - adjustedY);
                } else {
                    ctx.lineTo(scaleX + x, scaleY - adjustedY);
                }
            }
            ctx.stroke();
        }
    } else {
        // Real function
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        for (let x = -scaleX; x <= scaleX; x += scaleX / sampleAmount) {
            const adjustedX = boundingX * (x / scaleX);
            const y = FUNCtion.evaluate(adjustedX);
            const adjustedY = scaleY * (y / boundingY);
            if (x === -scaleX) {
                ctx.moveTo(scaleX + x, scaleY - adjustedY);
            } else {
                ctx.lineTo(scaleX + x, scaleY - adjustedY);
            }
        }
        ctx.stroke();
    }
    currentlyGraphing = FUNCtion.functionName;
    saveCanvas(CANVas);
}

class FUNCTION {
    constructor(functionName, functionVariable, functionDefinition) {
        this.functionName = functionName;
        this.functionVariable = functionVariable;
        this.functionDefinition = functionDefinition;
        this.type = 'FUNC';
    }

    evaluate(value) {
        const variable = (this.functionVariable).toString();
        let expression = ((this.functionDefinition).toString()).replace(variable, "("+value.toString()+")");
        expression = expression.replace('^', '**');
        console.log(`Evaluating expression: ${expression}`);
        return eval(expression);
    }

    printOut() {
        return `${this.functionName}(${this.functionVariable}) := ${this.functionDefinition}`;
    }
}

// Complex number class for CFUNC
class Complex {
    constructor(re, im) {
        this.re = re;
        this.im = im;
    }
    add(other) {
        return Complex.add(this, other);
    }
    mul(other) {
        return Complex.mul(this, other);
    }
    abs() {
        return Math.sqrt(this.re * this.re + this.im * this.im);
    }
    static add(a, b) {
        if (!(a instanceof Complex)) a = new Complex(a, 0);
        if (!(b instanceof Complex)) b = new Complex(b, 0);
        return new Complex(a.re + b.re, a.im + b.im);
    }
    static sub(a, b) {
        if (!(a instanceof Complex)) a = new Complex(a, 0);
        if (!(b instanceof Complex)) b = new Complex(b, 0);
        return new Complex(a.re - b.re, a.im - b.im);
    }
    static mul(a, b) {
        if (!(a instanceof Complex)) a = new Complex(a, 0);
        if (!(b instanceof Complex)) b = new Complex(b, 0);
        return new Complex(
            a.re * b.re - a.im * b.im,
            a.re * b.im + a.im * b.re
        );
    }
    static div(a, b) {
        if (!(a instanceof Complex)) a = new Complex(a, 0);
        if (!(b instanceof Complex)) b = new Complex(b, 0);
        const denom = b.re * b.re + b.im * b.im;
        return new Complex(
            (a.re * b.re + a.im * b.im) / denom,
            (a.im * b.re - a.re * b.im) / denom
        );
    }
    static pow(a, n) {
        if (!(a instanceof Complex)) a = new Complex(a, 0);
        // Try to evaluate n as a number if it's not already
        let numN = n;
        if (typeof n !== 'number') {
            try {
                numN = eval(n);
            } catch (e) {
                throw new Error('Complex.pow: exponent could not be evaluated as a number: ' + n);
            }
        }
        let r = Math.pow(a.abs(), numN);
        let theta = Math.atan2(a.im, a.re) * numN;
        return new Complex(r * Math.cos(theta), r * Math.sin(theta));
    }
}

// CFUNCTION for complex functions
class CFUNCTION {
    constructor(functionName, functionVariable, functionDefinition) {
        this.functionName = functionName;
        this.functionVariable = functionVariable;
        this.functionDefinition = functionDefinition;
        this.type = 'CFUNC';
    }

    // Evaluate for a complex z
    evaluate(z) {
        // Replace variable with z, and i with new Complex(0,1)
        let expr = this.functionDefinition
            .replace(/\bi\b/g, 'I') // temp replace i with I
            .replace(new RegExp(this.functionVariable + '(?![\\w])', 'g'), 'Z');
        // Replace ^ with Complex.pow, * with Complex.mul, / with Complex.div, + with Complex.add, - with Complex.sub
        expr = expr.replace(/([\w.()]+)\s*\^\s*([\w.()]+)/g, 'Complex.pow($1,$2)');
        expr = expr.replace(/([\w.()]+)\s*\*\s*([\w.()]+)/g, 'Complex.mul($1,$2)');
        expr = expr.replace(/([\w.()]+)\s*\/\s*([\w.()]+)/g, 'Complex.div($1,$2)');
        expr = expr.replace(/([\w.()]+)\s*\+\s*([\w.()]+)/g, 'Complex.add($1,$2)');
        expr = expr.replace(/([\w.()]+)\s*-\s*([\w.()]+)/g, 'Complex.sub($1,$2)');

        // Only allow Z and I as variables, and Complex as class
        // Replace Z and I with actual values in the string
        // Provide Z and I as variables in the eval scope
        const Z = z;
        const I = new Complex(0, 1);
        let safeExpr = expr;

        // Only allow certain characters for safety
        if (!/^[\w\s().,+\-*/^ComplexzI]+$/.test(safeExpr)) {
            throw new Error('Unsafe characters in expression');
        }

        // Evaluate using eval in a restricted scope
        // eslint-disable-next-line no-eval
        let result;
        try {
            result = eval(safeExpr);
        } catch (e) {
            console.error(`[CFUNCTION] Error evaluating expression: ${safeExpr}`, e);
            throw e;
        }
        infoBox.textContent = `Evaluated expression: ${safeExpr} to ${result.re} + ${result.im}i`;
        messageBox.textContent = `Evaluated expression: ${safeExpr} to ${result.re} + ${result.im}i`;
        return result;
    }

    printOut() {
        return `${this.functionName}(${this.functionVariable}) := ${this.functionDefinition}`;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('version-number').textContent = `${iteration} V${version} - ${new Date().getFullYear()} : ${versionTitle}`;
    updateTickMarks();
    // Define a complex square root function: f(z) := z^(1/2)
    const sqrtCFunc = new CFUNCTION('f', 'z', 'z^(1/2)');
    definedList.push(sqrtCFunc);
    VisualDefinedList.push(sqrtCFunc.printOut());

    // Test evaluate at z = -1
    const testValue = new Complex(-1, 0);
    const result = sqrtCFunc.evaluate(testValue);
    console.log(`f(-1) = ${result.re} + ${result.im}i`);
});

function updateTickMarks() {
    const canvas = document.getElementById('draw-space');
    const tickMarksX = document.getElementById('tick-marks-x');
    const tickMarksY = document.getElementById('tick-marks-y');
    let tickSpacingX = canvas.width/(boundingX*2);
    let tickSpacingY = canvas.height/(boundingY*2);
    const numTicksX = canvas.width / tickSpacingX;
    const numTicksY = canvas.height / tickSpacingY;

    tickMarksX.innerHTML = '';
    tickMarksY.innerHTML = '';

    // Draw x-axis tick marks
    for (let i = 0; i <= numTicksX; i++) {
        const x = i * tickSpacingX;
        const label = document.createElement('div');
        label.style.position = 'absolute';
        label.style.left = `${x}px`;
        label.style.transform = 'translateX(-50%)';
        label.textContent = (i - numTicksX / 2).toString();
        tickMarksX.appendChild(label);
    }

    // Draw y-axis tick marks
    for (let i = 0; i <= numTicksY; i++) {
        const y = i * tickSpacingY;
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
            messageBox.textContent = 'Available commands: help, test, clear, check defined, define, graph, evaluate';
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
            // Support: graph f DUAL, graph f ABS, or just graph f
            const parts = input.split(' ');
            const FunctionName = parts[1];
            const mode = (parts.length > 2) ? parts[2].toUpperCase() : null;
            const FunctionGrabbed = definedList.find(func => func.functionName === FunctionName);
            if (!FunctionGrabbed) {
                messageBox.textContent = 'Function not defined';
                infoBox.textContent = 'Nothing is being drawn';
                return;
            }
            if (FunctionGrabbed.type === 'CFUNC') {
                if (mode === 'DUAL') {
                    messageBox.textContent = `Graphing real (blue) and imaginary (red) parts of ${FunctionName}`;
                    infoBox.textContent = `Drawing real/imaginary for ${FunctionName}`;
                } else if (mode === 'ABS') {
                    messageBox.textContent = `Graphing |${FunctionName}(z)| (red)`;
                    infoBox.textContent = `Drawing magnitude for ${FunctionName}`;
                } else {
                    messageBox.textContent = `Graphing real part of ${FunctionName} (blue)`;
                    infoBox.textContent = `Drawing real part for ${FunctionName}`;
                }
                graph(FunctionGrabbed, canvas, mode);
            } else {
                messageBox.textContent = 'Graphing y = ' + (FunctionGrabbed.functionDefinition).toString();
                infoBox.textContent = 'Drawing y = x^3';
                graph(FunctionGrabbed, canvas);
            }
        } else if (input === 'clear') {
            currentlyGraphing = false;
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
            // EXAMPLE INPUT => 'define FUNC f(x) := x^2' or 'define CFUNC f(z) := z^2 + z*i'
            const parameters = input.split(' ');
            parameters.shift(); // Remove 'define' from the array
            if (parameters[0] === 'FUNC') { // Defining a function
                const functionName = parameters[1].split('(')[0];
                const functionVariable = parameters[1].replace(/[()]/g, '').replace(functionName, '');
                const functionExpression = parameters[3];
                const newFunction = new FUNCTION(functionName, functionVariable, functionExpression);
                definedList.push(newFunction);
                VisualDefinedList.push(newFunction.printOut());
            } else if (parameters[0] === 'CFUNC') { // Defining a complex function
                const functionName = parameters[1].split('(')[0];
                const functionVariable = parameters[1].replace(/[()]/g, '').replace(functionName, '');
                const functionExpression = parameters.slice(3).join(' '); // allow spaces in complex expr
                const newCFunction = new CFUNCTION(functionName, functionVariable, functionExpression);
                definedList.push(newCFunction);
                VisualDefinedList.push(newCFunction.printOut());
            } else if (parameters[0] === 'SETTING') {
                if (parameters[1] === 'sampleAmount') {
                    sampleAmount = parseInt(parameters[2]);
                } else if (parameters[1] === 'boundingX') {
                    boundingX = parseInt(parameters[2]);
                    graph(FunctionGrabbed,canvas);
                } else if (parameters[1] === 'boundingY') {
                    boundingY = parseInt(parameters[2]);
                    graph(FunctionGrabbed,canvas);
                }
                if (isNaN(sampleAmount) || isNaN(boundingX) || isNaN(boundingY)) {
                    messageBox.textContent = 'Invalid setting value';
                    messageBox.textContent += ' Valid settings: sampleAmount, boundingX, boundingY';
                    return;
                }
            }
            messageBox.textContent = `Define command executed with parameter: ${parameters}`;
            infoBox.textContent = `Defining: ${parameters}`;
            definitionsBox.textContent = `Defined parameters: ${VisualDefinedList.join(', ')}`;
        } else if (input.startsWith('evaluate ')) {
            updateTickMarks();
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

            // Draw circles at specific points on the edge of the canvas using div elements
            const circleContainer = document.getElementById('circle-container');
            circleContainer.innerHTML = ''; // Clear previous circles

            if (currentlyGraphing == FunctionName) {
                const oldCircles = circleContainer.querySelectorAll('div');
                oldCircles.forEach(circle => circle.remove());
                revertCanvas(canvas);

                const points = [
                    { x: (canvas.width/2)*(1+value/boundingX), y: canvas.height },
                    { x: 0, y: (canvas.height/2)*(1-result/boundingY) },
                    { x: (canvas.width/2)*(1+value/boundingX), y: (canvas.height/2)*(1-result/boundingY) }
                ];
    
                points.forEach(point => {
                    const circle = document.createElement('div');
                    circle.style.position = 'absolute';
                    circle.style.width = '10px';
                    circle.style.height = '10px';
                    circle.style.borderRadius = '50%';
                    circle.style.backgroundColor = 'blue';
                    circle.style.left = `${point.x}px`;
                    circle.style.top = `${point.y}px`;
                    circle.style.transform = 'translate(-50%, -50%)';
                    circleContainer.appendChild(circle);
                });
            }

            messageBox.textContent = `Evaluated ${FunctionName}(${value}) to be ${result}`;
            infoBox.textContent = `Evaluating: ${FunctionName}(${value})`;
        } else if (input === 'evaluate') {
            messageBox.textContent = 'You must enter parameters. For example: "evaluate FunctionName Value"';
        } else if (input === 'graph') {
            messageBox.textContent = 'You must enter parameters. For example: "graph FunctionName (For complex: [DUAL|ABS])"';
        } else if (input === 'define') {
            messageBox.textContent = 'You must enter parameters. For example: "define FUNC" to define a function. Then follow that with: "FUNC FunctionName(FunctionVariable) := FunctionDefinition"';
            messageBox.textContent += ' Or "define CFUNC" to define a complex function. Then follow that with: "CFUNC FunctionName(FunctionVariable) := FunctionDefinition"';
            messageBox.textContent += ' Or "define SETTING" to change settings. Then follow that with: "SETTING SettingName SettingValue"';
        } else {
            messageBox.textContent = 'Unrecognized command. Try "help"';
            infoBox.textContent = 'Nothing is being drawn';
        }
        event.target.value = ''; // Clear the input field
    }
});
