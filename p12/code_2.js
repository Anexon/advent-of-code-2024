export default function Logic(allFileContents) {
    let rows = allFileContents.split(/\r?\n/);

    let allGroups = {};
    let groupsRegistry = {};
    let previousLineGroups = [];
    const gardenGroupsFinder = /([A-Z])\1*/g;
    for (let [rowIndex, row] of Object.entries(rows)) {
        let newUncategorisedGroups = [...row.matchAll(gardenGroupsFinder)];
        let newGardenGroups = newUncategorisedGroups.map((ngg) => {
            let groupType = ngg[1];
            let groupName = `${groupType}${groupsRegistry[groupType] ?? 0}`;
            groupsRegistry[groupType] = (groupsRegistry[groupType] ?? 0) + 1;
            let groupElements = ngg[0].length;
            let group = {
                groupName,
                type: groupType,
                tiles: new Set()
            };
            for (let i = 0; i < groupElements; i++) {
                group.tiles.add(`${rowIndex}-${ngg.index + i}`);
            }
            return group;
        })

        if (Number(rowIndex) === 0) {
            // STORE INITIAL GROUPS
            previousLineGroups = newGardenGroups;
            for (let ngg of newGardenGroups) {
                allGroups[ngg.groupName] = ngg;
            }
        } else {
            let precedingGroups = [];
            let duplicatedGroups = new Set();

            for (let uncategorizedGroup of newUncategorisedGroups) {
                let precedingGroup;
                let currentGroup = newGardenGroups.filter(ngg => ngg.tiles.has(`${rowIndex}-${uncategorizedGroup.index}`))?.[0];
                for (let [relativeColumnIndex, cell] of Object.entries(uncategorizedGroup[0].split(""))) {
                    let globalColumnIndex = uncategorizedGroup.index + Number(relativeColumnIndex);

                    let existingGroup = findSiblingGroup(Number(rowIndex) - 1, globalColumnIndex, currentGroup.type);

                    if (!!existingGroup) {
                        if (!!precedingGroup) {
                            mergeGroups(precedingGroup, existingGroup)
                            if (precedingGroup.groupName !== existingGroup.groupName) {
                                duplicatedGroups.add(existingGroup.groupName)
                            }
                        } else {
                            precedingGroup = mergeGroups(existingGroup, currentGroup)
                        }
                    }
                }

                // Add New GROUP
                allGroups[precedingGroup?.groupName ?? currentGroup?.groupName] = precedingGroup ?? currentGroup;

                if (!precedingGroup || !precedingGroups.some(pg => pg.groupName === precedingGroup?.groupName)) {
                    precedingGroups.push(precedingGroup ?? currentGroup);
                }
            }

            // CLEAN DUPLICATIONS
            for (let duplicatedGroup of duplicatedGroups) {
                delete allGroups[duplicatedGroup];
            }

            previousLineGroups = [...precedingGroups];
        }

        function findSiblingGroup(rowIndex, columnIndex, groupType) {
            return previousLineGroups.filter(ngg => ngg.type === groupType && ngg.tiles.has(`${rowIndex}-${columnIndex}`))?.[0];
        }

        function mergeGroups(groupA, groupB) {
            for (let tile of groupB.tiles) {
                groupA.tiles.add(tile);
            }
            return groupA;
        }
    }

    let result = Object.keys(allGroups).reduce((prev, curr) => {
        let tiles = allGroups[curr].tiles;
        let area = tiles.size;
        let sides = 0;
        let [row0, rowN, column0, columnN] = getBoundaries(tiles);

        if (allGroups[curr].groupName === 'R0') {
            console.log(`ROWs - MIN:${row0}, MAX:${rowN} | COLUMNs - MIN:${column0}, MAX:${columnN}`)
        }
        // HORIZONTAL SCAN
        for (let row = row0; row <= rowN; row++) {
            let previousNormalUp = 0, previousNormalDown = 0;
            for (let column = column0; column <= columnN; column++) {
                let [normalUp, normalDown] = getVerticalNormals(tiles, row, column)

                sides += normalUp - previousNormalUp > 0 ? 1 : 0;
                sides += normalDown - previousNormalDown > 0 ? 1 : 0;

                previousNormalUp = normalUp;
                previousNormalDown = normalDown;
            }
        }

        // VERTICAL SCAN
        for (let column = column0; column <= columnN; column++) {
            let previousNormalLeft = 0, previousNormalRight = 0;
            for (let row = row0; row <= rowN; row++) {
                let [normalLeft, normalRight] = getHorizontalNormals(tiles, row, column)
                sides += normalLeft - previousNormalLeft > 0 ? 1 : 0;
                sides += normalRight - previousNormalRight > 0 ? 1 : 0;

                previousNormalLeft = normalLeft;
                previousNormalRight = normalRight;
            }
        }

        console.log(`${allGroups[curr].groupName} - AREA: ${area}, SIDES: ${sides}`)

        return prev + sides * area;
    }, 0)

    function getBoundaries(tiles) {
        let minRow, maxRow, minColumn, maxColumn;

        for (let tile of tiles) {
            let [row, column] = tile.split("-").map(Number);

            if ((!minRow && minRow !== 0) || minRow > row) minRow = row;
            if ((!maxRow && maxRow !== 0) || maxRow < row) maxRow = row;
            if ((!minColumn && minColumn !== 0) || minColumn > column) minColumn = column;
            if ((!maxColumn && maxColumn !== 0) || maxColumn < column) maxColumn = column;

        }

        return [minRow, maxRow, minColumn, maxColumn]
    }
    function getVerticalNormals(tiles, row, column) {
        if (!tiles.has(`${row}-${column}`)) return [0, 0]; // EMPTY TILE
        if (tiles.has(`${row + 1}-${column}`) && tiles.has(`${row - 1}-${column}`)) return [0, 0]; // INTERNAL TILE
        if (!tiles.has(`${row + 1}-${column}`) && tiles.has(`${row - 1}-${column}`)) return [0, 1]; // POINTS DOWN
        if (tiles.has(`${row + 1}-${column}`) && !tiles.has(`${row - 1}-${column}`)) return [1, 0]; // POINTS UP
        if (!tiles.has(`${row + 1}-${column}`) && !tiles.has(`${row - 1}-${column}`)) return [1, 1]; // POINTS BOTH SIDES
    }
    function getHorizontalNormals(tiles, row, column) {
        if (!tiles.has(`${row}-${column}`)) return [0, 0]; // EMPTY TILE
        if (tiles.has(`${row}-${column + 1}`) && tiles.has(`${row}-${column - 1}`)) return [0, 0]; // INTERNAL TILE
        if (!tiles.has(`${row}-${column + 1}`) && tiles.has(`${row}-${column - 1}`)) return [0, 1]; // POINTS RIGHT
        if (tiles.has(`${row}-${column + 1}`) && !tiles.has(`${row}-${column - 1}`)) return [1, 0]; // POINTS LEFT
        if (!tiles.has(`${row}-${column + 1}`) && !tiles.has(`${row}-${column - 1}`)) return [1, 1]; // POINTS BOTH SIDES
    }

    return {
        result
    };
}
