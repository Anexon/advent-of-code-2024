export default function Logic(allFileContents) {
    const sequence = "XMAS";
    let sequenceIndexes = {};
    for (let s of sequence) {
        sequenceIndexes[s] = [];
    }
    let allLines = allFileContents.split(/\r?\n/);
    let mapSize = [allLines[0].length, allLines.length];
    allLines.forEach((line, lineIndex) => {
        for (let [index, char] of Object.entries(line)) {
            if (!!sequenceIndexes[char]) {
                sequenceIndexes[char].push({ x: +index, y: +lineIndex })
            }
        }
    });

    let sequenceIndexesKeys = Object.keys(sequenceIndexes);
    let grownIndexes = sequenceIndexes["X"];
    for (let i = 1; i < Object.keys(sequenceIndexes).length; i++) {
        grownIndexes = growIndexes(mapSize, grownIndexes, sequenceIndexes[sequenceIndexesKeys[i]]);
    }

    let totalSequences = grownIndexes.length

    function growIndexes(mapSize, indexes, nextIndexes) {
        const allDirectionsGrowth = [
            [0, 1], [0, -1], [1, 0], [1, 1], [1, -1], [-1, 0], [-1, -1], [-1, 1]
        ]
        let grownIndexes = [];
        for (let index of indexes) {
            for (let growthDirection of allDirectionsGrowth) {
                let grownX = index.x + growthDirection[0];
                let grownY = index.y + growthDirection[1];
                if (
                    (grownX >= 0 && grownX < mapSize[0]) &&
                    (grownY >= 0 && grownY < mapSize[1]) &&
                    (!index.growthDirection || index.growthDirection[0] === growthDirection[0]) &&
                    (!index.growthDirection || index.growthDirection[1] === growthDirection[1]) &&
                    nextIndexes.some(nextIndex => nextIndex.x === grownX && nextIndex.y === grownY)
                ) {
                    grownIndexes.push({ x: +grownX, y: +grownY, growthDirection: growthDirection })
                }
            }
        }
        return grownIndexes;
    }


    return {
        totalSequences
    };
}

