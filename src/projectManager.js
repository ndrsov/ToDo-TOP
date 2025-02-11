import { Storage } from './utils/storage';
import { Todo } from './todo';

export class ProjectManager {
  constructor() {
    this.projects = new Map();
    this.currentProject = null;
    this.observers = new Set();
  }

  subscribe(observer) {
    this.observers.add(observer);
  }

  unsubscribe(observer) {
    this.observers.delete(observer);
  }

  notify() {
    this.observers.forEach((observer) => observer());
  }

  createProject(name) {
    if (!this.projects.has(name)) {
      this.projects.set(name, []);
      this.saveToStorage();
      this.notify();
      return true;
    }
    return false;
  }

  deleteProject(name) {
    if (this.projects.has(name)) {
      this.projects.delete(name);
      if (this.currentProject === name) {
        this.currentProject = null;
      }
      this.saveToStorage();
      this.notify();
      return true;
    }
    return false;
  }

  setCurrentProject(name) {
    if (this.projects.has(name)) {
      this.currentProject = name;
      this.saveToStorage();
      this.notify();
      return true;
    }
    return false;
  }

  getCurrentProject() {
    return this.currentProject;
  }

  addTodo(projectName, todoData) {
    if (this.projects.has(projectName)) {
      const todo = new Todo(
        todoData.title,
        todoData.description,
        todoData.priority,
        todoData.dueDate
      );
      this.projects.get(projectName).push(todo);
      this.saveToStorage();
      this.notify();
      return todo;
    }
    return null;
  }

  deleteTodo(projectName, todoId) {
    if (this.projects.has(projectName)) {
      const todos = this.projects.get(projectName);
      const index = todos.findIndex((todo) => todo.id === todoId);
      if (index !== -1) {
        todos.splice(index, 1);
        this.saveToStorage();
        this.notify();
        return true;
      }
    }
    return false;
  }

  editTodo(projectName, todoId, updatedTodo) {
    if (this.projects.has(projectName)) {
      const todos = this.projects.get(projectName);
      const todo = todos.find((todo) => todo.id === todoId);
      if (todo) {
        todo.update(updatedTodo);
        this.saveToStorage();
        this.notify();
        return todo;
      }
    }
    return null;
  }

  toggleTodoComplete(projectName, todoId) {
    if (this.projects.has(projectName)) {
      const todos = this.projects.get(projectName);
      const todo = todos.find((todo) => todo.id === todoId);
      if (todo) {
        todo.toggleComplete();
        this.saveToStorage();
        this.notify();
        return todo;
      }
    }
    return null;
  }

  saveToStorage() {
    const data = {
      projects: Object.fromEntries(this.projects),
      currentProject: this.currentProject,
    };
    Storage.save('todoApp', data);
  }

  loadFromStorage() {
    const data = Storage.load('todoApp');
    if (data) {
      this.projects = new Map(Object.entries(data.projects));
      this.currentProject = data.currentProject;
      this.notify();
    }
  }
}
