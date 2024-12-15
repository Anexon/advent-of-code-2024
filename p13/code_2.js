export default function Logic(allFileContents) {
    const rGetButtonName = /(?<=Button )(.*)(?=:)/;
    const rGetButtonX = /(?<=X\+)(.*)(?=,)/;
    const rGetButtonY = /(?<=Y\+)(.*)/;
    const rGetPrizeX = /(?<=X\=)(.*)(?=,)/;
    const rGetPrizeY = /(?<=Y\=)(.*)/;

    let machines = allFileContents.split(/\n{2}/);
    let wins = 0n;

    for (let [index, machine] of Object.entries(machines)) {
        const { buttons, prize } = extractMachineInstructions(machine);

        let [buttonB, buttonA] = buttons;
        let [won, updatedButtons] = machineEval(buttonB, buttonA, prize);
        wins += won ? updatedButtons.reduce((prev, curr) => prev + curr.hits * (curr.name === 'A' ? 3n : 1n), 0n) : 0n;

        console.log(`Machine ${index}`, won, wins);

    }

    function machineEval(buttonB, buttonA, prize) {

        // EVALUATE 0 B
        buttonB.hits = 0n;
        buttonA.hits = prize.x / buttonA.movementX > prize.y / buttonA.movementY ? prize.y / buttonA.movementY : prize.x / buttonA.movementX;
        let fallbackRest = calculateRest(buttonB, buttonA, prize);

        let maxBHits = prize.x / buttonB.movementX > prize.y / buttonB.movementY ? prize.y / buttonB.movementY : prize.x / buttonB.movementX;
        buttonB.hits = maxBHits;

        let shouldStop = false;
        let index = 0;
        let distance = prize.x + prize.y;
        let previousDistance = distance;
        let stepSize = (maxBHits + maxBHits % 2n) / 2n;
        while (!shouldStop) {
            buttonA.hits = 0n;
            let rest = calculateRest(buttonB, buttonA, prize);
            distance = rest.x + rest.y;
            if (rest.x === 0n && rest.y === 0n) {
                shouldStop = true;
            } else {
                let maxAHits = rest.x / buttonA.movementX > rest.y / buttonA.movementY ? rest.y / buttonA.movementY : rest.x / buttonA.movementX;
                buttonA.hits = maxAHits;

                let restWithA = calculateRest(buttonB, buttonA, prize);

                distance = restWithA.x + restWithA.y;

                // console.log(stepSize, previousStepSize, buttonB.hits, distance, previousDistance);
                if (restWithA.x === 0n && restWithA.y === 0n) {
                    shouldStop = true;
                    previousDistance = distance;
                } else {
                    // console.log("DISTANCE: ", distance.toString());
                    if (previousDistance - distance > 0n && distance >= 0n) {
                        // console.log("GETTING CLOSER");
                    } else {
                        // console.log("SWAP DIRECTION");
                        let stepSign = stepSize < 0n ? -1n : 1n;
                        let newStepSize = ((stepSize * -1n) + (stepSize % 2n)) / 2n;
                        stepSize = newStepSize > 0n || newStepSize < 0n ? newStepSize : stepSign;
                    }
                    buttonB.hits -= stepSize;
                }
                previousDistance = distance;
            }
            // console.log(stepSize)
            index += 1;
            if (index > 500) {
                shouldStop = 1;
            }
        }

        let rest = calculateRest(buttonB, buttonA, prize);

        return [rest.x === 0n && rest.y === 0n || fallbackRest.x === 0n && fallbackRest.y === 0n, [buttonB, buttonA]];
    }

    function calculateRest(buttonB, buttonA, prize) {
        let xDiff = prize.x - buttonB.movementX * buttonB.hits - buttonA.movementX * buttonA.hits;
        let yDiff = prize.y - buttonB.movementY * buttonB.hits - buttonA.movementY * buttonA.hits;

        return { x: xDiff, y: yDiff }
    }

    function extractMachineInstructions(machine) {
        let buttons = [];
        let prize = {};
        for (let instruction of machine.split(/\n/)) {
            if (instruction.includes("Button")) {
                buttons.push({
                    name: [...instruction.match(rGetButtonName)]?.[0]?.[0],
                    movementX: BigInt(instruction.match(rGetButtonX)?.[0]),
                    movementY: BigInt(instruction.match(rGetButtonY)?.[0]),
                    hits: 0n
                })
            } else if (instruction.includes("Prize")) {
                prize = {
                    x: 10000000000000n + BigInt(`${instruction.match(rGetPrizeX)?.[0]}`),
                    y: 10000000000000n + BigInt(`${instruction.match(rGetPrizeY)?.[0]}`)
                }
            }
        }
        return {
            buttons: buttons.sort((a, b) => a.name < b.name ? 1 : a.name > b.name ? -1 : 0),
            prize
        }
    }


    return {
        wins
    };
}


