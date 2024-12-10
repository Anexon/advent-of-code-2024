export default function Logic(allFileContents) {
    let allLines = allFileContents.split(/\r?\n/);

    let mapSize = {
        rows: allLines.length,
        columns: allLines[0].length
    }
    let trailHeadsRegex = /0/g;
    let trailHeads = [];
    let map = [];
    for (let [index, line] of Object.entries(allLines)) {
        map.push(line.split(""))
        const _trailHeads = [...line.matchAll(trailHeadsRegex)];
        if (_trailHeads.length > 0) {
            for (let trailHead of _trailHeads) {
                trailHeads.push({
                    row: +index,
                    column: +trailHead.index
                })
            }
        }
    }
    console.log(trailHeads)

    console.log(map.map(el => el.join("")).join("\n"))

    let finalPoints = 0;
    for (let trail of trailHeads) {
        let finalLocations = []
        evaluateTrail(trail, 0, finalLocations)
        console.log(finalLocations);
        // finalPoints += [...new Set(finalLocations)].length
        finalPoints += finalLocations.length
    }

    function evaluateTrail(startingLocation, currentStep = 0, discoveredEndLocations = []) {
        // console.log("EVALUATING TRAIL: ", currentStep, startingLocation)
        if (currentStep === 9) {
            discoveredEndLocations.push(`${startingLocation.row}-${startingLocation.column}`);
        }
        const checkLocation = {
            "UP": () => startingLocation.row > 0 ? (Number(map[startingLocation.row - 1][startingLocation.column]) ?? 0) - currentStep === 1 : false,
            "DOWN": () => startingLocation.row < mapSize.rows - 1 ? (Number(map[startingLocation.row + 1][startingLocation.column]) ?? 0) - currentStep === 1 : false,
            "LEFT": () => startingLocation.column > 0 ? (Number(map[startingLocation.row][startingLocation.column - 1]) ?? 0) - currentStep === 1 : false,
            "RIGHT": () => startingLocation.column < mapSize.columns ? (Number(map[startingLocation.row][startingLocation.column + 1]) ?? 0) - currentStep === 1 : false
        }

        if (checkLocation.UP()) {
            // console.log("UP", currentStep + 1)
            evaluateTrail({
                row: startingLocation.row - 1,
                column: startingLocation.column
            }, currentStep + 1, discoveredEndLocations)
        }
        if (checkLocation.DOWN()) {
            // console.log("DOWN", currentStep + 1)
            evaluateTrail({
                row: startingLocation.row + 1,
                column: startingLocation.column
            }, currentStep + 1, discoveredEndLocations)
        }
        if (checkLocation.LEFT()) {
            // console.log("LEFT", currentStep + 1)
            evaluateTrail({
                row: startingLocation.row,
                column: startingLocation.column - 1
            }, currentStep + 1, discoveredEndLocations)
        }
        if (checkLocation.RIGHT()) {
            // console.log("RIGHT", currentStep + 1)
            evaluateTrail({
                row: startingLocation.row,
                column: startingLocation.column + 1
            }, currentStep + 1, discoveredEndLocations)
        }
    }

    return {
        finalPoints
    };
}
