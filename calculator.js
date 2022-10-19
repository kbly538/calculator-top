// Regex for validating numbers is from David Leppik's answer https://stackoverflow.com/questions/9011524/regex-to-check-whether-a-string-contains-only-numbers/30987109#30987109


function operate(operator, a, b)
{

    const matchOnlyNumberRe = /NaN|-?((\d*\.\d+|\d+)([Ee][+-]?\d+)?|Infinity)$/;
    const numbersValid = a.match(matchOnlyNumberRe) != null && b.match(matchOnlyNumberRe) != null;
    
    if (!numbersValid )
    {
        return;
    }

    
    a = +(a);
    b = +(b);

    switch(operator){
        case "add": 
            return a + b; 
        case "subtract":
            return a - b;
        case "multiply":
            return a * b;
        case "divide": {
            if (b != 0)
            {
                return a / b;
            } 
            throw new Error();
            
        }
    }
}


