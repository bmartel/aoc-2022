// deno run --allow-read 08-b.ts

const input = (await Deno.readTextFile("08.txt")).split("\n");

const getTreeline = (line: string): number[] => {
  const trees = [];
  for (let i = 0; i < line.length; i++) {
    trees.push(Number(line[i]));
  }
  return trees;
};

const getAcreage = (data: string[]): number[][] => {
  const acreage: Array<number[]> = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].trim() === "") continue;

    acreage.push(getTreeline(data[i]));
  }
  return acreage;
};

const isLeftVisible = (acreage: number[][], x: number, y: number) => {
  const tree = acreage[x][y];

  let visible = 0;

  if (x === 0) return visible;
  for (let i = x - 1; i >= 0; i--) {
    visible++;
    if (acreage[i][y] >= tree) break;
  }
  return visible;
};

const isRightVisible = (acreage: number[][], x: number, y: number) => {
  const tree = acreage[x][y];

  let visible = 0;

  if (x === acreage.length - 1) return visible;
  for (let i = x + 1; i < acreage[x].length; i++) {
    visible++;
    if (acreage[i][y] >= tree) break;
  }
  return visible;
};

const isOutside = (acreage: number[][], x: number, y: number) => {
  return y === 0 || y === acreage[x].length - 1 || x === 0 ||
    x === acreage.length - 1;
};

const isTopVisible = (acreage: number[][], x: number, y: number) => {
  const tree = acreage[x][y];

  let visible = 0;

  for (let i = y - 1; i >= 0; i--) {
    visible++;
    if (acreage[x][i] >= tree) break;
  }
  return visible;
};

const isBottomVisible = (acreage: number[][], x: number, y: number) => {
  const tree = acreage[x][y];

  let visible = 0;

  for (let i = y + 1; i < acreage[x].length; i++) {
    visible++;
    if (acreage[x][i] >= tree) break;
  }
  return visible;
};

const checkAcreage = (acreage: number[][]) => {
  let max = 0;
  for (let y = 0; y < acreage.length; y++) {
    for (let x = 0; x < acreage[y].length; x++) {
      // check if tree is visible
      const outside = isOutside(acreage, x, y);
      if (outside) {
        continue;
      }

      const left = isLeftVisible(acreage, x, y);
      const right = isRightVisible(acreage, x, y);
      const top = isTopVisible(acreage, x, y);
      const bottom = isBottomVisible(acreage, x, y);

      max = Math.max(max, left * right * top * bottom);
    }
  }
  return max;
};

const checkInput = (data: string[]) => {
  const acreage = getAcreage(data);

  console.log(checkAcreage(acreage));
};

checkInput(input);
