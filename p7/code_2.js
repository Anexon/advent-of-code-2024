export default function Logic(allFileContents) {
    let allLines = allFileContents.split(/\r?\n/);

    const operators = ["+", "*", "||"];
    const operations = {
        "*": (a, b) => Number(a) * Number(b),
        "+": (a, b) => Number(a) + Number(b),
        "||": (a, b) => Number(`${a}${b}`)
    }
    let totalSum = 0;
    for (let line of allLines) {
        let [result, elementsChunk] = line.split(": ");
        let elements = elementsChunk.split(" ");

        let combinations = Math.pow(operators.length, elements.length - 1);

        // console.log("CALCULATING");
        // console.log(elements)
        // console.log("Combinations: ", combinations)
        // console.log("Result", result)
        for (let i = 0; i < combinations; i++) {
            let operatorsCombination = i.toString(3); // BINARY
            // EXTEND WITH LEFT 0 TO TOTAL NUM OPERATORS
            for (let a = elements.length - operatorsCombination.length - 1; a > 0; a--) {
                operatorsCombination = `0${operatorsCombination}`
            }
            let accValue = +elements[0];
            let _summaryOperation = `${elements[0]}`;
            let _summaryOperators = ``;
            for (let elIndex = 1; elIndex < elements.length; elIndex++) {
                _summaryOperation = `${_summaryOperation} ${operators[+operatorsCombination[elIndex - 1]]} ${elements[elIndex]}`;
                _summaryOperators = `${_summaryOperators} ${operators[+operatorsCombination[elIndex - 1]]}`;
                accValue = operations[operators[+operatorsCombination[elIndex - 1]]](accValue, elements[elIndex])
            }

            // console.log(`ATTEMPT >> ${_summaryOperation} = ${accValue}; ${result}`)
            // console.log(`ATTEMPT >> ${_summaryOperators}`)
            if (accValue === (+result)) {
                console.log(`VALID >> ${_summaryOperation} = ${accValue}; ${result}`)
                totalSum += accValue;
                break;
            }
        }
    };


    return {
        totalSum
    };
}

