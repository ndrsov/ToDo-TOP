import { DOM } from './dom';
import { ProjectManager } from './projectmanager';
import './styles.css';

document.addEventListener('DOMContentLoaded', () => {
  const projectManager = new ProjectManager();
  const dom = new DOM(projectManager);

  projectManager.loadFromStorage();

  dom.init();
});
