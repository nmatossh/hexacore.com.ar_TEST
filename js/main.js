import { setupMenu } from './menu/navigation.js';
import { setupUI } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  setupMenu();
  setupUI();
});
