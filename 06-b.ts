// deno run --allow-read 06-b.ts

const data = (await Deno.readTextFile("06.txt")).replace(/\n/g, "");

const MARKER_OFFSET = 14;

for (let i = 0; i < data.length; i++) {
  const group = data.slice(i, i + MARKER_OFFSET);

  const charMap = Array.from({ length: group.length }).reduce(
    (acc: any, _: any, idx) => {
      const char = group[idx];
      if (acc[char]) {
        acc[char].push(i + idx);
      } else {
        acc[char] = [i + idx];
      }
      return acc;
    },
    {},
  ) as any;

  const finished = Object.keys(charMap).every((char) =>
    charMap[char].length === 1
  );

  if (finished) {
    console.log(i + MARKER_OFFSET);
    break;
  }
}
