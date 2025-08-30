const table = document.querySelector("#table");
const playAndPause = document.querySelector("#playAndPause");
const reset = document.querySelector("#reset");
const time = document.querySelector("#time");
const steps = document.querySelector("#steps");
const outputStep = document.querySelector("#step");
const cols = document.querySelector("#cols");
const rows = document.querySelector("#rows");

let NUM_ROWS = 50;
let NUM_COLS = 50;
let intervalId = null;
let timeGame = 0;

let matrizTable = [];

let isMouseDown = false;

createTable();

playAndPause.addEventListener("click", () => {
  const timeValue = Number(time.value);
  const stepValue = Number(steps.value);

  if (intervalId === null) {
    playSimulation(timeValue, stepValue);
  } else {
    clearInterval(intervalId);
    intervalId = null;
  }
});

reset.addEventListener("click", () => {
  createTable();
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

  table.addEventListener("mousedown", () => {
    isMouseDown = true;
  });

  table.addEventListener("mouseup", () => {
    isMouseDown = false;
  });

  const cells = table.querySelectorAll("td");

  cells.forEach((cell) => {
    cell.addEventListener("mousedown", () => {
      toggleCell(cell);
    });

    cell.addEventListener("mouseover", () => {
      if (isMouseDown) {
        toggleCell(cell);
      }
    });
  });
}

function renderTable(cloneTable) {
  for (let i = 0; i < NUM_ROWS; i++) {
    for (let j = 0; j < NUM_COLS; j++) {
      const cell = document.querySelector(`[data-cord="${i}-${j}"]`);
      const matrizCell = cloneTable[i][j];

      if (
        (cell.classList.contains("active") && matrizCell == 0) ||
        (!cell.classList.contains("active") && matrizCell == 1)
      ) {
        toggleCell(cell);
      }
    }
  }

  matrizTable.length = 0;
  cloneTable.forEach((row) => matrizTable.push([...row]));
}

function simulateTable() {
  const matrizTableClone = matrizTable.map((row) => [...row]);

  for (let i = 0; i < NUM_ROWS; i++) {
    for (let j = 0; j < NUM_COLS; j++) {
      const coordCell = [i, j];

      const aroundCell = mapAllAround(coordCell);
      matrizTableClone[i][j] = simulateCell(matrizTableClone[i][j], aroundCell);
    }
  }

  renderTable(matrizTableClone);
}

function simulateCell(cell, neighbors) {
  if (cell === 1) {
    if (neighbors > 3) {
      cell = 0;
    } else if (neighbors == 2 || neighbors == 3) {
      cell = 1;
    } else {
      cell = 0;
    }
  } else {
    if (neighbors == 3) {
      cell = 1;
    }
  }

  return cell;
}

function toggleCell(cell) {
  cell.classList.toggle("active");

  const attribute = cell.getAttribute("data-cord").split("-");

  const [row, col] = attribute.map(Number);

  matrizTable[row][col] = matrizTable[row][col] === 0 ? 1 : 0;
}

function mapAllAround(cell) {
  const [row, col] = cell;

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

  const neighborsAlive = directions.reduce((acc, [dx, dy]) => {
    const newRow = row + dx;
    const newCol = col + dy;

    if (newRow >= 0 && newRow < NUM_ROWS && newCol >= 0 && newCol < NUM_COLS) {
      return acc + matrizTable[newRow][newCol];
    }

    return acc;
  }, 0);

  return neighborsAlive;
}

function playSimulation(time, step) {
  let stepTotal = 0;
  time *= 1000;
  step *= 1000;

  time -= timeGame;
  timeGame = 0;

  intervalId = setInterval(() => {
    simulateTable();
    timeGame += step;
    stepTotal++;
    outputStep.innerHTML = stepTotal;
    console.log(timeGame);

    if (timeGame >= time) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }, step);

  console.log(time, step);
}
