export default async function Logic(allFileContents) {
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

        robots.push(robot)
    }

    let time = 1827;
    let maxLineLength = 0;
    while (time < 10000000) {
        for (let robot of robots) {
            let deltaX = robot.vx * time;
            let deltaY = robot.vy * time;

            let deltaRows = Math.abs((robot.initial_y + deltaY) % totalRows);
            robot.y = robot.vy < 0 && deltaRows !== 0 ? totalRows - deltaRows : deltaRows;

            let deltaColumns = Math.abs((robot.initial_x + deltaX) % totalColumns);
            robot.x = robot.vx < 0 && deltaColumns !== 0 ? totalColumns - deltaColumns : deltaColumns;
        }


        // HORIZONTAL SCAN
        let maxHorizontalLine = 0;
        for (let row = 0; row <= totalRows; row++) {
            for (let robot of robots) {
                let endOfLine = false;
                let lineLength = 0;
                let nextX = robot.x + 1 < totalColumns ? robot.x + 1 : 0;
                while (!endOfLine) {

                    if (robots.some(r => r.x === nextX && r.y === row) && lineLength < totalColumns) {
                        lineLength += 1;
                    } else {
                        endOfLine = true;
                    }
                    nextX = nextX + 1 < totalColumns ? nextX + 1 : 0;
                }
                maxHorizontalLine = Math.max(lineLength, maxHorizontalLine);
            }
        }

        // VERTICAL SCAN
        let maxVerticalLine = 0;
        // for (let column = 0; column <= totalColumns; column++) {
        //     for (let robot of robots) {
        //         let endOfLine = false;
        //         let lineLength = 0;
        //         let nextY = robot.y + 1 < totalRows ? robot.y + 1 : 0;
        //         while (!endOfLine) {
        //             if (robots.some(r => r.y === nextY && r.x === column) && lineLength <= totalRows) {
        //                 lineLength += 1;
        //             } else {
        //                 endOfLine = true;
        //             }
        //             nextY = nextY + 1 < totalRows ? nextY + 1 : 0;
        //         }
        //         maxVerticalLine = Math.max(lineLength, maxVerticalLine);
        //     }
        // }

        if (maxLineLength <= maxVerticalLine || maxLineLength <= maxHorizontalLine || maxHorizontalLine > 10) {
            console.log("FOUND LONG LINE AT ", time);
            maxLineLength = Math.max(maxVerticalLine, maxHorizontalLine, maxLineLength);
        }

        if (time % 1000 === 0) {
            console.log("TIME: ", time)
        }



        // printMap();
        // console.log(time)
        // await new Promise((res, _) => setTimeout(() => res(), 500))
        time += 1;
    }


    function printMap() {
        let finalMap = '';
        for (let row = 0; row < totalRows; row++) {
            let finalMapRow = '';
            for (let column = 0; column < totalColumns; column++) {
                let totalFinalRobots = robots.filter(r => r.x === column && r.y === row).length
                finalMapRow += totalFinalRobots > 0 ? "*" : " ";
            }
            finalMapRow += "\n";
            finalMap += finalMapRow;
        }

        console.log(finalMap);
    }

    return [1];
}