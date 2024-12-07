export default function Logic(allFileContents) {
    let result = 0;
    allFileContents.split(/\r?\n/).forEach((line, lineIndex) => {
        const mulRegexp = /mul\([0-9]{1,3}\,[0-9]{1,3}\)/g;
        let muls = line.matchAll(mulRegexp);

        result += [...muls].reduce((prev, curr) => {
            let [mul1, rest] = curr[0].split('mul(')[1].split(",")
            let mul2 = rest.split(')')[0];

            return prev + mul1 * mul2;
        }, 0)
    });

    return {
        result
    };
}