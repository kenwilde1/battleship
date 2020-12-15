import Game from "./modules/Game";

const newGame = new Game();
newGame.initializeGameboard();

const startGameButton = document.querySelector(".header button");
startGameButton.addEventListener("click", () => newGame.startGame());
