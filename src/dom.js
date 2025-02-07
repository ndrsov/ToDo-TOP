import { format } from 'date-fns';

export default class DOM {
  // Modal logic
  static init() {
    const projectModal = document.getElementById('project-modal');
    document.getElementById('new-project-btn').onclick = () =>
      DOM.toggleModal(projectModal);
    projectModal.querySelector('.close').onclick = () =>
      DOM.toggleModal(projectModal);

    const todoModal = document.getElementById('todo-modal');
    document.getElementById('new-todo-btn').onclick = () =>
      DOM.toggleModal(todoModal);
    todoModal.querySelector('.close').onclick = () =>
      DOM.toggleModal(todoModal);

    window.onclick = (event) => {
      [projectModal, todoModal].forEach((modal) => {
        if (event.target === modal) DOM.toggleModal(modal);
      });
    };
  }

  static toggleModal(modal) {
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
  }

  // Render logic
  static renderProjects(projects, currentProject, setCurrentProject) {
    const projectsList = document.getElementById('projects-list');
    projectsList.innerHTML = '';
    projects.forEach((project, index) => {
      const projectItem = document.createElement('li');
      projectItem.textContent = project.name;
      projectItem.className = project === currentProject ? 'active' : '';
      projectItem.addEventListener('click', () => setCurrentProject(index));
      projectsList.appendChild(projectItem);
    });
  }

  static renderTodos(currentProject, deleteHandler, editHandler) {
    const todosList = document.getElementById('todos-list');
    todosList.innerHTML = '';

    currentProject.todos.forEach((todo, index) => {
      const todoItem = document.createElement('li');
      todoItem.innerHTML = `
      <div>
        <h3>${todo.title}</h3>
        <p>${format(new Date(todo.dueDate), 'MM/dd/yyyy')}</p>
        <span class="priority-${todo.priority}">Prirority: ${
        todo.priority
      }</span>
        </div>
        <button class="btn-danger"">Delete</button>
        <button class="btn-primary"">Edit</button>
      `;

      todoItem
        .querySelector('.btn-danger')
        .addEventListener('click', () => deleteHandler(index));
      todoItem
        .querySelector('.btn-primary')
        .addEventListener('click', () => editHandler(index));
      todosList.appendChild(todoItem);
    });
  }
}
