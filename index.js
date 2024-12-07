import fs from 'fs';


if (process.argv.length === 2) {
    console.error('Expected at least one argument!');
    process.exit(1);
}

const problemNumber = process.argv[2];
const problemStar = process.argv[3];

const code = await import(`./p${problemNumber}/code_${problemStar}.js`);
const allFileContent = fs.readFileSync(`./p${problemNumber}/input_${problemStar}.txt`, 'utf8');

let results = code.default(allFileContent);

console.log(results);


