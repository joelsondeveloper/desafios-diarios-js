const table = document.querySelector("#table");
const playAndPause = document.querySelector("#playAndPause");
const reset = document.querySelector("#reset");
const outputStep = document.querySelector("#step");
const cols = document.querySelector("#cols");
const rows = document.querySelector("#rows");
const steps = document.querySelector("#steps");
const timeGame = document.querySelector("#time");
const divDisabled = document.querySelector("#disabled");

let NUM_ROWS = 10;
let NUM_COLS = 10;
let startDot = false;
let finishDot = false;
let found = false;
let lastCell = null;
let time = 0;
let timeId = null;

let matrizTable = [];
let processingQueue = [];
let visited = [];
let matrizReference = [];

let isInteracting = false;
let startX = 0,
  startY = 0;
let isDragging = false;
const DRAG_THRESHOLD = 5;

createTable();

playAndPause.addEventListener("click", () => {
  initMatrizReference();
  initTime();

  // console.log(matrizReference);

  divDisabled.classList.add("disabled");
  const coordStart = startDot.getAttribute("data-cord");
  processingQueue.push(coordStart.split("-"));
  simulateFindPath();
});

// reset.addEventListener("click", () => {
//   matrizTable = [];
//   matrizReference = [];
//   createTable();
//   divDisabled.classList.remove("disabled");
//   startDot = false;
//   finishDot = false;
//   outputStep.innerHTML = "0";
// });

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

function renderMatriz() {
  for (let i = 0; i < NUM_ROWS; i++) {
    for (let j = 0; j < NUM_COLS; j++) {
      const cell = table.rows[i].cells[j];
      let number = matrizTable[i][j];

      cell.classList.remove("start", "end", "wall", "visited", "path");

      // console.log(alreadyArr(i, j));
      if (alreadyArr(i, j) && number != 5) {
        number = 4;
      }

      if (alreadyArr(i, j, processingQueue)) {
        number = 5;
      }

      switch (number) {
        case 1:
          cell.classList.add("start");
          break;
        case 2:
          cell.classList.add("end");
          break;
        case 3:
          cell.classList.add("wall");
          break;
        case 4:
          cell.classList.add("visited");
          break;
        case 5:
          cell.classList.add("path");
          break;
        default:
          break;
      }
    }
  }
}

function mapAllAround(cell) {
  const [row, col] = getCoords(cell);

  const directions = [
    // [-1, -1], // topo esquerdo
    [-1, 0], // topo
    // [-1, 1], // topo direito
    [0, -1], // esquerda
    [0, 1], // direita
    // [1, -1], // baixo esquerdo
    [1, 0], // baixo
    // [1, 1], // baixo direito
  ];

  const directionsValid = [];

  directions.forEach((direction) => {
    const newRow = row + direction[0];
    const newCol = col + direction[1];

    if (newRow < 0 || newRow >= NUM_ROWS || newCol < 0 || newCol >= NUM_COLS) {
      return;
    }

    const [isValid, isFind] = verifyValueCell(null, [newRow, newCol]);

    // console.log(isFind)

    if (isValid) {
      directionsValid.push([newRow, newCol]);
      visited.push([newRow, newCol]);
      processingQueue.push([newRow, newCol]);
      matrizReference[newRow][newCol] = [row, col];
      // matrizTable[newRow][newCol] = 5;
    } else if (isFind) {
      processingQueue.length = 0;
      found = true;
      lastCell = [newRow, newCol];
      matrizReference[newRow][newCol] = [row, col];
      // matrizTable[newRow][newCol] = 5;
    }
  });

  renderMatriz();

  return directionsValid;
}

function simulateFindPath() {
  if (processingQueue.length < 1 || found) {
    processingQueue.length = 0;
    // console.log(matrizReference);
    buildPath(lastCell[0], lastCell[1]);
    clearInterval(timeId);
    return;
  }

  // console.log(processingQueue.shift().join("-"));

  const attribute = processingQueue.shift().join("-");
  const cellDom = document.querySelector(`td[data-cord="${attribute}"]`);

  // console.log("processando:", attribute);

  const stepValue = Number(steps.value);

  setTimeout(() => {
    mapAllAround(cellDom);
    simulateFindPath();
  }, stepValue);
}

function buildPath(row, col) {
  if (!row || matrizTable[row][col] === 1) return;

  const stepValue = steps.value;

  setTimeout(() => {
    if (matrizTable[row][col] !== 2) {
      matrizTable[row][col] = 5;
    }

    renderMatriz();

    const parent = matrizReference[row][col];
    // console.log(matrizTable[row][col]);
    if (!parent) return;
    [row, col] = parent;

    buildPath(parent[0], parent[1]);
  }, stepValue);
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
    const [row, col] = getCoords(cell);
    if (isDragging) {
      const currentState = matrizTable[row][col];
      if (currentState !== 1 && currentState !== 2) {
        matrizTable[row][col] = 3;
      }
    } else {
      if (!startDot || cell.classList.contains("start")) {
        !startDot
          ? ((startDot = cell), (matrizTable[row][col] = 1))
          : ((startDot = false), (matrizTable[row][col] = 0));
      } else if (!finishDot || cell.classList.contains("end")) {
        !finishDot
          ? ((finishDot = cell),
            (matrizTable[getCoords(cell)[0]][getCoords(cell)[1]] = 2))
          : ((finishDot = false),
            (matrizTable[getCoords(cell)[0]][getCoords(cell)[1]] = 0));
      } else {
        if (cell.classList.contains("wall")) {
          matrizTable[row][col] = 0;
        } else {
          matrizTable[row][col] = 3;
        }
      }
    }
  }

  // console.log(matrizTable);
  renderMatriz();
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

function getCoords(cell) {
  const [row, col] = cell.getAttribute("data-cord").split("-");
  return [Number(row), Number(col)];
}

function verifyValueCell(cell, arr) {
  const [row, col] = arr;

  if (cell) {
    const [row, col] = getCoords(cell);
  }
  matrizCell = matrizTable[row][col];

  // console.log(alreadyArr(row, col));

  if (matrizCell == 3 || matrizCell == 1 || alreadyArr(row, col)) {
    return [false, false];
  } else if (matrizCell == 0) {
    return [true, false];
  } else if (matrizCell == 2) {
    isFind = true;
    return [false, true];
  } else {
    return [false, false];
  }
}

function alreadyArr(row, col, arr = visited) {
  return arr.some(([r, c]) => r === row && c === col);
}

function initMatrizReference() {
  matrizReference = [];
  for (let i = 0; i < NUM_ROWS; i++) {
    const row = [];
    for (let j = 0; j < NUM_COLS; j++) {
      row.push(null);
    }
    matrizReference.push(row);
  }
}

function initTime() {
  timeId = setInterval(() => {
    time += 1;
    timeGame.innerText = time;
  }, 1000);
}
