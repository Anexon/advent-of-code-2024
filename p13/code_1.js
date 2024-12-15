export default function Logic(allFileContents) {
    const rGetButtonName = /(?<=Button )(.*)(?=:)/;
    const rGetButtonX = /(?<=X\+)(.*)(?=,)/;
    const rGetButtonY = /(?<=Y\+)(.*)/;
    const rGetPrizeX = /(?<=X\=)(.*)(?=,)/;
    const rGetPrizeY = /(?<=Y\=)(.*)/;

    let machines = allFileContents.split(/\n{2}/);
    let wins = 0;

    for (let [index, machine] of Object.entries(machines)) {
        const { buttons, prize } = extractMachineInstructions(machine);

        // EVALUATE MACHINE
        let [updatedButtons, win] = fillWithCheapestMovements(buttons, prize)

        wins += win ? updatedButtons.reduce((prev, curr) => prev + curr.hits * (curr.name === 'A' ? 3 : 1), 0) : 0;
        console.log(`Machine ${index}`, win, wins);

    }

    function fillWithCheapestMovements(buttons, prize) {
        let button = buttons[0];
        let otherButtons = buttons.slice(1);
        let maxHits = Math.min(Math.floor(prize.x / button.movementX), Math.floor(prize.y / button.movementY), 100);
        let win = false;
        let noMoreButtons = false;
        button.hits = maxHits;
        do {
            let { win: _win, rest } = evaluateMachine([button], prize);

            if (_win) {
                win = _win;
            } else if (otherButtons.length > 0) {
                let [
                    _otherButtons,
                    innerWin
                ] = fillWithCheapestMovements(otherButtons, rest);
                if (innerWin) {
                    otherButtons = _otherButtons;
                } else {
                    button.hits -= 1;
                }
                win = innerWin;
            } else {
                noMoreButtons = true;
            }
        } while (!win && button.hits >= 0 && !noMoreButtons);

        return [[button, ...otherButtons], win];
    }

    function evaluateMachine(buttons, prize) {
        let fullDisplacement = buttons.reduce((prev, currButton) =>
            [
                prev[0] + (currButton.hits ?? 0) * currButton.movementX,
                prev[1] + (currButton.hits ?? 0) * currButton.movementY
            ], [0, 0]);
        return {
            win: prize.x - fullDisplacement[0] === 0 && prize.y - fullDisplacement[1] === 0,
            rest: {
                x: prize.x - fullDisplacement[0], y: prize.y - fullDisplacement[1]
            }
        }
    }

    function extractMachineInstructions(machine) {
        let buttons = [];
        let prize = {};
        for (let instruction of machine.split(/\n/)) {
            if (instruction.includes("Button")) {
                buttons.push({
                    name: [...instruction.match(rGetButtonName)]?.[0]?.[0],
                    movementX: Number(instruction.match(rGetButtonX)?.[0]),
                    movementY: Number(instruction.match(rGetButtonY)?.[0]),
                    hits: 0
                })
            } else if (instruction.includes("Prize")) {
                prize = {
                    x: Number(instruction.match(rGetPrizeX)?.[0]),
                    y: Number(instruction.match(rGetPrizeY)?.[0])
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


