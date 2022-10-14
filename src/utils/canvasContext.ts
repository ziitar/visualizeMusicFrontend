export default class CanvasContent {
  private canvas;
  private ctx;
  private width;
  private height;

  constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    this.width = width;
    this.height = height;
  }

  reset(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
  }

  draw(arr: Uint8Array) {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      const padding = 20;
      const splitArea = Math.floor((this.width - padding * 2) / arr.byteLength);
      this.ctx.lineWidth = splitArea - 2;
      this.ctx.lineCap = 'round';
      const bottom = this.height - 300;
      this.ctx.strokeStyle = '#000';
      this.ctx.beginPath();
      let num = 0;
      for (const i of arr) {
        this.ctx.moveTo(padding + num * splitArea, bottom);
        this.ctx.lineTo(padding + num * splitArea, bottom - 5 - i);
        num++;
      }
      this.ctx.stroke();
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      let num2 = 0;
      this.ctx.moveTo(padding, bottom + 25);
      for (const i of arr) {
        this.ctx.lineTo(padding + num2 * splitArea, bottom + 25 + i);
        num2++;
      }
      this.ctx.stroke();
    }
  }
}
