// deno run --allow-read 01-a.ts

const data = await Deno.readTextFile("01.txt");

let elfIndex = 0;
let largest = 0;
let largestElfIndex = 0;
let elfCalories = [];

const lines = data.split("\n");
const end = lines.length - 1;

for (let i = 0; i < end; i++) {
  const line = lines[i];
  if (line.trim() === "" || i === end) {
    const current = elfCalories.reduce((a, b) => a + b, 0);

    if (current > largest) {
      largest = current;
      largestElfIndex = elfIndex;
    }
    elfIndex++;
    elfCalories = [];
  } else {
    elfCalories.push(parseInt(line.trim()));
  }
}

console.log(largest, largestElfIndex);
