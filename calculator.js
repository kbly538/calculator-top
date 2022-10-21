// Regex for validating numbers is from David Leppik's answer https://stackoverflow.com/questions/9011524/regex-to-check-whether-a-string-contains-only-numbers/30987109#30987109

const IMPLEMENTATION_MESSAGE = "NOT IMPLEMENTED";
const ERROR_DISPLAY_MESSAGE = "ERR";

let currentCalculationText = "";
let calculationResultText = "";


const operators = { "÷": "divide", "×": "multiply", "-": "subtract", "+": "add" }
const Operations = { Mod: "mod", Power: "pow", ClearAll: "AC", UndoAction: "CE" };
const States = { ProcessingFirstOperand: 1, ProcessingSecondOperand: 2, Operator: 3 };
const CalculationStatus = { NotCalculating: 1, Calculating: 2, Calculated: 3 }


let buttons = document.querySelectorAll(".button");
let display = document.querySelector(".bottom-screen>div")
let calculationDisplay = document.querySelector(".top-screen>div");

calculationDisplay.textContent = ""


function operate(operator, a, b) {


    // Cast to string for validation
    a = String(a);
    b = String(b);

    if (!validateNumber(a, b)) return ERROR_DISPLAY_MESSAGE;

    // Cast back to number for processing
    a = Number(a);
    b = Number(b);


    switch (operator) {
        case "add":
            return String(add(a, b));
        case "subtract":
            return String(subtract(a, b));
        case "multiply":
            return String(multiply(a, b));
        case "divide": {
            return String(divide(a, b));
        }
    }
}

function validateNumber(a, b) {
    const matchOnlyNumberRe = /NaN|-?((\d*\.\d+|\d+)([Ee][+-]?\d+)?|Infinity)$/;
    const numbersValid = a.match(matchOnlyNumberRe) != null && b.match(matchOnlyNumberRe) != null;

    return numbersValid;
}


function floatPrecisionTo(precision, a, b){
    defaultPrecision = "1";
    for (let zeros = 0; zeros < precision; zeros++){
        defaultPrecision += 0;
    }

    return Math.round((a * defaultPrecision) / (b * defaultPrecision) * defaultPrecision) / defaultPrecision;

}

function divide(a, b) {
    if (b === 0) return;   
    return floatPrecisionTo(3, a, b);
}

function multiply(a, b) {
    return Math.round(a  * b * 10000) / 10000;
}

function subtract(a, b) {
    return (a * 10 - b * 10) / 10;
}

function add(a, b) {
    console.log(typeof(a));
    a = Number(a);
    console.log(a)
    return (a * 10 + b * 10) / 10;
}


let calcEntryRegExp = /[\d|.]/;

let currentState = States.ProcessingFirstOperand;
let calculationStatus = CalculationStatus.NotCalculating;


let num1 = "";
let num2 = "";
let operator = "";
let floatingPoint = false;
let result = "0";

function isNegative(num) {
    return num[0] === "-";
}

function resetCalculation() {

    num1 = "";
    num2 = "";
    currentCalculationText = num1;
    calculationResultText = "";
    operator = "";
    floatingPoint = false;
    currentState = States.ProcessingFirstOperand;
    calculationStatus = CalculationStatus.Calculating;
    result = "";

}


function undoAction() {
    if (num1 === "") return;

    
    if (currentState === States.ProcessingFirstOperand) num1 = num1.slice(0, -1);

    if (currentState === States.ProcessingSecondOperand && num2 === ""){
        operator = "";
        currentState = States.ProcessingFirstOperand;  
    } else if (currentState === States.ProcessingSecondOperand) num2 = num2.slice(0, -1);

    

}


const btnCE = document.getElementById("CE");
const btnAC = document.getElementById("AC");
const btnOperators = document.querySelectorAll(".button.operator");
const btnNumbers = document.querySelectorAll(".button.number");
const btnMinus = document.getElementById("subtract");
const btnEquals = document.getElementById("equals");
const btnPoint = document.getElementById("point");
const btns = document.querySelectorAll(".button")
const btnMod = document.getElementById("mod");

btnMod.addEventListener("click", e => {
        
})

btnEquals.addEventListener("click", processResult);
btnCE.addEventListener("click", undoAction);
btnAC.addEventListener("click", resetCalculation);
btnPoint.addEventListener("click", processFloatingPoint)
btnMinus.addEventListener("click", processNegatives);


btnOperators.forEach(btn => {
    btn.addEventListener("click", processOperator);
});
btnNumbers.forEach(btn => {
    btn.addEventListener("click", processNumber)
})
btns.forEach(btn => {
    btn.addEventListener("click", updateScreen);
});


function processNegatives()
{

    if (currentState === States.ProcessingFirstOperand) {
        if (Number(num1) < 0) return;
        if (num1 === "") num1 += "-";
        return;
    };
    if (currentState === States.ProcessingSecondOperand) {
        if (Number(num2) < 0) return;
        if (num2 === "") num2 += "-";
        return;
    };

    return;
}

function processResult() {
    if (num1 === "" || num2 === "" || calculationStatus === CalculationStatus.Calculated) return;
    calculationStatus = CalculationStatus.Calculated;
    currentState = States.ProcessingFirstOperand;
    result = operate(operators[operator], num1, num2);
    currentCalculationText = parseFloat(result)
    calculationResultText = `${num1}${operator}${num2}=${currentCalculationText}`;
    operator = ""
}

function processOperator(e) {
    if (num1 === "-") return;
    if (currentState === States.ProcessingSecondOperand) return;
    if (calculationStatus === CalculationStatus.Calculated) {
        calculationStatus = CalculationStatus.Calculating;
        num1 = result;
        num2 = "";
    }
    floatingPoint = false;
    operator = e.target.textContent.trim();
    currentState = States.ProcessingSecondOperand;
    
}


function processFloatingPoint(e){

    if (floatingPoint) return;
    if (calculationStatus === CalculationStatus.Calculated){
        resetCalculation();
    }

    if (currentState === States.ProcessingFirstOperand) num1 += ".";
    else if (currentState === States.ProcessingSecondOperand) num2 += ".";

    floatingPoint = true;

    return;
}



function processNumber(e) {

    let num = e.target.textContent.trim();
    if (calculationStatus === CalculationStatus.Calculated) resetCalculation();
    if (currentState === States.ProcessingFirstOperand) num1 = modifyOperand(num1, num);
    else if (currentState === States.ProcessingSecondOperand) num2 = modifyOperand(num2, num);
    
    return;

}


function modifyOperand(num, modification) {

    if (modification === "0" && num === "") return num += "0";

    if (num === "0") num = "";
    if (modification >= 0 && modification <= 9) return num += modification;

    return;
}




// DISPLAY
function refreshCurrentCalculationText() {
    if (calculationStatus === CalculationStatus.Calculated) {
        currentCalculationText = parseFloat(result);
    } else {

        currentCalculationText = `${num1}${operator}${num2}`;
    }
    display.textContent = currentCalculationText;
}

function displayResult() {

    calculationDisplay.textContent = calculationResultText;
}

function updateScreen(){

    refreshCurrentCalculationText();
    displayResult();

}


