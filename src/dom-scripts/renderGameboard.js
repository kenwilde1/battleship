export default function renderGameboard(gameboard, type) {
  let gameboardContainer;
  type === "human"
    ? (gameboardContainer = document.querySelector(".human-gameboard"))
    : (gameboardContainer = document.querySelector(".computer-gameboard"));

  while (gameboardContainer.firstChild) {
    gameboardContainer.removeChild(gameboardContainer.lastChild);
  }

  for (let i = 0; i < 100; i++) {
    let cell = document.createElement("div");
    if (gameboard[i][1].isPlaced && !gameboard[i][1].isHit) {
      cell.className = `cell cell${i} ship`;
    } else if (!gameboard[i][1].isPlaced && gameboard[i][1].isHit) {
      cell.className = `cell cell${i} ship missed`;
    } else if (gameboard[i][1].isHit) {
      cell.className = `cell cell${i} ship attacked`;
    } else {
      cell.className = `cell cell${i}`;
    }
    cell.draggable = true;
    cell.ondragstart = "event.dataTransfer.setData('text/plain',null)";
    gameboardContainer.appendChild(cell);
  }
}
