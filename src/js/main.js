import { initHero } from './modules/Hero';
import { initModal } from './modules/Modal';

window.addEventListener('DOMContentLoaded', () => {
  // Utils
  // ---------------------------------

  // Modules
  // ---------------------------------
  // все скрипты должны быть в обработчике 'DOMContentLoaded', но не все в 'load'
  // в load следует добавить скрипты, не участвующие в работе первого экрана
  window.addEventListener('load', () => {
    initHero();
    initModal();
  });
});
