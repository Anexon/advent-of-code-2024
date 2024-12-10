export default function Logic(allFileContents) {
    let allLines = allFileContents.split(/\r?\n/);

    const {
        expandedLine,
        memoryBlocks
    } = expandMemoryLine(allLines[0]);
    console.log(expandedLine)
    console.log(memoryBlocks)

    console.log(memoryBlocks.length)
    let next = nextMemoryBlockToAllocate(memoryBlocks);
    while (next.has_next) {
        // console.log("ALLOCATING", next.block)
        let fittingGap = findFittingGap(memoryBlocks, next);
        if (!!fittingGap.has_next) {
            // console.log("ALLOCATED", fittingGap.index)
            // SWAP MEMORY
            // FILL EMPTY SPACE
            memoryBlocks[fittingGap.index] = {
                ...next.block,
                index: fittingGap.block.index
            }
            // SWAP MEMORY
            memoryBlocks[next.index].type = "gap";
            memoryBlocks[next.index].value = 0;

            // ADD REMAINING EMPTY SPACE
            if (fittingGap.block.block_size - next.block.block_size > 0) {
                // console.log("ADDING REMAINIG GAP", fittingGap.index + next.block.block_size, fittingGap.block.block_size - next.block.block_size)
                if (memoryBlocks[fittingGap.index + 1].type === 'gap') {
                    memoryBlocks[fittingGap.index + 1].block_size += fittingGap.block.block_size - next.block.block_size;
                } else {
                    memoryBlocks.splice(fittingGap.index + 1, 0, {
                        index: fittingGap.block.index + next.block.block_size,
                        value: 0,
                        block_size: fittingGap.block.block_size - next.block.block_size,
                        type: "gap"
                    })
                }
            }
        }
        next = nextMemoryBlockToAllocate(memoryBlocks, next.index);
    }

    console.log(`Memory Blocks: ${memoryBlocks.length}`)

    let result = memoryBlocks.reduce((prev, curr) => {
        let delta = 0;
        for (let i = 0; i < curr.block_size; i++) {
            if (curr.value === '.') {
                prev.accIndex += 1;
            } else {
                delta += (prev.accIndex) * (Number(curr.value) ?? 0)
                prev.accIndex += 1;
            }
        }
        return {
            total: prev.total + delta,
            accIndex: prev.accIndex
        }
    }, { total: 0, accIndex: 0 })

    function nextMemoryBlockToAllocate(memoryBlocks, lastMemoryBlockAllocatedIndex) {
        let nextMemoryBlock;
        let internalIndex;
        let _lastMemoryBlockAllocatedIndex = lastMemoryBlockAllocatedIndex ?? memoryBlocks.length;
        for (let i = _lastMemoryBlockAllocatedIndex - 1; i >= 0; i--) {
            if (memoryBlocks[i].type === "memory") {
                nextMemoryBlock = memoryBlocks[i];
                internalIndex = i;
                break;
            }
        }
        return {
            index: internalIndex,
            has_next: internalIndex >= 0,
            block: Object.assign({}, nextMemoryBlock)
        }
    }

    function findFittingGap(memoryBlocks, block) {
        let fittingGap;
        let internalIndex;
        let _lastAllocatedMemoryIndex = block.index ?? memoryBlocks.length;
        for (let i = 0; i < _lastAllocatedMemoryIndex; i++) {
            if (memoryBlocks[i].type === 'gap' && memoryBlocks[i].block_size >= block.block.block_size) {
                fittingGap = memoryBlocks[i];
                internalIndex = i;
                break;
            }
        }
        return {
            index: internalIndex,
            has_next: internalIndex >= 0,
            block: Object.assign({}, fittingGap)
        }
    }

    function expandMemoryLine(line) {
        let memoryBlocks = [];
        let expandedLine = ``;
        let globalMemoryIndex = 0;
        let usedMemoryIndex = 0;
        for (let [index, char] of Object.entries(line)) {
            let _char = index % 2 === 1 ? '.' : `${usedMemoryIndex}`
            memoryBlocks.push({
                index: globalMemoryIndex,
                value: index % 2 === 0 ? +usedMemoryIndex : 0,
                block_size: +char,
                type: index % 2 === 0 ? "memory" : "gap"
            })
            if (index % 2 === 0) usedMemoryIndex += 1;
            for (let i = 0; i < +char; i++) {
                expandedLine += _char;
                globalMemoryIndex += 1;
            }
        }
        return {
            expandedLine,
            memoryBlocks
        }
    }

    return {
        result
    };
}
