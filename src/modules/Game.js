import Gameboard from "./Gameboard";
import Player from "./Player";
import renderGameboard from "../dom-scripts/renderGameboard";
import { humanShips, computerShips } from "../data/shipData";

export default class Game {
  constructor() {
    this.humanGameboard = new Gameboard();
    this.humanArray = this.humanGameboard.initializeGameboard();
    this.computerGameboard = new Gameboard();
    this.computerArray = this.computerGameboard.initializeGameboard();
    this.currentPlayer = "human";
    this.computerPlayer = new Player();
    this.computerGameboardElement = document.querySelector(
      ".computer-gameboard"
    );
    this.humanGameboardElement = document.querySelector(".human-gameboard");
  }

  addEventListeners() {
    const cells = document.querySelectorAll(".computer-gameboard .cell");
    cells.forEach((cell) =>
      cell.addEventListener("click", (e) => {
        let target;
        if (e.currentTarget.className.length > 12) {
          target = parseInt(e.currentTarget.className.slice(9, 11));
        } else {
          target = parseInt(e.currentTarget.className.slice(9));
        }
        if (!this.handleClick(target)) {
          setTimeout(() => {
            this.switchCurrentPlayer();
          }, 1000);
        }
      })
    );
  }

  addDrag() {
    let dragged;
    const cells = document.querySelectorAll(".human-gameboard .cell");
    cells.forEach((cell) => {
      cell.addEventListener("click", (e) => {
        console.log(e.currentTarget);
      });
    });
  }

  startGame() {
    this.computerGameboardElement.classList.remove("inactive");
    this.humanGameboardElement.classList.add("inactive");
  }

  initializeGameboard() {
    this.placeAllShips();
    renderGameboard(this.humanArray, "human");
    renderGameboard(this.computerArray, "comp");
    this.addEventListeners();
    this.addDrag();
  }

  placeAllShips() {
    humanShips.forEach((ship) =>
      this.humanGameboard.placeShip(ship.id, ship.coords)
    );
    computerShips.forEach((ship) =>
      this.computerGameboard.placeShip(ship.id, ship.coords)
    );
  }

  handleClick(target) {
    const result = this.computerGameboard.receiveAttack(target);

    if (!result) {
      this.computerGameboardElement.classList.add("inactive");
      this.humanGameboardElement.classList.toggle("inactive");
    } else {
      this.computerGameboardElement.classList.remove("inactive");
    }

    renderGameboard(this.computerArray, "comp");
    this.addEventListeners();
    if (this.computerGameboard.isGameOver()) {
      this.gameOver();
    }
    return result;
  }

  switchCurrentPlayer() {
    let hasAttacked = false;
    while (!hasAttacked) {
      const randomIndex = Math.floor(Math.random() * 100);
      if (
        !this.humanArray[randomIndex][1].isHit &&
        !this.humanArray[randomIndex][1].isPlaced
      ) {
        this.humanGameboard.receiveAttack(randomIndex);
        renderGameboard(this.humanArray, "human");
        this.computerGameboardElement.classList.remove("inactive");
        this.humanGameboardElement.classList.add("inactive");
        hasAttacked = true;
      }

      if (
        !this.humanArray[randomIndex][1].isHit &&
        this.humanArray[randomIndex][1].isPlaced
      ) {
        this.humanGameboard.receiveAttack(randomIndex);
        renderGameboard(this.humanArray, "human");
        this.computerGameboardElement.classList.remove("inactive");
        this.humanGameboardElement.classList.add("inactive");
      }
    }
  }

  gameOver(player) {
    alert(`Game Over! ${player} wins!`);
    this.humanGameboard = new Gameboard();
    this.humanArray = this.humanGameboard.initializeGameboard();
    this.computerGameboard = new Gameboard();
    this.computerArray = this.computerGameboard.initializeGameboard();
    this.initializeGameboard();
  }
}
