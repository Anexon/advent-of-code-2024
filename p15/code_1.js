export default function Logic(allFileContents) {

    let [mapText, movementsText] = allFileContents.split(/\n{2}/);

    let map = [];
    let robotLocation = {}
    for (let [row, mapLine] of Object.entries(mapText.split(/\n/))) {
        map.push([]);

        for (let [column, cell] of Object.entries(mapLine.split(""))) {
            map[Number(row)].push(cell);
            if (cell === "@") {
                robotLocation = { row: Number(row), column: Number(column) };
            }
        }
    }

    printMap();
    let movementIndex = 0;
    for (let movement of movementsText.split("\n").join("").split("")) {
        let currentLocation = [robotLocation.row, robotLocation.column];
        let result = moveForward(currentLocation, movement);

        console.log("RESULT ", result)
        if (result === '.') {
            map[currentLocation[0]][currentLocation[1]] = '.'
        }
        printMap();
        movementIndex++;

        if (movementIndex > 2) {
            // break;
        }
    }

    // CALCULATE
    let result = 0;
    for (let [rowIndex, row] of Object.entries(map)) {
        for (let [columnIndex, cell] of Object.entries(row)) {
            if (cell === 'O') {
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

    function moveForward(currentLocation, movement) {
        const MOVEMENTS = {
            "^": [-1, 0], // ROW, COLUMN DELTA
            "<": [0, -1],
            "v": [1, 0],
            ">": [0, 1]
        }

        let cellLocation = [currentLocation[0] + MOVEMENTS[movement][0], currentLocation[1] + MOVEMENTS[movement][1]]
        let cell = map[cellLocation[0]][cellLocation[1]];

        // console.log("CURR LOCATION: ", currentLocation)
        // console.log("MOVEMENT: ", movement, MOVEMENTS[movement])
        // console.log("NEXT LOCATION: ", cellLocation)
        // console.log("FOUND NEXT: ", cell)

        if (cell === '.') { // SPACE
            let currentCell = map[currentLocation[0]][currentLocation[1]];
            map[cellLocation[0]][cellLocation[1]] = currentCell; // MOVE ITEM FORWARD

            if (currentCell === "@") {
                robotLocation.row = cellLocation[0];
                robotLocation.column = cellLocation[1];
            }
            return cell;
        } else if (cell === "O") { // CRATE
            console.log("NEXT: ", cell)
            let nextCell = moveForward(cellLocation, movement);
            if (nextCell === '.') {
                // console.log("SPACE AFTER CRATE")
                let currentCell = map[currentLocation[0]][currentLocation[1]];
                // map[currentLocation[0]][currentLocation[1]] = "."; // MOVE SPACE BACKWARDS
                map[cellLocation[0]][cellLocation[1]] = currentCell; // MOVE SPACE FORWARD

                if (currentCell === "@") {
                    robotLocation.row = cellLocation[0];
                    robotLocation.column = cellLocation[1];
                }
                return nextCell
            } else {
                return;
            }
        } else if (cell === "#") { // WALL
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


