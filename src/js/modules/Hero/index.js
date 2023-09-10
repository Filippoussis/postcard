import { Hero } from './modules/Hero';

const initHero = () => {
  const hero = new Hero();
  hero.init();
  hero.animate();
};

export { initHero };
