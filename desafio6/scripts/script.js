const table = document.querySelector("#table");
const playAndPause = document.querySelector("#playAndPause");
const reset = document.querySelector("#reset");
const outputStep = document.querySelector("#step");
const cols = document.querySelector("#cols");
const rows = document.querySelector("#rows");

let NUM_ROWS = 10;
let NUM_COLS = 10;
let startDot = false;
let finishDot = false;

let matrizTable = [];

let isInteracting = false;
let startX = 0,
  startY = 0;
let isDragging = false;
const DRAG_THRESHOLD = 5;

createTable();

playAndPause.addEventListener("click", () => {
  const divDisabled = document.querySelector("#disabled");

  divDisabled.classList.toggle("disabled");
  console.log(startDot);
  console.log(mapAllAround(startDot));
});

reset.addEventListener("click", () => {
  createTable();
  startDot = false;
  finishDot = false;
  outputStep.innerHTML = "0";
});

cols.addEventListener("input", () => {
  NUM_COLS = Number(cols.value);
  createTable();
  outputStep.innerHTML = "0";
});

rows.addEventListener("input", () => {
  NUM_ROWS = Number(rows.value);
  createTable();
  outputStep.innerHTML = "0";
});

function createTable() {
  matrizTable = [];

  table.innerHTML = "";

  for (let i = 0; i < NUM_ROWS; i++) {
    const row = document.createElement("tr");
    const matrizRow = [];

    for (let j = 0; j < NUM_COLS; j++) {
      const col = document.createElement("td");
      col.setAttribute("data-cord", `${i}-${j}`);
      const matrizCol = 0;

      row.appendChild(col);
      matrizRow.push(matrizCol);
    }

    table.appendChild(row);
    matrizTable.push(matrizRow);
  }

  table.addEventListener("mousedown", handleInteractionStart);
  table.addEventListener("mousemove", handleInteractionMove);
  table.addEventListener("mouseup", handleInteractionEnd);
  table.addEventListener("mouseleave", handleInteractionEnd);

  table.addEventListener("touchstart", handleInteractionStart);
  table.addEventListener("touchmove", handleInteractionMove);
  table.addEventListener("touchend", handleInteractionEnd);
  table.addEventListener("touchcancel", handleInteractionEnd);
}

function mapAllAround(cell) {
  const [row, col] = getCoords(cell);

  const directions = [
    [-1, -1], // topo esquerdo
    [-1, 0], // topo
    [-1, 1], // topo direito
    [0, -1], // esquerda
    [0, 1], // direita
    [1, -1], // baixo esquerdo
    [1, 0], // baixo
    [1, 1], // baixo direito
  ];

  const directionsValid = [];

  directions.forEach((direction) => {
    const newRow = row + direction[0];
    const newCol = col + direction[1];

    if (verifyValueCell(matrizTable[newRow][newCol])) {
      directionsValid.push([newRow, newCol]);
    }
  });

  return directionsValid;
}

function applyPaint(event) {
  let cell = null;

  if (event.type.startsWith("touch")) {
    event.preventDefault();
    const touch = event.touches[0] || event.changedTouches[0];

    if (!touch) {
      return;
    }

    const element = document.elementFromPoint(touch.clientX, touch.clientY);

    if (element && element.tagName === "TD") {
      cell = element;
    }
  } else {
    cell = event.target;
  }

  if (cell && cell.tagName === "TD") {
    if (isDragging) {
      if (
        !cell.classList.contains("start") &&
        !cell.classList.contains("end")
      ) {
        cell.classList.toggle("wall");
      }
    } else {
      if (!startDot || cell.classList.contains("start")) {

        cell.classList.add("start");
        
        !startDot ? (startDot = cell) : (startDot = false);

        matrizTable[getCoords(cell)[0]][getCoords(cell)[1]] = 1;

      } else if (!finishDot || cell.classList.contains("end")) {

        cell.classList.toggle("end");
        
        !finishDot ? (finishDot = cell) : (finishDot = false);

        matrizTable[getCoords(cell)[0]][getCoords(cell)[1]] = 2;
      } else {
        cell.classList.toggle("wall");
      }
    }
    if (cell.classList.contains("wall")) {
      matrizTable[getCoords(cell)[0]][getCoords(cell)[1]] = 3;
    }
  }
}

function handleInteractionStart(event) {
  isInteracting = true;
  isDragging = false;

  if (event.type.startsWith("touch")) {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
  } else {
    startX = event.clientX;
    startY = event.clientY;
  }

  applyPaint(event);
}

function handleInteractionMove(event) {
  if (!isInteracting) return;

  if (!isDragging) {
    let currentX, currentY;

    if (event.type.startsWith("touch")) {
      currentX = event.touches[0].clientX;
      currentY = event.touches[0].clientY;
    } else {
      currentX = event.clientX;
      currentY = event.clientY;
    }

    const dx = currentX - startX;
    const dy = currentY - startY;

    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
      isDragging = true;
    }
  }

  if (isDragging) {
    applyPaint(event);
  }
}

function handleInteractionEnd() {
  isInteracting = false;
  isDragging = false;
}

function getCellFromTouchEvent(event) {
  if (event.type !== "touchmove") return null;
  const touch = event.touches[0];
  const cell = document.elementFromPoint(touch.clientX, touch.clientY);
  if (cell && cell.tagName === "TD") {
    return cell;
  }
  return null;
}

function getCoords(cell, arr) {

  console.log(cell);

  const [row, col] = cell.getAttribute("data-cord").split("-");
  return [Number(row), Number(col)];
}

function verifyValueCell(cell) {
  const [row, col] = getCoords(cell);

  const matrizCell = matrizTable[row][col];

  console.log(row, col, matrizCell);

  if (matrizCell == 3 || matrizCell == 1) {
    return false;
  } else if (matrizCell == 0) {
    return true;
  }
}
