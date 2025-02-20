import { format } from 'date-fns';

export class DOM {
  constructor(projectManager) {
    this.projectManager = projectManager;
    this.initializeElements();
    this.projectManager.subscribe(() => this.render());
  }

  initializeElements() {
    // Project elements
    this.projectNameInput = document.getElementById('project-name');
    this.addProjectButton = document.getElementById('add-project');
    this.projectsList = document.getElementById('projects-list');

    // Todo elements
    this.showTodoFormButton = document.getElementById('show-todo-form');
    this.todoForm = document.getElementById('todo-form');
    this.todoTitleInput = document.getElementById('todo-title');
    this.todoDescriptionInput = document.getElementById('todo-description');
    this.todoPriorityInput = document.getElementById('todo-priority');
    this.todoDateInput = document.getElementById('todo-date');
    this.addTodoButton = document.getElementById('add-todo');
    this.todosList = document.getElementById('todos-list');
  }

  init() {
    this.setupEventListeners();
    this.render();
  }

  setupEventListeners() {
    // Project event listeners
    this.addProjectButton.addEventListener('click', () => {
      const projectName = this.projectNameInput.value.trim();
      if (projectName) {
        if (this.projectManager.createProject(projectName)) {
          this.projectNameInput.value = '';
        } else {
          alert('Project already exists!');
        }
      }
    });

    // Todo form event listeners
    this.showTodoFormButton.addEventListener('click', () => {
      if (this.projectManager.getCurrentProject()) {
        this.todoForm.style.display =
          this.todoForm.style.display === 'none' ? 'block' : 'none';
      } else {
        alert('Please select a project first');
      }
    });

    this.addTodoButton.addEventListener('click', () => {
      const currentProject = this.projectManager.getCurrentProject();
      if (!currentProject) return;

      const todo = {
        title: this.todoTitleInput.value.trim(),
        description: this.todoDescriptionInput.value.trim(),
        priority: this.todoPriorityInput.value,
        dueDate: this.todoDateInput.value,
      };

      if (todo.title && todo.dueDate) {
        this.projectManager.addTodo(currentProject, todo);
        this.clearTodoForm();
        this.todoForm.style.display = 'none';
      } else {
        alert('Please fill in all required fields');
      }
    });
  }

  render() {
    this.renderProjects();
    this.renderTodos();
  }

  renderProjects() {
    this.projectsList.innerHTML = '';
    for (const [projectName] of this.projectManager.projects) {
      const projectDiv = document.createElement('div');
      projectDiv.className = 'project-item';
      if (projectName === this.projectManager.getCurrentProject()) {
        projectDiv.classList.add('active');
      }

      const nameSpan = document.createElement('span');
      nameSpan.textContent = projectName;
      nameSpan.addEventListener('click', () => {
        this.projectManager.setCurrentProject(projectName);
      });

      const deleteButton = document.createElement('button');
      deleteButton.className = 'btn btn-danger';
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this project?')) {
          this.projectManager.deleteProject(projectName);
        }
      });

      projectDiv.appendChild(nameSpan);
      projectDiv.appendChild(deleteButton);
      this.projectsList.appendChild(projectDiv);
    }
  }

  showEditForm(todo, projectName) {
    // Create a new div for the edit form
    const editFormDiv = document.createElement('div');
    editFormDiv.className = 'todo-form';

    // Set the edit form HTML
    editFormDiv.innerHTML = `
      <div class="form-grid">
          <div class="form-field">
              <label for="edit-title">Title</label>
              <input type="text" id="edit-title" value="${todo.title}" required>
          </div>
          <div class="form-field">
              <label for="edit-priority">Priority</label>
              <select id="edit-priority">
                  <option value="low" ${
                    todo.priority === 'low' ? 'selected' : ''
                  }>Low</option>
                  <option value="medium" ${
                    todo.priority === 'medium' ? 'selected' : ''
                  }>Medium</option>
                  <option value="high" ${
                    todo.priority === 'high' ? 'selected' : ''
                  }>High</option>
              </select>
          </div>
          <div class="form-field">
              <label for="edit-date">Due Date</label>
              <input type="date" id="edit-date" value="${
                todo.dueDate
              }" required>
          </div>
          <div class="form-field" style="grid-column: span 2;">
              <label for="edit-description">Description</label>
              <textarea id="edit-description">${todo.description}</textarea>
          </div>
          <div class="form-field" style="grid-column: span 2;">
              <button class="btn btn-success" id="save-edit">Save Changes</button>
              <button class="btn btn-danger" id="cancel-edit">Cancel</button>
          </div>
      </div>
  `;

    // Find the todo element to replace
    const todoElement = this.todosList.querySelector(
      `[data-todo-id="${todo.id}"]`
    );
    if (!todoElement) {
      // If we can't find the specific todo element, just append to the list
      this.todosList.appendChild(editFormDiv);
    } else {
      // Replace the todo with the edit form
      todoElement.replaceWith(editFormDiv);
    }

    // Add event listeners for save and cancel buttons
    document.getElementById('save-edit').addEventListener('click', () => {
      const updatedTodo = {
        title: document.getElementById('edit-title').value.trim(),
        description: document.getElementById('edit-description').value.trim(),
        priority: document.getElementById('edit-priority').value,
        dueDate: document.getElementById('edit-date').value,
      };

      if (updatedTodo.title && updatedTodo.dueDate) {
        this.projectManager.editTodo(projectName, todo.id, updatedTodo);
      } else {
        alert('Please fill in all required fields');
      }
    });

    document.getElementById('cancel-edit').addEventListener('click', () => {
      this.render(); // Just re-render the entire todos list
    });
  }

  renderTodos() {
    this.todosList.innerHTML = '';
    const currentProject = this.projectManager.getCurrentProject();

    if (!currentProject) {
      this.todoForm.style.display = 'none';
      return;
    }

    const todos = this.projectManager.projects.get(currentProject);
    todos.forEach((todo) => {
      const todoDiv = document.createElement('div');
      todoDiv.className = `todo-item priority-${todo.priority}`;
      todoDiv.dataset.todoId = todo.id; // Add this line to set the data-todo-id
      if (todo.completed) todoDiv.classList.add('completed');

      const todoContent = `
          <div class="todo-header">
              <h3>${todo.title}</h3>
              <span class="todo-date">Due: ${format(
                new Date(todo.dueDate),
                'MMM d, yyyy'
              )}</span>
          </div>
          <p class="todo-description">${todo.description}</p>
          <div class="todo-footer">
              <span class="todo-priority">Priority: ${todo.priority}</span>
              <div class="todo-actions">
                  <button class="btn btn-success btn-complete">${
                    todo.completed ? 'Undo' : 'Complete'
                  }</button>
                  <button class="btn btn-primary btn-edit">Edit</button>
                  <button class="btn btn-danger btn-delete">Delete</button>
              </div>
          </div>
      `;

      todoDiv.innerHTML = todoContent;

      // Debugging edit form
      todoDiv.querySelector('.btn-edit').addEventListener('click', () => {
        console.log('Edit button clicked');
        console.log('Todo data:', todo);
        console.log('Current project:', currentProject);
        this.showEditForm(todo, currentProject);
      });

      // Add event listeners
      todoDiv.querySelector('.btn-complete').addEventListener('click', () => {
        this.projectManager.toggleTodoComplete(currentProject, todo.id);
      });

      todoDiv.querySelector('.btn-edit').addEventListener('click', () => {
        this.showEditForm(todo, currentProject);
      });

      todoDiv.querySelector('.btn-delete').addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this todo?')) {
          this.projectManager.deleteTodo(currentProject, todo.id);
        }
      });

      this.todosList.appendChild(todoDiv);
    });
  }

  clearTodoForm() {
    this.todoTitleInput.value = '';
    this.todoDescriptionInput.value = '';
    this.todoPriorityInput.value = 'low';
    this.todoDateInput.value = '';
  }
}
