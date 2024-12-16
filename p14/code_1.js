export default function Logic(allFileContents) {
    const rRobotPosition = /(?<=p=)(.*)(?= )/;
    const rRobotVelocity = /(?<=v=)(.*)/;

    let robotLines = allFileContents.split(/\n/);
    let robots = [];
    let totalColumns = 101;
    let totalRows = 103;
    for (let robotLine of robotLines) {
        let [x, y] = robotLine.match(rRobotPosition)[0].split(",").map(Number);
        let [vx, vy] = robotLine.match(rRobotVelocity)[0].split(",").map(Number);
        let robot = {
            initial_x: x, initial_y: y, vx, vy
        };
        // console.log("INITIAL STATE: ", robot)

        // let totalTime = 7492; // SPOTTED FIRST TIME
        // let totalTime = 1827; // FALSE POSITIVE
        let totalTime = 5535; // FALSE POSITIVE
        let deltaX = robot.vx * totalTime;
        let deltaY = robot.vy * totalTime;
        // console.log(deltaX, deltaY)

        let deltaRows = Math.abs((robot.initial_y + deltaY) % totalRows);
        robot.y = robot.vy < 0 && deltaRows !== 0 ? totalRows - deltaRows : deltaRows;

        let deltaColumns = Math.abs((robot.initial_x + deltaX) % totalColumns);
        robot.x = robot.vx < 0 && deltaColumns !== 0 ? totalColumns - deltaColumns : deltaColumns;

        robots.push(robot)
    }

    console.log(robots)

    let initialMap = '';
    let finalMap = '';
    for (let row = 0; row < totalRows; row++) {
        let initialMapRow = '';
        let finalMapRow = '';
        for (let column = 0; column < totalColumns; column++) {
            let totalInitialRobots = robots.filter(r => r.initial_x === column && r.initial_y === row).length
            let totalFinalRobots = robots.filter(r => r.x === column && r.y === row).length
            initialMapRow += totalInitialRobots > 0 ? totalInitialRobots : ".";
            finalMapRow += totalFinalRobots > 0 ? "+" : " ";
        }
        initialMapRow += "\n";
        finalMapRow += "\n";
        initialMap += initialMapRow;
        finalMap += finalMapRow;
    }

    console.log("INITIAL MAP");
    console.log(initialMap);
    console.log("FINAL MAP")
    console.log(finalMap);


    let xQ_left = ((totalColumns + 1) / 2) - 1;
    let yQ_top = ((totalRows + 1) / 2) - 1;
    let xQ_right = ((totalColumns + 1) / 2) - 1;
    let yQ_bottom = ((totalRows + 1) / 2) - 1;

    console.log(xQ_left, yQ_top, xQ_right, yQ_bottom)
    let qTL = robots.filter(r => r.x < xQ_left && r.y < yQ_top).length; // TOP LEFT
    let qTR = robots.filter(r => r.x > xQ_right && r.y < yQ_top).length; // TOP RIGHT
    let qBL = robots.filter(r => r.x < xQ_left && r.y > yQ_bottom).length; // BOTTOM LEFT
    let qBR = robots.filter(r => r.x > xQ_right && r.y > yQ_bottom).length; // BOTTOM RIGHT

    let result = qTL * qTR * qBL * qBR;
    console.log(qTL, qTR, qBL, qBR)
    return {
        result
    };
}


