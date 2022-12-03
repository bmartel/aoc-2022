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
  X: Score.Lose,
  Y: Score.Draw,
  Z: Score.Win,
};

function getMyAction(action: keyof typeof MyAction): Score {
  return MyAction[action];
}

function getTheirAction(action: keyof typeof TheirAction): Action {
  return TheirAction[action];
}

const LosingAction = {
  [Action.Paper]: Action.Rock,
  [Action.Rock]: Action.Scissors,
  [Action.Scissors]: Action.Paper,
};
const WinninAction = {
  [Action.Rock]: Action.Paper,
  [Action.Scissors]: Action.Rock,
  [Action.Paper]: Action.Scissors,
};

function getScores([
  theirAction,
  myAction,
]: [Action, number]): [number, number] {
  switch (myAction) {
    case Score.Lose:
      myAction = LosingAction[theirAction];
      return [Score.Win + theirAction, Score.Lose + myAction];
    case Score.Draw:
      return [Score.Draw + theirAction, Score.Draw + theirAction];
    case Score.Win:
      myAction = WinninAction[theirAction];
      return [Score.Lose + theirAction, Score.Win + myAction];
    default:
      throw new Error("Invalid action");
  }
}

function getActionsFromLine(line: string): [Action, number] {
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
  const scores = getScores(actions);

  results[0] += scores[0];
  results[1] += scores[1];
}

console.log(results);
