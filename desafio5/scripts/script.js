const table = document.querySelector("#table");

const NUM_ROWS = 5;
const NUM_COLS = 5;

let matrizTable = [];

let isMouseDown = false;

table.addEventListener("mousedown", () => {
  isMouseDown = true;
});

table.addEventListener("mouseup", () => {
  isMouseDown = false;
});

renderTable();

const cells = table.querySelectorAll("td");

cells.forEach((cell) => {
  cell.addEventListener("mousedown", () => {
    toggleCell(cell);
    simulateCell(cell);
  });

  cell.addEventListener("mouseover", () => {
    if (isMouseDown) {
      toggleCell(cell);
    }
  });
});

function renderTable() {
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

  console.log(matrizTable);
}

function sinulateTable() {}

function simulateCell(cell) {
  const attribute = cell.getAttribute("data-cord").split("-");

  const matrizCell = matrizTable[attribute[0]][attribute[1]];

  console.log(matrizCell);
}

function toggleCell(cell) {
  cell.classList.toggle("active");

  const attribute = cell.getAttribute("data-cord").split("-");

  const [row, col] = attribute.map(Number);

  matrizTable[row][col] = matrizTable[row][col] === 0 ? 1 : 0;
}

function mapAllAround () {
    
}