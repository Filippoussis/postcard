import { Particle } from './Particle';

export class Effect {
  constructor(context, canvasWidth, canvasHeight) {
    this.context = context;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    // base text
    this.textX = this.canvasWidth / 2;
    this.textY = this.canvasHeight / 2;
    this.fontSize = 160;
    this.lineHeight = this.fontSize * 1.2;
    this.maxTextWidth = this.canvasWidth * 0.8;

    // particle text
    this.particles = [];
    this.gap = 3;
    this.mouse = {
      radius: 20000,
      x: 0,
      y: 0,
    };
  }

  mouseMove(x, y) {
    this.mouse.x = x;
    this.mouse.y = y;
  }

  wrapText(text) {
    // canvas settings
    const gradient = this.context.createLinearGradient(0, 0, this.canvasWidth, this.canvasHeight);
    gradient.addColorStop(0.3, 'red');
    gradient.addColorStop(0.5, 'magenta');
    gradient.addColorStop(0.7, 'yellow');
    this.context.fillStyle = gradient;
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.lineWidth = 3;
    this.context.strokeStyle = 'orange';
    this.context.font = this.fontSize + 'px Bangers';

    // break multiline text
    let linesArray = [];
    let words = text.split(' ');
    let lineCounter = 0;
    let line = '';

    for (let i = 0; i < words.length; i++) {
      let textLine = line + words[i] + ' ';
      if (this.context.measureText(textLine).width > this.maxTextWidth) {
        line = words[i] + ' ';
        lineCounter++;
      } else {
        line = textLine;
      }

      linesArray[lineCounter] = line;
    }

    const textHeight = this.lineHeight * lineCounter;
    this.textY = this.canvasHeight / 2 - textHeight / 2;

    linesArray.forEach((el, index) => {
      this.context.fillText(el, this.textX, this.textY + index * this.lineHeight);
    });

    this.convertToParticle();
  }

  convertToParticle() {
    this.particles = [];
    const pixels = this.context.getImageData(0, 0, this.canvasWidth, this.canvasHeight).data;
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    for (let y = 0; y < this.canvasHeight; y += this.gap) {
      for (let x = 0; x < this.canvasWidth; x += this.gap) {
        const index = (y * this.canvasWidth + x) * 4;
        const alpha = pixels[index + 3];
        if (alpha > 0) {
          const red = pixels[index];
          const green = pixels[index + 1];
          const blue = pixels[index + 2];
          const color = `rgb(${red}, ${green}, ${blue})`;
          this.particles.push(new Particle(this, x, y, color));
        }
      }
    }
  }

  render() {
    this.particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });
  }

  resize(width, height) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.textX = this.canvasWidth / 2;
    this.textY = this.canvasHeight / 2;
    this.maxTextWidth = this.canvasWidth * 0.8;
  }
}
