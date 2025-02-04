export default class Storage {
  static save(projects) {
    localStorage.setItem('projects', JSON.stringify(projects));
  }

  static load() {
    const projects = localStorage.getItem('projects');
    return projects ? JSON.parse(projects) : null;
  }
}
