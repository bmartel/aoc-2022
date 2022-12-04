// deno run --allow-read 04-b.ts

const data = await Deno.readTextFile("04.txt");
const lines = data.split("\n");
const end = lines.length - 1;

let pairs = 0;
for (let i = 0; i < end; i++) {
  const line = lines[i];
  const ranges = line.split(",").map((range) =>
    range.split("-").map((x) => parseInt(x))
  );
  const [start, end] = ranges[0];
  const [start2, end2] = ranges[1];

  if (start <= end2 && end >= start2 && start2 <= end && end2 >= start) {
    pairs++;
  }
}
console.log(pairs);
