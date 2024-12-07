export default function Logic(allFileContents) {

    let conditions = [];
    let printInstructions = [];

    let allLines = allFileContents.split(/\r?\n/);
    let enteringInstructionsSection = false;
    for (let line of allLines) {
        if (line === "") {
            enteringInstructionsSection = true;
            console.log("New Section")
            continue;
        }

        if (!enteringInstructionsSection) conditions.push(line);
        if (enteringInstructionsSection) printInstructions.push(line.split(","));
    };

    // console.log(conditions)
    // console.log(printInstructions)

    let result = printInstructions.reduce((prev, printInstruction) => {
        const printInstructionValue = +printInstruction[Math.floor(printInstruction.length / 2)]
        const involvedConditions = getInvolvedConditions(conditions, printInstruction)

        let printInstructionIndexes = {};
        for (let [index, printInstructionChunk] of Object.entries(printInstruction)) {
            printInstructionIndexes[printInstructionChunk] = +index;
        }

        let areConditionsMet = involvedConditions.every(involvedCondition => {
            const [involvedConditionLeft, involvedConditionRight] = involvedCondition.split("|");
            return printInstructionIndexes[involvedConditionLeft] < printInstructionIndexes[involvedConditionRight]
        })

        return areConditionsMet ? prev + printInstructionValue : prev
    }, 0)

    function getInvolvedConditions(conditions = [], printInstruction = []) {
        let involvedConditions = [];

        for (let printInstructionChunk of printInstruction) {
            let printInstruction_rest = printInstruction.filter(pic => pic !== printInstructionChunk);
            involvedConditions = [...involvedConditions, ...(conditions.filter(c => c.includes(printInstructionChunk) && printInstruction_rest.some(pic => c.includes(pic))) ?? [])]
        }

        return [...new Set(involvedConditions)]
    }

    return {
        result
    };
}

