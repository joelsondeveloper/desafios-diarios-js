const form = document.querySelector("#form");
const list = document.querySelector("#list");

let tasks = [];

form.addEventListener("submit", handleSubmit);

list.addEventListener("click", handleChange);

function handleSubmit(event) {
  event.preventDefault();

  const name = document.querySelector("#item").value;

  addTask(name);

  console.log(tasks);

  form.reset();

  renderTasks();
}

function handleChange(event) {
  const taskId = event.target.id;

  if (!taskId) {
    return;
  } else if (taskId.startsWith("task-")) {
    const task = tasks.find((task) => {
        console.log(task);
      return task.id === Number(taskId.split("-")[1]);
    });

    console.log(taskId);

    task.completed = !task.completed;
  } else if (taskId.startsWith("delete-")) {
    deleteTask(taskId);
  }

  renderTasks();
}

function addTask(name) {
  if (!name || name.trim() === "") {
    return;
  }

  const task = {
    name,
    id: tasks.length + 1,
    completed: false,
  };

  tasks.push(task);


}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== Number(id.split("-")[1]));

  console.log(tasks, id.split("-")[1]);
}

function renderTasks() {
  list.innerHTML = "";

  tasks.forEach((task) => {
    const item = document.createElement("li");
    item.classList.add("item");

    item.innerHTML = `
        
        <label>
        <span>${task.name}</span>
        <div class="buttons">
        <input type="checkbox" id="task-${task.id}">
        <button id="delete-${task.id}">X</button>
        </div>
        </label>
        
        `;

    item.classList.toggle("completed", task.completed);

    list.appendChild(item);
  });
}
