import { backend } from 'declarations/backend';

let display = document.getElementById('display');
let loader = document.getElementById('loader');

window.appendToDisplay = (value) => {
    display.value += value;
};

window.clearDisplay = () => {
    display.value = '';
};

window.calculate = async () => {
    try {
        loader.style.display = 'block';
        const expression = display.value;
        const [num1, operator, num2] = parseExpression(expression);
        
        if (num1 === null || num2 === null || operator === null) {
            throw new Error('Invalid expression');
        }

        let result;
        switch (operator) {
            case '+':
                result = await backend.add(num1, num2);
                break;
            case '-':
                result = await backend.subtract(num1, num2);
                break;
            case '*':
                result = await backend.multiply(num1, num2);
                break;
            case '/':
                if (num2 === 0) {
                    throw new Error('Division by zero');
                }
                result = await backend.divide(num1, num2);
                break;
            default:
                throw new Error('Invalid operator');
        }

        display.value = result.toString();
    } catch (error) {
        display.value = 'Error: ' + error.message;
    } finally {
        loader.style.display = 'none';
    }
};

function parseExpression(expression) {
    const regex = /^(-?\d+\.?\d*)\s*([\+\-\*\/])\s*(-?\d+\.?\d*)$/;
    const match = expression.match(regex);
    if (match) {
        return [parseFloat(match[1]), match[2], parseFloat(match[3])];
    }
    return [null, null, null];
}
