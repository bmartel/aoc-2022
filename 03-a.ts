// deno run --allow-read 03-a.ts

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

function processCompartments(line: string) {
  const compartment1 = [];
  const compartment2 = [];
  const half = line.length / 2;

  for (let i = 0; i < half; i++) {
    const char = line.charAt(i);
    compartment1.push(toCharCode(char));
  }

  for (let i = half; i < line.length; i++) {
    const char = line.charAt(i);
    compartment2.push(toCharCode(char));
  }

  return [compartment1, compartment2];
}

let total = 0;
for (let i = 0; i < end; i++) {
  const line = lines[i];
  const [compartment1, compartment2] = processCompartments(line);

  const occurrencesInBoth = compartment1.find((char) =>
    compartment2.includes(char)
  );
  total += occurrencesInBoth ? occurrencesInBoth : 0;
}
console.log(total);
