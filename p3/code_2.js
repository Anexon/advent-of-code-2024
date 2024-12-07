export default function Logic(allFileContents) {
    let result = 0;
    let buffer = "do"; // BUFFER DOESN'T GET CLEARED BETWEEN LINES

    allFileContents.split(/\r?\n/).forEach((line, lineIndex) => {
        const mulRegexp = /mul\([0-9]{1,3}\,[0-9]{1,3}\)/g;
        const doRegexp = /(do\(\)|don\'t\(\))/g;
        const muls = line.matchAll(mulRegexp);
        const does = line.matchAll(doRegexp);

        let instructions = [
            ...[...muls].map(mul => {
                let [mul1, rest] = mul[0].split('mul(')[1].split(",")
                let mul2 = rest.split(')')[0];
                return {
                    index: mul.index,
                    value: mul1 * mul2,
                    type: "mul"
                }
            }),
            ...[...does].map(mul => {
                return {
                    index: mul.index,
                    value: mul[0] === 'do()' ? "do" : "don't",
                    type: "do"
                }
            })
        ].sort((i1, i2) => i1.index < i2.index ? -1 : i1.index > i2.index ? 1 : 0);

        result += instructions.reduce((prev, curr) => {
            let _result = prev;
            if (curr.type === "mul") {
                _result += buffer === "do" ? curr.value : 0;
            } else if (curr.type === "do") {
                buffer = curr.value;
            } else {
                console.log("ERROR");
                console.log(curr)
            }

            return _result;
        }, 0)
    });

    return {
        result
    };
}