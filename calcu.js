document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("keys").addEventListener("click", function(e) {
        perform(e);
        addOp(e);
        calculate(e);
        clearAll(e);
        stripLast(e);
        percentage(e);
    });

    //link; <a></a> in html
    document.querySelector(".seehistory").addEventListener("click", function() {
        window.location.href = "Calcu_History.html"; //to link another html
    });

    //declare empty display count
    let number = "0";
    //memory for calculator; no operator selected yet; changes many times
    let storedOperator = null; 
    //no first number; only changes once
    let firstOperand = null;
    //saving array;
    let past = [];
    //creating display variable; used in assigning value(number)
    const display = document.getElementById("display");
    //empty history array

    function perform(e) { //mainly for displaying input, not including operators
        //e.target- where did the click/event happened?; .closest - find the closest .digit to the event; not a loop
        const digitBttn = e.target.closest(".digit"); //value extracted during event handler

        //conditionals
        if (digitBttn !== null) { 
            const val = digitBttn.dataset.button; //digitBttn - holds entire html element; conversion to dataset.button/reading data attribute; js
            const lastChar = number.slice(-1);
            const decimal = "0."
            // // - converts normal string to regular expression
            // [] - class set; match any
            // \ - to escape special meaning
            const splitNum = number.split(/[+\-*/]/);
            
            if (val === "." && splitNum.at(-1).includes(".")) { //prevent multiple decimal
                return; //stop the function then exits
            } else if ((val === ".") && (["+", "-", "*", "/"].includes(lastChar))) {
                number += decimal;
            //prevent +03(e.g.); replaces the initial "0" with whatever digit button was clicked—provided that digit is not a decimal point; mainly for 0.22222 numbers
            } else if (val !== "." && splitNum.at(-1) === "0") { //gets last array
                number = number.slice(0, -1) + val;
            } else {
                //append
                number += val; 
            }
            const cleanExp = number.replaceAll('*', '×').replaceAll('/', '÷');
            display.textContent = cleanExp; 
            display.scrollLeft = display.scrollWidth; //calculate whole width then scroll to leftmost side
            //saves raw number without hitting equal button without an operator
            localStorage.setItem("currentDisplay", number);
        }
    }

    function addOp(e) { //clicking operator buttons
        const opBttn = e.target.closest(".op");

        if (opBttn !== null) {
            const selectedOperator = opBttn.dataset.opbutton; //all lowercase in js

            //if double operators
            //prevent double operations in a row
            const lastChar = number.slice(-1); //-1 means the "last" character
            if (["+", "-", "*", "/"].includes(lastChar)) {
                number = number.slice(0, -1) + selectedOperator; 
                storedOperator = selectedOperator; //taking note of the latest operator
                const cleanExp = number.replaceAll('*', '×').replaceAll('/', '÷');
                display.textContent = cleanExp;
                display.scrollLeft = display.scrollWidth;
                return;
            } 
            
            //if valid operator and first number
            if (firstOperand === null) {
                firstOperand = number; //for memory
            }

            //if valid operator and not first number
            //append operator to the string
            storedOperator = selectedOperator;
            number += storedOperator; 

            //for * and /
            //('to be replace', 'replacement')
            const cleanExp = number.replaceAll('*', '×').replaceAll('/', '÷');

            display.textContent = cleanExp;
            display.scrollLeft = display.scrollWidth;
            //saves raw number without hitting equal button with an operator
            localStorage.setItem("currentDisplay", number);

        }  
    }

    function calculate(e) {
        const eBttn = e.target.closest(".equals");

        if (eBttn !== null) {
            //remove trailing operators
            if (["+", "-", "*", "/", "."].includes(number.slice(-1))) {
                number = number.slice(0, -1);
            }

            //sanity check or the allowed char list
            // /   / - everything inside is treated "literally"
            // + - match one or more char
            //test - boolean test
            if (/^[0-9+*/.-]+$/.test(number)) {
                const rawExp = number;
              
                //Function - brand new function object from a string; converts string to value; lowercase is for custom functions
                //"return" - executes the function
                const result = Function("return " + rawExp)();
                //round up
                //string - prepares for display, calculators expects string of numbers, not literal numbers
                //+ - remove trailing zeros as js do not store these
                // .toPrecision - float limitation then rounds up (domino effect)
                const cleanResult = String(+result.toPrecision(12));
                display.textContent = cleanResult;
                number = String(cleanResult); //or you can do this: number = "0"; converts value to string so you can start new operations immediately
                firstOperand = null;
                storedOperator = null;

                //adding to history array
                const exp = `${rawExp} = ${cleanResult}`;
                past.push(exp);
                //saving array
                localStorage.setItem("myResult", JSON.stringify(past));
                //saves result for page refresh
                localStorage.setItem("currentDisplay", number);
            }
        }  
    }

    function clearAll(e) {
        const cBttn = e.target.closest(".clears");

        if (cBttn !== null) {
            number = "0"; 
            storedOperator = null;
            firstOperand = null;
            display.textContent = number;
            localStorage.setItem("currentDisplay", number);
        }
    }

    function stripLast(e) {
        const sBttn = e.target.closest(".strip");

        if (sBttn !== null) {
            number = number.slice(0, -1);

            //erased to emptiness, fallback to "0"
            if (number === "") {
                number = "0";
            }

            display.textContent = number;
            display.scrollLeft = display.scrollWidth;
            localStorage.setItem("currentDisplay", number);
        }
    }

    function percentage(e) { //clicking but not displaying the symbol itself, acts like an immediate equal sign for that certain string index; also applicable in simultaneous percent signs
        const pBttn = e.target.closest(".percent");
      
        if (pBttn !== null) {
            //doesn't need this because the symbol is not displayed: const percent = pBttn.dataset.perbutton; 

            //overwriting an operator when typing a percent sign like in calculate
            if (["+", "-", "*", "/", "."].includes(number.slice(-1))) {
                number = number.slice(0, -1);
            }

            //find the index of the last operator in the string after clicking percentage
            const opIndex = Math.max( //find largest number (index)
                number.lastIndexOf('+'),
                number.lastIndexOf('-'),
                number.lastIndexOf('*'),
                number.lastIndexOf('/')
            );

            let prefix = ""; //will hold everything before the last operator and including the operator itself
            let current = ""; //will hold the active number after the last operator

            if (opIndex !== -1) { //-1 means no operator was found
                //substring cuts specific portion of a string without altering others
                prefix = number.substring(0, opIndex + 1); //getting everything on the right side of the string with percent
                current = number.substring(opIndex + 1); //leaving out the "end" gets all the numbers before the percentage symbol including the symbol
            } else { //just number and percent as the first input
                prefix = "";
                current = number;
            };

            if (current === "") { //if the person clicks on the button after an operator or if the person just clicks on percentage then equal sign
                return;
            };

            const per = current / 100; 

            number = prefix + per;

            display.textContent = number;
            display.scrollLeft = display.scrollWidth;
            localStorage.setItem("currentDisplay", number);
        }
    }

    //loading array
    function load() {
        let saved = localStorage.getItem("myResult");
        if (saved !== null) {
            past = JSON.parse(saved); //from orig js file to array in second file
        }
    }

    //loading display
    function displayLoad() {
        let f = localStorage.getItem("currentDisplay");
        if (f !== null) {
            number = f;
            display.textContent = number;
        } 
    }

    load();
    displayLoad(); //don't put inside seeHistory to prevent override

});