let tasks = [];

window.addEventListener('load', () => {
  const storedTasks = JSON.parse(localStorage.getItem('tasks'));
  if (storedTasks) {
    tasks = storedTasks;
    renderTasks();
  }
});


const form = document.getElementById('addingForm');
form.addEventListener('submit', function(event) {
  event.preventDefault();
  const input = form.querySelector('input[type="text"]');
  const taskText = input.value.trim();
  if (taskText !== '') {
    const task = { title: taskText, status: 'Incomplete', description: '' };
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    input.value = '';
  }
});


function renderTasks() {
  const list = document.getElementById('mainList');
  list.innerHTML = '';
  tasks.forEach((task, index) => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    listItem.innerHTML = `
      <div class="task" data-index="${index}">
        <h5>${task.title}</h5>
        <p>Status: ${task.status}</p>
        <div class="description">${task.description}</div>
        <button class="edit-btn btn btn-outline-primary">Edit</button>
        <button class="delete-btn btn btn-outline-danger">Delete</button>
      </div>
    `;
    list.appendChild(listItem);
  });
}


document.getElementById('mainList').addEventListener('click', function(event) {
  const taskIndex = event.target.closest('.task').dataset.index;
  const task = tasks[taskIndex];
  if (event.target.classList.contains('edit-btn')) {
    editTask(taskIndex, task);
  } else if (event.target.classList.contains('delete-btn')) {
    deleteTask(taskIndex);
  }
});


function editTask(index, task) {
  const editPopup = document.createElement('div');
  editPopup.innerHTML = `
    <div class="edit-popup">
      <input type="text" id="editTitle" value="${task.title}" placeholder="Enter new title">
      <input type="text" id="editDescription" value="${task.description}" placeholder="Enter new description">
      <select id="editStatus">
        <option value="Incomplete" ${task.status === 'Incomplete' ? 'selected' : ''}>Incomplete</option>
        <option value="In Progress" ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
        <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
      </select>
      <button id="saveEditBtn">Save</button>
      <button id="cancelEditBtn">Cancel</button>
    </div>
  `;
  document.body.appendChild(editPopup);

  const saveEditBtn = document.getElementById('saveEditBtn');
  saveEditBtn.addEventListener('click', () => {
    const newTitle = document.getElementById('editTitle').value.trim();
    const newDescription = document.getElementById('editDescription').value.trim();
    const newStatus = document.getElementById('editStatus').value;
    tasks[index] = { title: newTitle, description: newDescription, status: newStatus };
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    document.body.removeChild(editPopup);
  });

  const cancelEditBtn = document.getElementById('cancelEditBtn');
  cancelEditBtn.addEventListener('click', () => {
    document.body.removeChild(editPopup);
  });
}


function deleteTask(index) {
  if (confirm('Are you sure you want to delete this task?')) {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
  }
}
