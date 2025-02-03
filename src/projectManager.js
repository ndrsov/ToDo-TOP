export default class ProjectManager {
  constructor() {
    this.projects = [];
    this.projects.push({ name: 'Default', todos: [] });
    this.currentProject = this.projects[0];
    this.load();
  }
}
