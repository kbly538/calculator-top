// Regex for validating numbers is from David Leppik's answer https://stackoverflow.com/questions/9011524/regex-to-check-whether-a-string-contains-only-numbers/30987109#30987109

const IMPLEMENTATION_MESSAGE = "NOT IMPLEMENTED";
const ERROR_DISPLAY_MESSAGE = "ERR";


let display_value = "";
const operators = { "÷": "divide", "×": "multiply", "-": "subtract", "+": "add" }
const Operations = { Mod: "mod", Power: "pow", ClearAll: "AC", UndoAction: "CE" };
const States = { FirstOperand: 1, SecondOperand: 2, Operator: 3 };
const CalculationStatus = { NotCalculating: 1, Calculating: 2, Calculated: 3 }


let buttons = document.querySelectorAll(".button");
let display = document.querySelector(".screen-text")

function operate(operator, a, b) {


    const matchOnlyNumberRe = /NaN|-?((\d*\.\d+|\d+)([Ee][+-]?\d+)?|Infinity)$/;
    const numbersValid = a.match(matchOnlyNumberRe) != null && b.match(matchOnlyNumberRe) != null;


    if (!numbersValid) {
        return ERROR_DISPLAY_MESSAGE;
    }


    a = +(a);
    b = +(b);

    switch (operator) {
        case "add":
            return a + b;
        case "subtract":
            return a - b;
        case "multiply":
            return a * b;
        case "divide": {
            if (b != 0) {
                return Math.round(a * 1000 / b * 1000) / 10000

            }
            return ERROR_DISPLAY_MESSAGE


        }
    }
}


let calcEntryRegExp = /[\d|.]/;




let currentState = States.FirstOperand;
let calculationStatus = CalculationStatus.NotCalculating;


let num1 = "";
let num2 = "";
let operator = "";
let floatingPoint = false;
let error = false;
let operatorMarked = false;
let answer = 0;

function checkIfNegative(num) {
    return num[0] === "-";
}

function resetCalculation() {

    num1 = "";
    display_value = "_";
    num1 = "";
    num2 = "";
    operator = "";
    floatingPoint = false;
    error = false;
    operatorMarked = false;
    currentState = States.FirstOperand;
    calculationStatus = CalculationStatus.NotCalculating;

}

function undoAction() {
    let temp = display_value.slice(0, display_value.length - 1);
    let isOP = temp[temp.length - 1] !== undefined;
    if (isOP) {
        currentState = States.Operator;
    }
    if (currentState === States.FirstOperand) {

        num1 = num1.slice(0, num1.length - 1);

        display_value = display_value.slice(0, display_value.length - 1);
        if (display_value === "") {
            resetCalculation();
            
        }
        currentState = States.FirstOperand;

    } else if (currentState === States.SecondOperand) {

        num2 = num2.slice(0, num2.length - 1);

        display_value = display_value.slice(0, display_value.length - 1);

    } else if (currentState === States.Operator) {
        display_value = display_value.slice(0, display_value.length - 1);
        operator = "";
        operatorMarked = false;
        num2 = "";
        currentState = States.FirstOperand;
    }
}

function processOperator(e) {
    buttonPressed = e.target.textContent.trim();
    if (operators[buttonPressed] === undefined) { return; }

    if ((calculationStatus === CalculationStatus.Calculating)
        && (currentState === States.Operator)
        && !operatorMarked) {
        operatorMarked = true;
        currentState = States.SecondOperand;
        operator = buttonPressed;
        display_value += operator;
        flip();
    } else if (calculationStatus === CalculationStatus.NotCalculating) {
        currentState = States.FirstOperand;
    } else {
        currentState = States.SecondOperand;
    }

}

const btnCE = document.getElementById("CE");
const btnAC = document.getElementById("AC");
const btnOperators = document.querySelectorAll(".button.operator")

btnCE.addEventListener("click", undoAction);
btnAC.addEventListener("click", resetCalculation);
btnOperators.forEach(btn => {
    addEventListener("click", processOperator);
});


function flip() {
    display.textContent = display_value;
}



buttons.forEach(b => {
    b.addEventListener("click", (e) => {


        let buttonPressed = e.target.textContent.trim();
        let isNumberPressed = buttonPressed.match(calcEntryRegExp);
        if (calculationStatus === CalculationStatus.Calculated) {
            resetCalculation();
        }





        // Handle aux buttons
        if (calculationStatus === CalculationStatus.NotCalculating) {
            switch (buttonPressed) {
                case "mod":
                    display_value = IMPLEMENTATION_MESSAGE;
                    break;
                case "xy":
                    display_value = IMPLEMENTATION_MESSAGE;
                    break;
                case "=":
                    display_value = ERROR_DISPLAY_MESSAGE;
                    break;
                case "AC":
                    resetCalculation(e);

                    break;
                default:
                    break;
            }
        }


        // Handle negatives
        let isAlreadyNegative = true;

        if (buttonPressed === "-"
            && calculationStatus === CalculationStatus.NotCalculating) {

            display_value = "";
            isAlreadyNegative = checkIfNegative(num1);
            if (isAlreadyNegative) {
                return;
            }
            num1 += "-";
            display_value += "-";


        }
        else if (buttonPressed === "-"
            && currentState === States.SecondOperand
            && num2 === "") {
            isAlreadyNegative = checkIfNegative(num2);
            if (isAlreadyNegative) {
                return;
            }
            num2 += "-";
            display_value += "-";
        }


        // Handle Operands
        if (currentState === States.FirstOperand
            && isNumberPressed) {

                if (num1.length === 0 && buttonPressed === ".")
            {
                buttonPressed = "0."
            }
            if (calculationStatus === CalculationStatus.NotCalculating)
            {
                display_value = "";
                calculationStatus = CalculationStatus.Calculating;
            }


            currentState = States.FirstOperand
            calculationStatus = CalculationStatus.Calculating;
            display_value += buttonPressed
            num1 += buttonPressed;


        } else if ((currentState === States.SecondOperand
            && isNumberPressed)) {
            
            if (num2.length === 0 && buttonPressed === ".")
            {
                buttonPressed = "0."
            }
                
            currentState = States.SecondOperand;
            calculationStatus = CalculationStatus.Calculating;
            display_value += buttonPressed
            num2 += buttonPressed;


        } else if (operators[buttonPressed] !== undefined && calculationStatus === CalculationStatus.Calculating) {
            currentState = States.Operator;

        }


        // Handle result
        if (num2 !== "" && buttonPressed === "=") {
            answer = operate(operators[operator], num1, num2);
            display_value = "" + answer;
            flip();
            calculationStatus = CalculationStatus.Calculated;
        }

        flip();
    });

})
