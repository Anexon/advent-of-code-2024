export default function Logic(allFileContents) {
    let startTime = new Date();
    console.log("STARGING: ", startTime);
    let line = allFileContents.split(/\r?\n/)?.[0];

    let stones = line.split(" ").map(stone => Number(stone));

    let memoization = {}
    const totalBlinks = 75;
    let mutatedStones = 0;
    for (let stone of stones) {
        mutatedStones += blinkMemo(stone, totalBlinks);
    }

    function blinkMemo(stone, blinks) {
        if (blinks === 0) {
            return 1;
        } else if (!!memoization[`${stone}_${blinks}`]) {
            return memoization[`${stone}_${blinks}`];
        }

        const RULES = {
            "RULE_1": (stone) => {
                if (stone === 0) {
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

        for (let [index, rule] of Object.entries(RULES)) {
            let [isApplied, newStones] = rule(stone);
            if (isApplied) {
                mutatedStones = [...mutatedStones, ...newStones];
                break;
            }
        }


        let finalStones = 0;
        for (let mutatedStone of mutatedStones) {
            finalStones += blinkMemo(mutatedStone, blinks - 1);
        }

        memoization[`${stone}_${blinks}`] = finalStones;

        return finalStones;
    }

    console.log("ELAPSED: ", ((new Date()) - startTime) / 1000);

    return {
        mutatedStones
    };
}
