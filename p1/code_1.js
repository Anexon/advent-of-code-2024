export default function Logic(allFileContents) {
    let locations = [[], []];
    allFileContents.split(/\r?\n/).forEach((line, lineIndex) => {
        let [l1, l2] = line.split("   ");
        locations[0].push(l1);
        locations[1].push(l2);
    });
    console.log(locations[0][locations[0].length - 1], locations[1][locations[1].length - 1])
    locations[0] = locations[0].sort((la, lb) => la > lb ? 1 : la < lb ? -1 : 0);
    locations[1] = locations[1].sort((la, lb) => la > lb ? 1 : la < lb ? -1 : 0);
    let distance = 0;
    for (let i = 0; i <= locations[0].length - 1; i++) {
        // console.log(`L1 [${locations[0][i]}] - L2 [${locations[1][i]}]: ${Math.abs(locations[0][i] - locations[1][i])}`)
        distance += Math.abs(locations[0][i] - locations[1][i]);
    }

    return {
        distance
    };
}