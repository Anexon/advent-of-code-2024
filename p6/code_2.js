export default function Logic(allFileContents) {
    let allLines = allFileContents.split(/\r?\n/);
    let guard = {
        location: { row: 0, column: 0 },
        orientation: "",
        is_out: false,
        hit_synthetic_block: false
    };
    let map = []
    allLines.forEach((line, rowIndex) => {
        map.push([]);
        for (let [columnIndex, cell] of Object.entries(line)) {
            if (["^", ">", "<", "v"].some(o => o === cell)) {
                guard.location = { row: +rowIndex, column: +columnIndex };
                guard.orientation = cell;
                map[rowIndex].push("X")
            } else {
                map[rowIndex].push(cell)
            }
        }
    });

    let blocksIndexes = getBlocksIndexes(map);

    // GET ORIGINAL PATH
    let safetyBreak = 0;
    let simulatedGuard = structuredClone(guard);
    let originalPathMap = structuredClone(map);
    while (!simulatedGuard.is_out & safetyBreak < 10000) {
        simulatedGuard = guardNext(originalPathMap, simulatedGuard, "watch");
        safetyBreak += 1
    }

    // GET POINTS OF INTEREST
    let potentialBlocksLocations = getPotentialBlocksLocations(originalPathMap, blocksIndexes, guard);
    console.log(potentialBlocksLocations)
    console.log(potentialBlocksLocations.length)
    let loopingBlocks = [];
    for (let potentialBlockLocation of potentialBlocksLocations) {
        // console.log(potentialBlockLocation)

        let loopingGuard = structuredClone(guard);
        let loopingMap = structuredClone(map);
        let loopingGuardSnapshots = [];
        // PLACE BLOCK
        loopingMap[potentialBlockLocation.row][potentialBlockLocation.column] = "O";
        safetyBreak = 0;

        let _isGuardLooping = false;
        do {
            let _guardSnapshot = structuredClone(loopingGuard)
            loopingGuard = guardNext(loopingMap, loopingGuard);
            _isGuardLooping = isGuardLooping(loopingGuard, loopingGuardSnapshots)
            if (loopingGuard.is_turning) {
                loopingGuardSnapshots.push(_guardSnapshot);
            }
            safetyBreak += 1
        } while (!isGuardLooping(loopingGuard, loopingGuardSnapshots) && !loopingGuard.is_out && safetyBreak <= 10000)

        if (isGuardLooping(loopingGuard, loopingGuardSnapshots)
        ) {
            loopingBlocks.push(potentialBlockLocation);
        }
    }
    let result = loopingBlocks.length

    function isGuardLooping(guard, guardSnapshots) {
        return guardSnapshots.some(guardSnapshot => guardSnapshot.orientation === guard.orientation &&
            guardSnapshot.location.row == guard.location.row &&
            guardSnapshot.location.column === guard.location.column
        )
    }
    function getBlocksIndexes(map = [[]]) {
        let blocksIndexes = [];
        for (let [rowIndex, row] of Object.entries(map)) {
            for (let [columnIndex, cell] of Object.entries(row)) {
                if (cell === "#") {
                    blocksIndexes.push({ row: +rowIndex, column: +columnIndex });
                }
            }
        }
        return blocksIndexes;
    }

    function getPotentialBlocksLocations(map = [[]], blocksIndexes, guard) {
        let potentialBlocksLocations = {}


        for (let [rowIndex, row] of Object.entries(map)) {
            for (let [columnIndex, cell] of Object.entries(row)) {
                if (cell === "X") {
                    potentialBlocksLocations[`${rowIndex}-${columnIndex}`] = { row: +rowIndex, column: +columnIndex }
                }
            }
        }
        // IMPROVEMENT FILTER OUT CANDIDATES
        return Object.entries(potentialBlocksLocations).map(entry => entry[1]);
    }

    function guardNext(map, guard, mode) {
        let _guard = Object.assign({}, guard);
        _guard.is_turning = false;
        const mapRowsNum = map.length;
        const mapColumnsNum = map[0].length;
        const MOVEMENTS = {
            "^": [_guard.location.row - 1, _guard.location.column, ">", "|"],
            ">": [_guard.location.row, _guard.location.column + 1, "v", "-"],
            "<": [_guard.location.row, _guard.location.column - 1, "^", "-"],
            "v": [_guard.location.row + 1, _guard.location.column, "<", "|"]
        }
        const [nextRow, nextColumn, nextOrientation, traceType] = MOVEMENTS[_guard.orientation];
        if ((nextRow === mapRowsNum ||
            nextRow === 0 ||
            nextColumn === mapColumnsNum ||
            nextColumn === 0) &&
            !["#", "O"].some(obstacle => obstacle === map?.[nextRow]?.[nextColumn])) {
            _guard.location.row = nextRow;
            _guard.location.column = nextColumn;
            _guard.is_out = true;
        } else if (["#", "O"].some(trace => map[nextRow][nextColumn] === trace)) {
            _guard.orientation = nextOrientation;
            _guard.is_turning = true;
            if (mode !== "watch") {
                map[_guard.location.row][_guard.location.column] = "+"
            }
        } else {
            if (map[nextRow][nextColumn] === '-' && (_guard.orientation === '^' || _guard.orientation === 'v')) {
                map[nextRow][nextColumn] = mode !== "watch" ? "+" : "X"
            } else if (map[nextRow][nextColumn] === '|' && (_guard.orientation === '<' || _guard.orientation === '>')) {
                map[nextRow][nextColumn] = mode !== "watch" ? "+" : "X"
            } else if (map[nextRow][nextColumn] === '+') {
                map[nextRow][nextColumn] = mode !== "watch" ? "+" : "X"
            } else {
                map[nextRow][nextColumn] = mode !== "watch" ? traceType : "X"
            }
            _guard.location.row = nextRow;
            _guard.location.column = nextColumn;
        }
        return _guard;
    }

    return {
        is_out: guard.is_out,
        result
    };
}

// 1360