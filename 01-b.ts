// deno run --allow-read 01-b.ts

const data = await Deno.readTextFile("01.txt");

let elfCalories = [];
const topElves = [];

const lines = data.split("\n");
const end = lines.length - 1;

for (let i = 0; i < end; i++) {
  const line = lines[i];
  if (line.trim() === "" || i === end) {
    topElves.push(elfCalories.reduce((a, b) => a + b, 0));

    elfCalories = [];
  } else {
    elfCalories.push(parseInt(line.trim()));
  }
}

const top3Total = topElves
  .sort((a, b) => b - a)
  .slice(0, 3)
  .reduce((a, b) => a + b, 0);

console.log(top3Total);
