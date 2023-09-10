import { Effect } from './Effect';

export class Hero {
  constructor() {
    this.canvas = document.getElementById('hero');
    this.ctx = this.canvas.getContext('2d', {
      willReadFrequently: true,
    });
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    this.effect = new Effect(this.ctx, this.canvas.width, this.canvas.height);
    this.effect.wrapText('RooX Amazing Postcard');

    window.addEventListener('mousemove', (evt) => {
      this.effect.mouseMove(evt.x, evt.y);
    });

    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.effect.resize(this.canvas.width, this.canvas.height);
      this.effect.wrapText('RooX Amazing Postcard');
    });
  }

  animate = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.effect.render();
    requestAnimationFrame(this.animate);
  };
}
