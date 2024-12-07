export default function Logic(allFileContents) {
    let locations1 = [];
    let locations2 = [];
    allFileContents.split(/\r?\n/).forEach((line, lineIndex) => {
        let [l1, l2] = line.split("   ");
        locations1.push(l1);
        locations2.push(l2);
    });
    let matrixScore = 0;
    for (let i = 0; i <= locations1.length - 1; i++) {
        let times = locations2.filter(l2 => l2 === locations1[i])?.length ?? 0;
        matrixScore += locations1[i] * times;
    }

    return {
        matrixScore
    };
}