export default function Logic(allFileContents) {
    let allLines = allFileContents.split(/\r?\n/);

    let anthenas = {};
    let anthenasCensus = {}
    const anthenasLocator = /[a-zA-Z0-9]/g
    const mapSize = {
        rows: allLines.length,
        columns: allLines[0].length
    }
    const map = []
    for (let [index, line] of Object.entries(allLines)) {
        map.push([]);
        for (let cell of line) map[index].push(cell);

        let foundAnthenas = line.matchAll(anthenasLocator);

        for (let foundAnthena of foundAnthenas) {
            let anthenaType = foundAnthena[0];
            let anthenaColumn = foundAnthena.index;
            let anthenaRow = index;
            let anthenaTypeValue = anthenasCensus[anthenaType] ?? 0;
            anthenas[`${anthenaType}-${anthenaTypeValue}`] = {
                name: `${anthenaType}-${anthenaTypeValue}`,
                type: anthenaType,
                row: +anthenaRow,
                column: +anthenaColumn
            }
            anthenasCensus[anthenaType] = anthenaTypeValue + 1;
        }
    }

    let anthenasCombinations = [];
    for (let anthenaType of Object.keys(anthenasCensus)) {
        let anthenaGroup = {};
        for (let anthenaName of Object.keys(anthenas)) {
            if (anthenaName.includes(`${anthenaType}-`)) {
                anthenaGroup[anthenaName] = anthenas[anthenaName];
            }
        }
        anthenasCombinations = [...anthenasCombinations, ...generateCombinations(anthenaGroup)];
    }

    // console.log("MAP SIZE: ", mapSize)
    // GENERATE ANTI-NODES
    let antinodes = {};
    for (let anthenasCombination of anthenasCombinations) {
        const [anthenaName1, anthenaName2] = anthenasCombination.split("_");
        const anthena1 = anthenas[anthenaName1];
        const anthena2 = anthenas[anthenaName2];

        // ADD DEFAULT ANTI-NODES PAIR
        antinodes[`${anthena1.row}-${anthena1.column}`] = '#';
        map[anthena1.row][anthena1.column] = '#';
        antinodes[`${anthena2.row}-${anthena2.column}`] = '#';
        map[anthena1.row][anthena1.column] = '#';

        let antinodeIteration = 2;
        let antinode1 = { row: antinodeIteration * anthena1.row - anthena2.row, column: antinodeIteration * anthena1.column - anthena2.column };
        let antinode2 = { row: antinodeIteration * anthena2.row - anthena1.row, column: antinodeIteration * anthena2.column - anthena1.column };
        while ((!isNodeOffmap(mapSize, antinode1) || !isNodeOffmap(mapSize, antinode2)) &&
            antinodeIteration < 100 // SAFETY BREAK
        ) {
            // console.log("COMBINATION", anthenasCombination, antinode1, antinode2, !isNodeOffmap(mapSize, antinode1), !isNodeOffmap(mapSize, antinode2),
            //     antinodeIteration < 100)
            if (!isNodeOffmap(mapSize, antinode1)) {
                antinodes[`${antinode1.row}-${antinode1.column}`] = '#';
                map[antinode1.row][antinode1.column] = '#';
            }
            if (!isNodeOffmap(mapSize, antinode2)) {
                antinodes[`${antinode2.row}-${antinode2.column}`] = '#';
                map[antinode2.row][antinode2.column] = '#';
            }
            antinodeIteration += 1;
            antinode1 = { row: antinodeIteration * anthena1.row - (antinodeIteration - 1) * anthena2.row, column: antinodeIteration * anthena1.column - (antinodeIteration - 1) * anthena2.column };
            antinode2 = { row: antinodeIteration * anthena2.row - (antinodeIteration - 1) * anthena1.row, column: antinodeIteration * anthena2.column - (antinodeIteration - 1) * anthena1.column };
        }

        // console.log(antinode1, isNodeOffmap(mapSize, antinode1));
        // console.log(antinode2, isNodeOffmap(mapSize, antinode2));
    }
    let totalAntinodes = Object.keys(antinodes).length;

    function isNodeOffmap(mapSize, node) {
        return node.row < 0 || node.column < 0 || node.row >= mapSize.rows || node.column >= mapSize.columns
    }

    function generateCombinations(elements = {}) {
        let combinations = {};
        for (let [elementName, element] of Object.entries(elements)) {
            for (let [_elementName, _element] of Object.entries(elements)) {
                // OTHER ELEMENTS
                if (_elementName !== elementName) {
                    // SKIP PERMUTATIONS
                    if (!combinations[`${elementName}_${_elementName}`] && !combinations[`${_elementName}_${elementName}`]) {
                        combinations[`${elementName}_${_elementName}`] = 1
                    }
                }
            }
        }

        return Object.keys(combinations);
    }


    // console.log(map.map(line => line.join("")).join("\n"))
    return {
        totalAntinodes
    };
}

