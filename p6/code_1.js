export default function Logic(allFileContents) {
    let allLines = allFileContents.split(/\r?\n/);
    let guard = {
        location: { row: 0, column: 0 },
        orientation: "",
        is_out: false
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

    let safetyBreak = 0;
    while (!guard.is_out & safetyBreak < 10000) {
        guard = guardNext(map, guard);
        safetyBreak += 1
    }

    let result = map.reduce((prev, curr) => {
        let rowResult = curr.reduce((_prev, _curr) => {
            return _curr === "X" ? _prev + 1 : _prev
        }, 0)

        return prev + rowResult
    }, 0)

    function guardNext(map, guard) {
        let _guard = Object.assign({}, guard);
        const mapRowsNum = map.length;
        const mapColumnsNum = map[0].length;
        const MOVEMENTS = {
            "^": [_guard.location.row - 1, _guard.location.column, ">"],
            ">": [_guard.location.row, _guard.location.column + 1, "v"],
            "<": [_guard.location.row, _guard.location.column - 1, "^"],
            "v": [_guard.location.row + 1, _guard.location.column, "<"]
        }
        const [nextRow, nextColumn, nextOrientation] = MOVEMENTS[_guard.orientation];
        if ((nextRow === mapRowsNum || nextRow === 0 || nextColumn === mapColumnsNum || nextColumn === 0) && map?.[nextRow]?.[nextColumn] !== "#") {
            _guard.location.row = nextRow;
            _guard.location.column = nextColumn;
            _guard.is_out = true;
        } else if (map[nextRow][nextColumn] === "#") {
            _guard.orientation = nextOrientation;
        } else {
            map[nextRow][nextColumn] = "X"
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

