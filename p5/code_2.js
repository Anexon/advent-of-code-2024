export default function Logic(allFileContents) {

    let conditions = [];
    let printInstructions = [];

    let allLines = allFileContents.split(/\r?\n/);
    let enteredInstructionsSection = false;
    for (let line of allLines) {
        if (line === "") {
            enteredInstructionsSection = true;
            continue;
        }

        if (!enteredInstructionsSection) conditions.push(line);
        if (enteredInstructionsSection) printInstructions.push(line.split(","));
    };

    // console.log(conditions)
    // console.log(printInstructions)

    let result = printInstructions.reduce((prev, printInstruction) => {
        let printInstructionValue = +printInstruction[Math.floor(printInstruction.length / 2)]
        const involvedConditions = getInvolvedConditions(conditions, printInstruction)

        let printInstructionIndexes = {};
        for (let [index, printInstructionChunk] of Object.entries(printInstruction)) {
            printInstructionIndexes[printInstructionChunk] = +index;
        }

        let areConditionsMet = areAllConditionsMet(involvedConditions, printInstructionIndexes)
        if (!areConditionsMet) {
            let _fixedIntruction = reorder(involvedConditions, printInstructionIndexes)
            printInstructionIndexes = {}
            for (let [index, printInstructionChunk] of Object.entries(_fixedIntruction)) {
                printInstructionIndexes[printInstructionChunk] = +index;
            }

            areConditionsMet = areAllConditionsMet(involvedConditions, printInstructionIndexes)
            if (!areConditionsMet) {
                console.log("FIXING FAILED")
            } else {
                printInstructionValue = +_fixedIntruction[Math.floor(_fixedIntruction.length / 2)]
            }
        } else {
            printInstructionValue = 0
        }

        return areConditionsMet ? prev + printInstructionValue : prev
    }, 0)

    function reorder(involvedConditions, indexes) {
        return Object.entries(indexes).map(ind => ({
            instruction: ind[0],
            index: ind[1]
        })).sort((piA, piB) => {
            const _involvedConditions = getInvolvedConditions(involvedConditions, [piA.instruction, piB.instruction])
            const [firstInstructionsCondition, _] = _involvedConditions?.[0]?.split("|") ?? [];
            // NO CRITERIA
            if (!firstInstructionsCondition) {
                return 0;
            }
            return firstInstructionsCondition === piA.instruction ? -1 : firstInstructionsCondition === piB.instruction ? 1 : 0
        }).map(pi => pi.instruction)
    }

    function areAllConditionsMet(involvedConditions, printInstructionIndexes) {
        return involvedConditions.every(involvedCondition => {
            const [involvedConditionLeft, involvedConditionRight] = involvedCondition.split("|");
            return printInstructionIndexes[involvedConditionLeft] < printInstructionIndexes[involvedConditionRight]
        })
    }

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

