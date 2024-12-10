export default function Logic(allFileContents) {
    let allLines = allFileContents.split(/\r?\n/);

    const {
        memoryBlocks
    } = expandMemoryLine(allLines[0]);


    let memoryMovementsCount = 0;
    let _lastFileblock;
    let desfractmentedMemoryLine = [];
    let index_check = 0;
    for (let [index, fileBlock] of Object.entries(memoryBlocks)) {
        if (Number(index) + memoryMovementsCount >= memoryBlocks.length - 1) {
            index_check = +index;
            break;
        }

        if (!_lastFileblock && fileBlock.index > 0) {
            desfractmentedMemoryLine.push(memoryBlocks[memoryBlocks.length - 1 - memoryMovementsCount]?.value);
            memoryMovementsCount += 1;
            _lastFileblock = fileBlock;
        } else if (!!_lastFileblock && (fileBlock.index - _lastFileblock?.index > 1)) {
            for (let _memoryMovementsCount = 0; _memoryMovementsCount < fileBlock.index - _lastFileblock.index - 1; _memoryMovementsCount++) {
                desfractmentedMemoryLine.push(memoryBlocks[memoryBlocks.length - 1 - memoryMovementsCount]?.value);
                memoryMovementsCount += 1;

                if (Number(index) + memoryMovementsCount >= memoryBlocks.length - 1) {
                    index_check = +index;
                    break;
                }
            }
            desfractmentedMemoryLine.push(fileBlock.value);
            _lastFileblock = fileBlock;
        } else {
            desfractmentedMemoryLine.push(fileBlock.value);
            _lastFileblock = fileBlock;
        }
    }

    let result = desfractmentedMemoryLine.reduce((prev, curr, index) => prev + curr * index, 0)

    console.log(`Memory Blocks: ${memoryBlocks.length}`)
    console.log(`Desfractmente Memory Blocks: ${desfractmentedMemoryLine.length}`)
    console.log(`Memory movements: ${memoryMovementsCount}`)
    console.log(`Index check: ${index_check}`)

    function expandMemoryLine(line) {
        let memoryBlocks = [];
        let expandedLine = ``;
        let globalMemoryIndex = 0;
        let usedMemoryIndex = 0;
        for (let [index, char] of Object.entries(line)) {
            let _char = index % 2 === 1 ? '.' : `${usedMemoryIndex}`
            for (let i = 0; i < +char; i++) {
                if (index % 2 === 0) {
                    memoryBlocks.push({
                        index: globalMemoryIndex,
                        value: +usedMemoryIndex
                    })
                } else {
                    // SKIP - EMPTY MEMORY
                }
                expandedLine += _char;
                globalMemoryIndex += 1;
            }
            if (index % 2 === 0) usedMemoryIndex += 1;
        }
        return {
            expandedLine,
            memoryBlocks,
            usedMemoryIndex
        }
    }

    return {
        result
    };
}
