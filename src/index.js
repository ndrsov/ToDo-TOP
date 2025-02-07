import './styles/style.css';
import ProjectManager from './projectmanager';
import DOM from './dom';

const app = new ProjectManager();

function render() {
  DOM.renderProjects(app.projects, app.currentProject, (index) => {
    app.setCurrentProject(app.projects[index]);
    render();
  });
  DOM.renderTodos(app.currentProject, (index) => {
    app.deleteTodo(index);
    render();
  });
}

document.getElementById('add-project').addEventListener('click', () => {
  const peojectName = prompt('Enter project name');
  if (peojectName) {
    app.addProject(peojectName);
    render();
  }
});

document.getElementById('add-todo').addEventListener('click', () => {
  const title = prompt('Enter todo title');
  const description = prompt('Enter todo description');
  const dueDate = prompt('Enter todo due date (YYYY-MM-DD)');
  const priority = prompt('Enter todo priority (1 - 3)');
  if (title && description && dueDate && priority) {
    app.addTodo(title, description, dueDate, priority);
    render();
  }
});

render();
