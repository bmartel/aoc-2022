// deno run --allow-read 03-b.ts

const data = await Deno.readTextFile("03.txt");
const lines = data.split("\n");
const end = lines.length - 1;

const LOWER_CHAR_RANGE = 97;
const UPPER_CHAR_RANGE = 65;
const LOWER_CHAR_PRIORTY = 1;
const UPPER_CHAR_PRIORTY = 27;

const lowerCaseChars: Record<string, number> = {};
const upperCaseChars: Record<string, number> = {};

for (let i = 0; i < 27; i++) {
  const lowerCaseChar = String.fromCharCode(i + LOWER_CHAR_RANGE);
  const upperCaseChar = String.fromCharCode(i + UPPER_CHAR_RANGE);

  lowerCaseChars[lowerCaseChar] = i + LOWER_CHAR_PRIORTY;
  upperCaseChars[upperCaseChar] = i + UPPER_CHAR_PRIORTY;
}

function toCharCode(char: string) {
  if (char === char.toLowerCase()) {
    return lowerCaseChars[char];
  }
  return upperCaseChars[char];
}

function processGroups(lines: [string, string, string]) {
  const group1 = [];
  const group2 = [];
  const group3 = [];

  for (let i = 0; i < lines[0].length; i++) {
    const char = lines[0].charAt(i);
    group1.push(toCharCode(char));
  }

  for (let i = 0; i < lines[1].length; i++) {
    const char = lines[1].charAt(i);
    group2.push(toCharCode(char));
  }

  for (let i = 0; i < lines[2].length; i++) {
    const char = lines[2].charAt(i);
    group3.push(toCharCode(char));
  }

  return [group1, group2, group3];
}

let total = 0;
const linesPerGroup = 3;
let groups = [];
for (let i = 0; i < end; i++) {
  const line = lines[i];
  groups.push(line);
  if (groups.length === linesPerGroup) {
    const [group1, group2, group3] = processGroups(
      groups as [string, string, string],
    );

    const occurrencesInBoth = group1.find((char) =>
      group2.includes(char) && group3.includes(char)
    );
    total += occurrencesInBoth ? occurrencesInBoth : 0;
    groups = [];
  }
}
console.log(total);
