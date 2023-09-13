import { getTextY } from '../../helpers';

export class Postcard {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d', {
      willReadFrequently: true,
    });

    this.canvas.width = 600;
    this.canvas.height = 900;

    this.fontSize = 24;
    this.lineHeight = this.fontSize * 1.2;
    this.textHeight = this.lineHeight;
    this.maxTextWidth = this.canvas.width * 0.7;

    this.textX = this.canvas.width / 2;
    this.textY = this.canvas.height / 2;
  }

  drawImage(img) {
    this.ctx.drawImage(img, 0, 0);
  }

  download() {
    const canvasUrl = this.canvas.toDataURL('image/jpeg');
    const createEl = document.createElement('a');
    createEl.href = canvasUrl;
    createEl.download = '';
    createEl.click();
  }

  destroy() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx = null;
  }

  setColor(color) {
    this.ctx.fillStyle = color;
  }

  wrapText(text, typeText, isLiveTyping) {
    this.textY = getTextY(typeText, this.canvas.height);
    // canvas settings
    if (isLiveTyping) {
      this.ctx.clearRect(0, this.textY - this.lineHeight / 2, this.canvas.width, this.textHeight);
    }

    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.font = this.fontSize + 'px Playfair Display';

    // break multiline text
    let linesArray = [];
    let words = text.split(' ');
    let lineCounter = 0;
    let line = '';

    for (let i = 0; i < words.length; i++) {
      let textLine = line + words[i] + ' ';
      if (this.ctx.measureText(textLine).width > this.maxTextWidth) {
        line = words[i] + ' ';
        lineCounter++;
      } else {
        line = textLine;
      }

      linesArray[lineCounter] = line;
    }

    this.textHeight = lineCounter > 0 ? this.lineHeight * (lineCounter + 1) : this.textHeight;

    linesArray.forEach((el, index) => {
      this.ctx.fillText(el, this.textX, this.textY + index * this.lineHeight);
    });
  }
}
