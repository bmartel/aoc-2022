// deno run --allow-read 08-a.ts

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

  if (x === 0) return true;
  for (let i = x - 1; i >= 0; i--) {
    if (acreage[i][y] >= tree) return false;
  }
  return true;
};

const isRightVisible = (acreage: number[][], x: number, y: number) => {
  const tree = acreage[x][y];

  if (x === acreage.length - 1) return true;
  for (let i = x + 1; i < acreage[x].length; i++) {
    if (acreage[i][y] >= tree) return false;
  }
  return true;
};

const isOutside = (acreage: number[][], x: number, y: number) => {
  return y === 0 || y === acreage[x].length - 1 || x === 0 ||
    x === acreage.length - 1;
};

const isTopVisible = (acreage: number[][], x: number, y: number) => {
  const tree = acreage[x][y];

  for (let i = y - 1; i >= 0; i--) {
    if (acreage[x][i] >= tree) return false;
  }
  return true;
};

const isBottomVisible = (acreage: number[][], x: number, y: number) => {
  const tree = acreage[x][y];

  for (let i = y + 1; i < acreage[x].length; i++) {
    if (acreage[x][i] >= tree) return false;
  }
  return true;
};

const checkAcreage = (acreage: number[][]) => {
  const visible = [];
  for (let y = 0; y < acreage.length; y++) {
    for (let x = 0; x < acreage[y].length; x++) {
      // check if tree is visible
      const outside = isOutside(acreage, x, y);
      if (outside) {
        visible.push([acreage[x][y], x, y]);
        continue;
      }
      const left = isLeftVisible(acreage, x, y);
      const right = isRightVisible(acreage, x, y);
      const top = isTopVisible(acreage, x, y);
      const bottom = isBottomVisible(acreage, x, y);

      if (left || right || top || bottom) {
        visible.push([acreage[x][y], x, y]);
      }
    }
  }
  return visible;
};

const checkInput = (data: string[]) => {
  const acreage = getAcreage(data);

  const visibleTrees = checkAcreage(acreage);

  console.log(visibleTrees.length);
};

checkInput(input);
