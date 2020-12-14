import Gameboard from "./Gameboard";
import Player from "./Player";

export default class Game {
  constructor() {}

  startGame() {
    const humanGameboard = new Gameboard();
    const humanArray = humanGameboard.initializeGameboard();

    const computerGameboard = new Gameboard();
    const computerArray = computerGameboard.initializeGameboard();

    return { humanArray, computerArray };
  }
}
