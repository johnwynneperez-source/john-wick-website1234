let tasks = [];
let editingIndex = null;
let currentFilter = 'all';

// Elements
const taskList = document.getElementById('taskList');
const openModalBtn = document.getElementById('openModalBtn');
const taskModal = document.getElementById('taskModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const saveTaskBtn = document.getElementById('saveTaskBtn');
const taskInput = document.getElementById('taskInput');
const modalTitle = document.getElementById('modalTitle');

const filterAll = document.getElementById('filterAll');
const filterActive = document.getElementById('filterActive');
const filterCompleted = document.getElementById('filterCompleted');

// ===== LOAD TASKS FROM localStorage =====
function loadTasks() {
  const storedTasks = JSON.parse(localStorage.getItem("tasks"));
  if (storedTasks) {
    tasks = storedTasks;
    renderTasks();
  }
}

// ===== SAVE TASKS TO localStorage =====
function saveToStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Show modal for adding
openModalBtn.onclick = () => {
  editingIndex = null;
  modalTitle.textContent = 'Add Task';
  taskInput.value = '';
  taskModal.classList.remove('hidden');
  taskInput.focus();
};

// Close modal
closeModalBtn.onclick = () => {
  taskModal.classList.add('hidden');
};

// Save task (add or edit)
saveTaskBtn.onclick = () => {
  const value = taskInput.value.trim();
  if (!value) return;
  if (editingIndex === null) {
    tasks.push({ text: value, completed: false });
  } else {
    tasks[editingIndex].text = value;
  }
  taskModal.classList.add('hidden');
  renderTasks();
  saveToStorage(); // Save after adding/updating
};

// Render tasks with filter
function renderTasks() {
  taskList.innerHTML = '';
  let filteredTasks = tasks;
  if (currentFilter === 'active') {
    filteredTasks = tasks.filter(t => !t.completed);
  } else if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(t => t.completed);
  }
  if (filteredTasks.length === 0) {
    // Show a placeholder message
    const li = document.createElement('li');
    li.style.justifyContent = 'center';
    li.style.background = 'transparent';
    li.style.border = 'none';
    li.style.color = '#fff';
    li.style.textShadow = '1px 1px 4px rgba(0,0,0,0.7)';
    li.textContent = 'No tasks found';
    taskList.appendChild(li);
    return;
  }
  filteredTasks.forEach((task, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''} data-index="${tasks.indexOf(task)}" class="task-checkbox"/>
      <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
      <div class="task-actions">
        <button class="edit-btn" data-index="${tasks.indexOf(task)}">Edit</button>
        <button class="delete-btn" data-index="${tasks.indexOf(task)}">Delete</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

// Checkbox toggle
taskList.onclick = function(e) {
  if (e.target.classList.contains('task-checkbox')) {
    const idx = e.target.getAttribute('data-index');
    tasks[idx].completed = !tasks[idx].completed;
    renderTasks();
  }
  // Edit
  if (e.target.classList.contains('edit-btn')) {
    editingIndex = e.target.getAttribute('data-index');
    modalTitle.textContent = 'Edit Task';
    taskInput.value = tasks[editingIndex].text;
    taskModal.classList.remove('hidden');
    taskInput.focus();
  }
  // Delete
  if (e.target.classList.contains('delete-btn')) {
    const idx = e.target.getAttribute('data-index');
    tasks.splice(idx, 1);
    renderTasks();
    saveToStorage(); // Save after deleting
  }
};

// Filter buttons
filterAll.onclick = () => {
  currentFilter = 'all';
  setActiveFilterBtn(filterAll);
  renderTasks();
};
filterActive.onclick = () => {
  currentFilter = 'active';
  setActiveFilterBtn(filterActive);
  renderTasks();
};
filterCompleted.onclick = () => {
  currentFilter = 'completed';
  setActiveFilterBtn(filterCompleted);
  renderTasks();
};

function setActiveFilterBtn(activeBtn) {
  [filterAll, filterActive, filterCompleted].forEach(btn => btn.classList.remove('active'));
  activeBtn.classList.add('active');
}

// Load tasks when page loads
loadTasks();
