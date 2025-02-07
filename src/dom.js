import { format } from 'date-fns';

export default class DOM {
  static renderProjects(projects, currentProject, setCurrentProject) {
    const projectsList = document.getElementById('projects-list');
    projectsList.innerHTML = '';
    projects.forEach((project, index) => {
      const projectItem = document.createElement('li');
      projectItem.textContent = project.name;
      projectItem.addEventListener('click', () => setCurrentProject(index));
      if (project === currentProject) {
        projectItem.classList.add('active');
      }
      projectsList.appendChild(projectItem);
    });
  }

  static renderTodos(currentProject, deleteTodo) {
    const todosList = document.getElementById('todos-list');
    todosList.innerHTML = '';
    currentProject.todos.forEach((todo, index) => {
      const todoItem = document.createElement('li');
      todoItem.innerHTML = `<h3>${todo.title}</h3>
      <p>${format(new Date(todo.dueDate), 'MM/dd/yyyy')}</p>
      <button onclick="deleteTodo(${index})">Delete</button>`;
      todosList.appendChild(todoItem);
    });
  }
}
