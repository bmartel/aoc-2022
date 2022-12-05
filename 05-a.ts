// deno run --allow-read 05-a.ts

const data = await Deno.readTextFile("05.txt");
const chunks = data.split("\n\n");

const CHARS_PER_CRATE = 3;
const crateLines = chunks[0].split("\n");
const moveLines = chunks[1].split("\n");
const crateLinesEnd = crateLines.length - 1;
const moveLinesEnd = moveLines.length;
const crateLinesLength = crateLines[crateLinesEnd].length /
    (CHARS_PER_CRATE + 1) + 1;
const crates: Array<string[]> = Array.from({ length: crateLinesLength }).map(
  () => [],
);

function printCrates(_crates: Array<string[]>) {
  console.log("\n\nCrates:\n");
  for (let i = 0; i < _crates.length; i++) {
    let line = `${i + 1}: `;
    for (let j = 0; j < _crates[i].length; j++) {
      line += _crates[i][j] + " ";
    }
    console.log(line);
  }
}

// crates
for (let i = 0; i < crateLinesEnd; i++) {
  const line = crateLines[i];
  for (let j = 0; j < line.length - 1; j += CHARS_PER_CRATE + 1) {
    const crate = line.slice(
      j,
      j + CHARS_PER_CRATE,
    ).replace(
      "[",
      "",
    ).replace("]", "").trim();
    if (crate) crates[j / (CHARS_PER_CRATE + 1)].push(crate);
  }
}

// moves
for (let i = 0; i < moveLinesEnd; i++) {
  const line = moveLines[i];
  if (line.startsWith("move")) {
    const lineSplit = line.split(" ");
    const moveCount = parseInt(lineSplit[1]);
    const moveFromIndex = parseInt(lineSplit[3]) - 1;
    const moveToIndex = parseInt(lineSplit[5]) - 1;

    const moved = crates[moveFromIndex].slice(0, moveCount).reverse();
    crates[moveFromIndex] = crates[moveFromIndex].slice(moveCount);
    crates[moveToIndex] = moved.concat(crates[moveToIndex]);
  }
}

console.log(crates.map((c) => c[0]).join(""));
