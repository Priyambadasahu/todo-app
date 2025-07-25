let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskInput = document.getElementById("taskInput");
const reminderInput = document.getElementById("reminderInput");
const taskList = document.getElementById("taskList");
const progressBar = document.getElementById("progress-bar");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateProgressBar();
}

function addTask() {
  const taskText = taskInput.value.trim();
  const reminder = reminderInput.value;

  if (!taskText) return alert("Please enter a task!");

  const task = {
    id: Date.now(),
    text: taskText,
    completed: false,
    reminder: reminder
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  if (reminder) {
    const reminderTime = new Date(reminder) - new Date();
    if (reminderTime > 0) {
      setTimeout(() => {
        alert(`⏰ Reminder: ${task.text}`);
      }, reminderTime);
    }
  }

  taskInput.value = "";
  reminderInput.value = "";
}

function toggleComplete(id) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function updateProgressBar() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const percentage = total ? (completed / total) * 100 : 0;
  progressBar.style.width = `${percentage}%`;
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = `task ${task.completed ? "completed" : ""}`;
    li.setAttribute("draggable", true);

    li.innerHTML = `
      <span>${task.text}</span>
      <div>
        <button class="complete-btn" onclick="toggleComplete(${task.id})">✔</button>
        <button class="delete-btn" onclick="deleteTask(${task.id})">🗑</button>
      </div>
    `;

    taskList.appendChild(li);
  });

  enableDragDrop();
  updateProgressBar();
}

function enableDragDrop() {
  let dragSrcEl = null;

  taskList.querySelectorAll(".task").forEach(item => {
    item.addEventListener("dragstart", e => {
      dragSrcEl = e.target;
      e.dataTransfer.effectAllowed = "move";
    });

    item.addEventListener("dragover", e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    });

    item.addEventListener("drop", e => {
      e.preventDefault();
      if (dragSrcEl !== e.target) {
        const dragIndex = [...taskList.children].indexOf(dragSrcEl);
        const dropIndex = [...taskList.children].indexOf(e.target);
        [tasks[dragIndex], tasks[dropIndex]] = [tasks[dropIndex], tasks[dragIndex]];
        saveTasks();
        renderTasks();
      }
    });
  });
}

document.getElementById("darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// On load
renderTasks();
