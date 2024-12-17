export default function Logic(allFileContents) {

    let explorerStack = new Set();
    let [mapText, movementsText] = allFileContents.split(/\n{2}/);
    const double = {
        ".": [".", "."],
        "@": ["@", "."],
        "#": ["#", "#"],
        "O": ["[", "]"]
    }
    let map = [];
    let robotLocation = {}
    for (let [row, mapLine] of Object.entries(mapText.split(/\n/))) {
        map.push([]);

        for (let [column, cell] of Object.entries(mapLine.split(""))) {

            map[Number(row)].push(double[cell][0]);
            map[Number(row)].push(double[cell][1]);
            if (cell === "@") {
                robotLocation = { row: Number(row), column: Number(column) * 2 };
            }
        }
    }

    printMap();
    let movementIndex = 0;
    for (let movement of movementsText.split("\n").join("").split("")) {
        explorerStack = new Set();
        let currentLocation = [robotLocation.row, robotLocation.column];

        // console.log(`#${movementIndex}`)
        // console.log(robotLocation)
        // console.log("MOVING ", movement)
        let result = moveForward(currentLocation, movement);
        // console.log("RESULT ", result)
        if (result === '.') {
            map[currentLocation[0]][currentLocation[1]] = '.'
        }
        printMap();
        // if (movementIndex > 400) {
        //     break;
        // }
        movementIndex++;
    }

    // printMap();
    // CALCULATE
    let result = 0;
    for (let [rowIndex, row] of Object.entries(map)) {
        for (let [columnIndex, cell] of Object.entries(row)) {
            if (cell === '[') {
                result += 100 * Number(rowIndex) + Number(columnIndex)
            }
        }
    }

    console.log("GPS: ", result)

    function printMap() {
        let mapToPrint = "";
        for (let row of map) {
            mapToPrint += row.join("") + "\n"
        }
        console.log(mapToPrint)
    }

    function moveForward(currentLocation, movement, depth = 0, checkOnly = false) {
        const MOVEMENTS = {
            "^": [-1, 0], // ROW, COLUMN DELTA
            "<": [0, -1],
            "v": [1, 0],
            ">": [0, 1]
        }

        let currentCell = map[currentLocation[0]][currentLocation[1]];
        let nextCellLocation = [currentLocation[0] + MOVEMENTS[movement][0], currentLocation[1] + MOVEMENTS[movement][1]]
        let nextCell = map[nextCellLocation[0]][nextCellLocation[1]];
        let isMovingHorizontally = movement === '<' || movement === '>';
        // console.log("CURR LOCATION: ", currentLocation, "NEXT LOCATION: ", nextCellLocation)
        // console.log("FOUND NEXT: ", nextCell)
        // console.log("SIMULATING: ", checkOnly, "DEPTH: ", depth)
        // console.log("\n")

        if (nextCell === '.') { // SPACE
            if (!checkOnly) {
                map[nextCellLocation[0]][nextCellLocation[1]] = currentCell; // MOVE ITEM FORWARD
                map[currentLocation[0]][currentLocation[1]] = nextCell; // DRAG PREVIOUS

                if (currentCell === "@") {
                    robotLocation.row = nextCellLocation[0];
                    robotLocation.column = nextCellLocation[1];
                }
            }
            return nextCell;
        } else if ((nextCell === "[" || nextCell === "]") && isMovingHorizontally) { // HORIZONTAL CRATE
            let movedCell = moveForward(nextCellLocation, movement, depth + 1);
            if (movedCell === '.') {
                // console.log("SPACE AFTER CRATE")
                if (!checkOnly) {
                    map[nextCellLocation[0]][nextCellLocation[1]] = currentCell; // MOVE SPACE FORWARD

                    if (currentCell === "@") {
                        robotLocation.row = nextCellLocation[0];
                        robotLocation.column = nextCellLocation[1];
                    }
                }
                return movedCell
            } else {
                return;
            }
        } else if ((nextCell === "[" || nextCell === "]") && !isMovingHorizontally) { // VETICAL CRATE
            let nextCellLocation2 = [nextCellLocation[0], nextCellLocation[1] + (nextCell === '[' ? 1 : -1)];
            let result1 = moveForward(nextCellLocation, movement, depth + 1, true);
            let result2 = moveForward(nextCellLocation2, movement, depth + 1, true);

            if (result1 === '.' && result2 === '.') {
                if (!checkOnly) {
                    if (!explorerStack.has(`${nextCellLocation[0]}-${nextCellLocation[1]}`)) {
                        explorerStack.add(`${nextCellLocation[0]}-${nextCellLocation[1]}`);
                        moveForward(nextCellLocation, movement, depth + 1);
                    }
                    if (!explorerStack.has(`${nextCellLocation2[0]}-${nextCellLocation2[1]}`)) {
                        explorerStack.add(`${nextCellLocation2[0]}-${nextCellLocation2[1]}`);
                        moveForward(nextCellLocation2, movement, depth + 1);
                    }

                    map[nextCellLocation[0]][nextCellLocation[1]] = currentCell;
                    map[nextCellLocation2[0]][nextCellLocation2[1]] = '.'

                    if (currentCell === "@") {
                        robotLocation.row = nextCellLocation[0];
                        robotLocation.column = nextCellLocation[1];
                    }
                }
                return '.';
            } else {
                return;
            }
        } else if (nextCell === "#") { // WALL
            return;
        } else {
            return;
        }

    }

    // console.log(map);
    // console.log(robotLocation);

    return {
        result: 1
    };
}


