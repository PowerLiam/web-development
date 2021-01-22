document.addEventListener("DOMContentLoaded", function(){
    const BUILDING_NUMBER = "BUILDING_NUMBER";
    const AWAITING_NUMBER = "AWAITING_NUMBER";
    const INITIAL_CALCULATOR_STATE = {
        state: BUILDING_NUMBER,
        resultAccumulator: 0,
        operandAccumulator: "0",
        lastOperator: null,
    }

    let calculatorState = {}
    let clearCalculatorState = () => {
        calculatorState.state = INITIAL_CALCULATOR_STATE.state;
        calculatorState.resultAccumulator = INITIAL_CALCULATOR_STATE.resultAccumulator;
        calculatorState.operandAccumulator = INITIAL_CALCULATOR_STATE.operandAccumulator;
        calculatorState.lastOperator = INITIAL_CALCULATOR_STATE.statlastOperatore;
    }


    // This will be populated below when all calculator elements are scanned.
    let displayElement;

    // Update the display based on the current state.
    let updateDisplay = () => {
        switch(calculatorState.state) {
            case BUILDING_NUMBER:
                displayElement.textContent = calculatorState.operandAccumulator;
                break;
            case AWAITING_NUMBER:
                displayElement.textContent = String(calculatorState.resultAccumulator);
                break;
        }
    }

    // Handle any button press.
    let clickHandler = (buttonType, buttonValue) => {
        buttonHandlersByType[buttonType](buttonValue);
        updateDisplay();
    };

    // Handle number button presses.
    let numberHandler = (numberPressed) => {
        switch(calculatorState.state) {
            case BUILDING_NUMBER:
                // Nothing special to do regarding the state,
                break;
            case AWAITING_NUMBER:
                // Initiate the building process for a new operand.
                calculatorState.state = BUILDING_NUMBER;
                break;
        }

        // Incorporate the new digit into the operand accumulator.
        if (calculatorState.operandAccumulator == "0" && numberPressed != ".") {
            calculatorState.operandAccumulator = numberPressed;
        } else {
            calculatorState.operandAccumulator += numberPressed;
        }
    }

    // Handle operator button presses.
    let operatorHandler = (operatorPressed) => {
        // Nothing else matters if C is pressed, just reset everything.
        if (operatorPressed == "C") {
            clearCalculatorState();
            return;
        }

        switch(calculatorState.state) {
            case AWAITING_NUMBER:
                calculatorState.lastOperator = operatorPressed;
                break;
            case BUILDING_NUMBER:
                handleOperand(operatorPressed);
                break;

        }
    }

    // Incorperate the currently accumulated operand into the result using the lastOperator.
    let handleOperand = (operatorPressed) => {
        // This operator signals the end of the number building process. The
        // following steps must be taken to handle the accumulated operand:
        //
        // 1. The operand must be incorperated into the accumulator using the previous
        //    operator saved in the state.  If there is no previous operator, the accumulator
        //    must be SET to the value of the operand.
        //
        // 2. This operator must be saved as the 'new' previous operator in the state.
        //
        // 3. The operand accumulator must be reset to the string "0".
        //
        // 4. The state must be set to AWAITING_NUMBER.
        let operand = parseFloat(calculatorState.operandAccumulator);

        if (calculatorState.lastOperator != null) {
            switch(calculatorState.lastOperator){
                case "+=":
                    calculatorState.resultAccumulator += operand;
                    break;

                case "-":
                    calculatorState.resultAccumulator -= operand;
                    break;

                case "/":
                    calculatorState.resultAccumulator /= operand;
                    break;

                case "x":
                    calculatorState.resultAccumulator *= operand;
                    break;
            }
        } else {
            calculatorState.resultAccumulator = operand;
        }

        calculatorState.lastOperator = operatorPressed;
        calculatorState.operandAccumulator = "0";
        calculatorState.state = AWAITING_NUMBER;
    }



    // Initialize the calculator state
    clearCalculatorState();

    // Attach the click handlers to all the buttons.
    let calculatorRoot = document.getElementById("calculator")
    let calculatorElements = calculatorRoot.children;
    
    let buttonHandlersByType = {
        "number": numberHandler,
        "operator": operatorHandler,
    }

    for (let i = 0; i < calculatorElements.length; i++) {
        let calculatorElement = calculatorElements[i];

        if (calculatorElement.nodeName.toLowerCase() == "button") {

            // Need to close over the values of these RIGHT NOW, rather than their references!
            let buttonType = calculatorElement.dataset.buttonType;
            let buttonValue = calculatorElement.dataset.buttonValue;

            calculatorElement.addEventListener(
                "click", 
                () => clickHandler(buttonType, buttonValue));
        } else if (calculatorElement.nodeName.toLowerCase() == "span") {
            displayElement = calculatorElement;
        }
    }

    // Update the display once to set its initial value.
    updateDisplay();
});