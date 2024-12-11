export default function Logic(allFileContents) {
    let line = allFileContents.split(/\r?\n/)?.[0];

    let stones = line.split(" ").map(stone => Number(stone));

    const totalBlinks = 25;
    let mutatedStones = stones;
    for (let i = 0; i < totalBlinks; i++) {
        mutatedStones = blink(mutatedStones);
    }
    let result = mutatedStones.length;
    // let result = mutatedStones.reduce((prev, curr) => prev + curr, 0)

    function blink(stones) {
        const RULES = {
            "RULE_1": (stone) => {
                if (stone === 0) {
                    // console.log("RULE1")
                    return [true, [1]];
                }
                return [false, [stone]];
            },
            "RULE_2": (stone) => {
                let stoneDigits = stone.toString().length;
                if (stoneDigits % 2 === 0) {
                    let digitsLeftGroup = stone.toString().substring(0, (stoneDigits / 2));
                    let digitsRightGroup = stone.toString().substring(stoneDigits / 2, stoneDigits);
                    return [true, [Number(digitsLeftGroup), Number(digitsRightGroup)]];
                }
                return [false, [stone]];
            },
            "RULE_3": (stone) => {
                return [true, [stone * 2024]]
            }
        }

        let mutatedStones = [];
        for (let stone of stones) {
            // console.log("MUTATING STONE", stone)
            for (let [index, rule] of Object.entries(RULES)) {
                let [isApplied, newStones] = rule(stone);
                if (isApplied) {
                    mutatedStones = [...mutatedStones, ...newStones];
                    break;
                }
            }
        }

        return mutatedStones;
    }


    return {
        result
    };
}
