export default function Logic(allFileContents) {
    const xSequence = "MAS";
    let sequenceIndexes = {};
    for (let s of xSequence) {
        sequenceIndexes[s] = [];
    }
    let allLines = allFileContents.split(/\r?\n/);
    allLines.forEach((line, lineIndex) => {
        for (let [index, char] of Object.entries(line)) {
            if (!!sequenceIndexes[char]) {
                sequenceIndexes[char].push({ x: +index, y: +lineIndex })
            }
        }
    });

    const xGrowthDirections = [
        [1, 1], [1, -1]
    ]
    let xMasCount = 0;
    for (let index of sequenceIndexes["A"]) {
        if (xGrowthDirections.every(xGrowthDirection => {
            let grownX_1 = index.x + xGrowthDirection[0];
            let grownY_1 = index.y + xGrowthDirection[1];
            let grownX_2 = index.x + xGrowthDirection[0] * -1; // SIMETRIC
            let grownY_2 = index.y + xGrowthDirection[1] * -1; // SIMETRIC

            return (sequenceIndexes["M"].some(mIndex => mIndex.x === grownX_1 && mIndex.y === grownY_1) &&
                sequenceIndexes["S"].some(sIndex => sIndex.x === grownX_2 && sIndex.y === grownY_2)) ||
                (sequenceIndexes["M"].some(mIndex => mIndex.x === grownX_2 && mIndex.y === grownY_2) &&
                    sequenceIndexes["S"].some(sIndex => sIndex.x === grownX_1 && sIndex.y === grownY_1))
        })) {
            xMasCount += 1
        }
    }


    return {
        xMasCount
    };
}

