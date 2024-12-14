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
        let area = allGroups[curr].tiles.size;

        let perimeter = 0;
        for (let tile of allGroups[curr].tiles) {
            let [row, column] = tile.split("-");
            row = Number(row);
            column = Number(column);

            perimeter += allGroups[curr].tiles.has(`${row - 1}-${column}`) ? 0 : 1;
            perimeter += allGroups[curr].tiles.has(`${row + 1}-${column}`) ? 0 : 1;
            perimeter += allGroups[curr].tiles.has(`${row}-${column - 1}`) ? 0 : 1;
            perimeter += allGroups[curr].tiles.has(`${row}-${column + 1}`) ? 0 : 1;
        }
        return prev + perimeter * area;
    }, 0)

    // for (let groupKey of Object.keys(allGroups)) {
    //     console.log(`GROUP ${allGroups[groupKey].groupName}`, allGroups[groupKey].tiles)
    // }
    return {
        result
    };
}


