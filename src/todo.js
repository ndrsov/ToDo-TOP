export class Todo {
  constructor(title, description, priority, dueDate) {
    this.id = Date.now().toString();
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.dueDate = dueDate;
    this.completed = false;
    this.createdAt = new Date().toISOString();
  }
  toggleComplete() {
    this.completed = !this.completed;
  }

  update(data) {
    Object.assign(this, data);
  }
}
