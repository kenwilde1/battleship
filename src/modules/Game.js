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
        let target = parseInt(e.target.dataset.id);

        if (!this.handleClick(target)) {
          setTimeout(() => {
            this.switchCurrentPlayer();
          }, 1000);
        }
      })
    );
  }

  startGame() {
    this.computerGameboardElement.classList.remove("inactive");
    this.humanGameboardElement.classList.add("inactive");
  }

  initializeGameboard() {
    this.placeComputerShips();
    renderGameboard(this.humanArray, "human");
    renderGameboard(this.computerArray, "comp");
    this.addEventListeners();
  }

  placeHumanShips() {
    humanShips.forEach((ship) =>
      this.humanGameboard.placeShip(ship.id, ship.coords)
    );
  }

  placeComputerShips() {
    computerShips.forEach((ship) =>
      this.computerGameboard.placeShip(ship.id, ship.coords)
    );
  }

  handleClick(target) {
    console.log(this.computerArray);
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
        console.log(this.humanArray);
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

  dragShips() {
    let ships = [];
    const shipElements = document.querySelectorAll(
      ".user-ship-container .shipCell"
    );
    const userSquares = document.querySelectorAll(".human-gameboard .cell");
    shipElements.forEach((ship) => {
      ships.push(shipElements);
    });

    let selectedShipNameWithIndex;
    let draggedShip;
    let draggedShipLength = 0;
    ships[0].forEach((ship) =>
      ship.addEventListener("mousedown", (e) => {
        selectedShipNameWithIndex = e.target.id;
      })
    );
    const dragStart = (e) => {
      draggedShip = e.currentTarget.lastElementChild;

      e.target.childNodes.forEach((el) => {
        if (el.id) {
          draggedShipLength++;
        }
      });
      console.log(draggedShip);
    };

    const dragOver = (e) => {
      e.preventDefault();
    };

    const dragEnter = (e) => {
      e.preventDefault();
    };

    const dragLeave = () => {};

    const dragDrop = (e) => {
      let shipNameWithLastId = draggedShip.id;
      let shipClass = shipNameWithLastId.slice(0, -2);
      console.log(shipClass);
      let lastShipIndex = parseInt(shipNameWithLastId.substr(-1));
      let ShipLastId = lastShipIndex + parseInt(e.target.dataset.id);
      let selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1));
      ShipLastId = ShipLastId - selectedShipIndex;

      let newCoords = [];
      let numOfShipCells = draggedShipLength;

      for (let i = numOfShipCells - 1; i > 0; i--) {
        const end = parseInt(e.target.dataset.id);
        const start = end - i;
        newCoords.push(start);
      }

      newCoords.push(parseInt(e.target.dataset.id));
      const shipInQuestion = parseInt(draggedShip.parentElement.dataset.id);
      this.humanGameboard.shipList.filter((ship) => {
        if (ship.id === shipInQuestion) {
          ship.coords = [...newCoords];
        }
      });
      console.log(newCoords);
      humanShips.filter((ship) => {
        if (ship.id === shipInQuestion) {
          console.log(true);
          ship.coords = [...newCoords];
        }
      });
      console.log(humanShips);
      for (let i = 0; i < draggedShipLength; i++) {
        userSquares[
          parseInt(e.target.dataset.id) - selectedShipIndex + i
        ].classList.add("taken");
        this.humanArray[
          e.target.dataset.id - selectedShipIndex + i
        ].isPlaced = true;
        this.humanArray[
          e.target.dataset.id - selectedShipIndex + i
        ].shipID = parseInt(draggedShip.parentElement.dataset.id);
      }
      this.placeHumanShips();
      draggedShipLength = 0;
      console.log(this.humanArray);
    };

    const dragEnd = () => {};

    ships[0].forEach((ship) => ship.addEventListener("dragstart", dragStart));

    userSquares.forEach((square) =>
      square.addEventListener("dragstart", dragStart)
    );
    userSquares.forEach((square) =>
      square.addEventListener("dragover", dragOver)
    );
    userSquares.forEach((square) =>
      square.addEventListener("dragenter", dragEnter)
    );
    userSquares.forEach((square) =>
      square.addEventListener("dragleave", dragLeave)
    );
    userSquares.forEach((square) => square.addEventListener("drop", dragDrop));
    userSquares.forEach((square) =>
      square.addEventListener("dragend", dragEnd)
    );

    /*
    dragOver() {

    }

    dragEnter() {

    }

    dragLeave() {

    }

    dragDrop() {

    }

    dragEnd() {

    }
    */
  }
}
