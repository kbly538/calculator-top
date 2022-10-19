// Regex for validating numbers is from David Leppik's answer https://stackoverflow.com/questions/9011524/regex-to-check-whether-a-string-contains-only-numbers/30987109#30987109

let display_value = "";
const operators = { "÷": "divide", "×": "multiply", "-": "subtract", "+": "add" }


let buttons = document.querySelectorAll(".button");
let display = document.querySelector(".screen-text")

function operate(e, operator, a, b) {


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
                return Math.round(a * 100 / b * 100) / 1000;
            }
            throw new Error();

        }
    }
}


let numbersRE = /[\d|.]/;




let calculating = false;
let calculated = false;

let num1 = "";
let num2 = "";
let operator = "";
let floatingPoint = false;
let error = false;
let operatorMarked = false;


buttons.forEach(b => {
    b.addEventListener("click", (e) => {



        let activeButton = e.target.textContent.trim();
        let isNumber = activeButton.match(numbersRE);



        if (calculated || activeButton == "AC") {
            display_value = "";
            num1 = "";
            num2 = "";
            operator = "";
            calculated = false;
            floatingPoint = false;
            error = false;
            operatorMarked = false;

        }

        if (((num1 === "") && (!isNumber && activeButton != "AC"))) {
            if (activeButton === "mod") {
                display_value = "NOT IMPLEMENTED"
            } else if (activeButton === "%") {
                display_value = "NOT IMPLEMENTED"
            } else {
                display_value = "ERROR"
                error = true;
            }
            calculated = true;

        }



        if (num1 !== "" && !isNumber) {
            if (operators[activeButton] != undefined && !operatorMarked) {
                operatorMarked = true;
                display_value += activeButton;
                operator = operators[activeButton];
                calculating = true;
                floatingPoint = false;
            } else if (num2 !== "" && activeButton == "=") {
                calculated = true;
                calculating = false;
                display_value = operate(e, operator, num1, num2)
            }
        } else {
            if (!calculating && (isNumber || activeButton == ".") && !error) {
                if (activeButton == "." && floatingPoint) {
                    return;
                } else if (activeButton == ".") {
                    floatingPoint = true;
                }
                calculated = false;
                if (num1.length < 8) {
                    console.log(num1)
                    num1 += activeButton;
                    display_value += activeButton;

                } else {
                    alert("Cannot be larger than this.")
                }
            } else if (calculating && isNumber || activeButton == "." && !error) {
                if (activeButton == "." && floatingPoint) {
                    return;
                } else if (activeButton == ".") {
                    floatingPoint = true;
                }
                if (num2.length < 8) {
                    num2 += activeButton;
                    display_value += activeButton;

                }
            }
        }

        display.textContent = display_value;

    });
})
