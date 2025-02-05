import Todo from './todo';
import Storage from './utils/storage';

export default class ProjectManager {
  constructor() {
    this.projects = [];
    this.projects.push({ name: 'Default', todos: [] });
    this.currentProject = this.projects[0];
    this.load();
  }

  addProject(name) {
    this.projects.push({ name, todos: [] });
    Storage.save(this.projects);
  }

  setCurrentProject(project) {
    this.currentProject = project;
  }

  addTodo(title, description, dueDate, priority) {
    const newTodo = Todo(title, description, dueDate, priority);
    this.currentProject.todos.push(newTodo);
    Storage.save(this.projects);
  }

  deleteTodo(todoIndex) {
    this.currentProject.todos.splice(todoIndex, 1);
    Storage.save(this.projects);
  }

  load() {
    const loadedProjects = Storage.load();
    if (loadedProjects) {
      this.projects = loadedProjects;
      this.currentProject = this.projects[0];
    }
  }
}
