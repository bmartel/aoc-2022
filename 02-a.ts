// deno run --allow-read 02-a.ts

const data = await Deno.readTextFile("02.txt");

enum Action {
  Rock = 1,
  Paper = 2,
  Scissors = 3,
}

enum Score {
  Lose = 0,
  Draw = 3,
  Win = 6,
}

const TheirAction = {
  A: Action.Rock,
  B: Action.Paper,
  C: Action.Scissors,
};

const MyAction = {
  X: Action.Rock,
  Y: Action.Paper,
  Z: Action.Scissors,
};

function getMyAction(action: keyof typeof MyAction): Action {
  return MyAction[action];
}

function getTheirAction(action: keyof typeof TheirAction): Action {
  return TheirAction[action];
}

function getResult([
  theirAction,
  myAction,
]: [Action, Action]): [number, number] {
  if (myAction === theirAction) {
    return [Score.Draw + theirAction, Score.Draw + myAction];
  }

  if (
    (myAction === Action.Rock && theirAction === Action.Scissors) ||
    (myAction === Action.Paper && theirAction === Action.Rock) ||
    (myAction === Action.Scissors && theirAction === Action.Paper)
  ) {
    return [Score.Lose + theirAction, Score.Win + myAction];
  }

  return [Score.Win + theirAction, Score.Lose + myAction];
}

function getActionsFromLine(line: string): [Action, Action] {
  const [theirAction, myAction] = line.trim().split(" ");

  return [
    getTheirAction(theirAction as keyof typeof TheirAction),
    getMyAction(myAction as keyof typeof MyAction),
  ];
}

const results: [number, number] = [0, 0];
const lines = data.split("\n");
const end = lines.length - 1;

for (let i = 0; i < end; i++) {
  const line = lines[i];

  const actions = getActionsFromLine(line);
  const scores = getResult(actions);

  results[0] += scores[0];
  results[1] += scores[1];
}

console.log(results);
