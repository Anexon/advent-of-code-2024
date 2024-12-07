export default function CustoDataMapper(allFileContents) {
    let safeLevels = 0;
    allFileContents.split(/\r?\n/).forEach((line, lineIndex) => {
        let levels = line.split(" ");
        let isEntrySafe = false;
        const {
            securityEntry
        } = evaluateEntry(levels);
        isEntrySafe = securityEntry;

        if (!isEntrySafe) {
            for (let index = 0; index < levels.length; index++) {
                let _levels = Object.assign([], levels);
                _levels.splice(index, 1);
                const {
                    securityEntry: _securityEntry
                } = evaluateEntry(_levels);
                isEntrySafe = _securityEntry;

                if (isEntrySafe) break;
            }
        }
        safeLevels += isEntrySafe ? 1 : 0;
    });

    function evaluateEntry(levels) {
        let _ramp = 0;
        let securityEntry = false;
        for (const [index, level] of Object.entries(levels)) {
            if (index > 0) {
                const delta = Number(level) - Number(levels[index - 1]);

                if (_ramp === 0) {
                    _ramp = delta > 0 ? 1 : delta < 0 ? -1 : 0;
                }
                const absDelta = Math.abs(Number(level) - Number(levels[index - 1]));
                if (absDelta < 1 || absDelta > 3 || ((_ramp * delta) <= 0)) {
                    securityEntry = false;
                    break;
                } else {
                    securityEntry = true;
                }
            }
        }
        return {
            securityEntry
        };
    }


    return {
        safeLevels
    };
}