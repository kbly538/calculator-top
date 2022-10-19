// Regex for validating numbers is from David Leppik's answer https://stackoverflow.com/questions/9011524/regex-to-check-whether-a-string-contains-only-numbers/30987109#30987109

let display_value = "";
const operators = { "÷": "divide", "×": "multiply", "-": "subtract", "+": "add" }


let buttons = document.querySelectorAll(".button");
let display = document.querySelector(".screen-text")

function operate(operator, a, b) {


    const matchOnlyNumberRe = /NaN|-?((\d*\.\d+|\d+)([Ee][+-]?\d+)?|Infinity)$/;
    const numbersValid = a.match(matchOnlyNumberRe) != null && b.match(matchOnlyNumberRe) != null;

    if (!numbersValid) {
        return;
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
                return Math.round(a * 1000 / b * 1000) / 1000000;
            }
            throw new Error();

        }
    }
}


let calcEntryRegExp = /[\d|.]/;




let calculating = false;
let calculated = false;

let num1 = "";
let num2 = "";
let operator = "";
let floatingPoint = false;
let error = false;
let operatorMarked = false;
let answer = 0;

let num1Stage = true;
let num2Stage = false;
let operatorStage = false;


buttons.forEach(b => {
    b.addEventListener("click", (e) => {



        let activeButton = e.target.textContent.trim();
        let isNumber = activeButton.match(numbersRE);




        if (calculated || activeButton == "AC") {
            display_value = "";
            num1 = "";
            num2 = "";
            operator = "";
            floatingPoint = false;
            error = false;
            operatorMarked = false;
            calculating = false;
            calculated = false;
        }

        if (((num1 === "") && (!isNumber && (activeButton != "AC" && activeButton != "-")))) {
            if (activeButton === "mod") {
                display_value = "NOT IMPLEMENTED"
            } else if (activeButton === "xy" || activeButton === "y") {
                display_value = "NOT IMPLEMENTED";
            } else if ((num1 === "" || num2 === "") && activeButton === "=") {
                display_value = display_value;
            }
            else {
                display_value = "ERROR"
                error = true;
            }

            calculated = true;
        } else if ((num1 === "") && activeButton == "-") {
            num1 += "-";
        }



        if (num1 !== "" && !isNumber) {
            if (operators[activeButton] != undefined && !operatorMarked) {


                if (num1 !== "-") {
                    operatorMarked = true;
                    display_value += activeButton;
                    operator = operators[activeButton];
                    calculating = true;
                    floatingPoint = false;
                    operatorStage = true;
                    num1Stage = false;
                    operatorStage = true;
                    num2Stage = false;
                } else {
                    display_value += activeButton;
                    operator = operators[activeButton];
                    floatingPoint = false;

                }
            } else if (num2 !== "" && activeButton == "=") {
                calculated = true;
                calculating = false;
                display_value = operate(operator, num1, num2);
                num1Stage = false;
                num2Stage = false;
                operatorStage = false;
            }
        } else {
            if (!calculating && (isNumber || activeButton == ".") && !error) {
                num1Stage = true;
                if (activeButton == "." && floatingPoint) {
                    return;
                } else if (activeButton == ".") {
                    floatingPoint = true;
                }
                calculated = false;
                if (num1.length < 8 || operators[activeButton] === "-") {
                    num1 += activeButton;
                    display_value += activeButton;
                    num2Stage = false;
                    operatorStage = false;

                } else {
                    alert("Cannot be larger than this.")
                }
            } else if (calculating && isNumber || activeButton == "." && !error) {
                num2Stage = true;
                if (activeButton == "." && floatingPoint) {
                    return;
                } else if (activeButton == ".") {
                    floatingPoint = true;
                }
                if (num2.length < 8) {
                    num2 += activeButton;
                    display_value += activeButton;
                    num1Stage = false;
                    operatorStage = false;

                }
            }
        }


        if (activeButton === "CE") {
            if (num1Stage) {
                console.log("before1: " + display_value)
                num1 = num1.slice(0, num1.length - 1);
                display_value = display_value.slice(0, display_value.length - 1);
                console.log("after1: " + display_value)
                num2Stage = false;
                operatorStage = false;
                num1Stage = true;


            } else if (num2Stage) {
                console.log("before2: " + display_value)
                num2 = num2.slice(0, num2.length - 1);
                console.log("after2" + display_value)
                display_value = display_value.slice(0, display_value.length - 1);
                if (display_value != isNumber) {
                    operatorStage = true;
                    num2Stage = false;

                } else {
                    operatorStage = false;
                }
            } else if (operatorStage) {
                console.log("beforeop: " + display_value)
                operator = "";
                calculating = false;
                num2 = "";
                num2Stage = false;
                operatorMarked = false;
                num1Stage = true;
                display_value = display_value.slice(0, display_value.length - 1);
                operatorStage = true;
                console.log("after: " + display_value)
            } else {
                calculated = true;
                display_value = "0";
                num1Stage = true;
            }
        }

        display.textContent = display_value;
        

    });
})
