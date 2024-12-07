export default function Logic(allFileContents) {
    let safeLevels = 0;
    allFileContents.split(/\r?\n/).forEach((line, lineIndex) => {
        const levels = line.split(" ");
        let ramp = 0;
        let securityEntry = false;
        for (const [index, level] of Object.entries(levels)) {
            if (index > 0) {
                const delta = Number(level) - Number(levels[index - 1]);

                if (ramp === 0) {
                    ramp = delta > 0 ? 1 : delta < 0 ? -1 : 0;
                }
                const absDelta = Math.abs(level - levels[index - 1]);
                if (absDelta < 1 || absDelta > 3 || ((ramp * delta) <= 0)) {
                    securityEntry = false;
                    break;
                } else {
                    securityEntry = true;
                }
            }
        }

        safeLevels += securityEntry ? 1 : 0;
    });


    return {
        safeLevels
    };
}