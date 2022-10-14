import { AnalysisData } from './../app/utils/services/analyser.service';
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

  draw(analysisData: AnalysisData) {
    if (this.ctx) {
      if (analysisData.frequency) {
        this.drawFrequenecy(this.ctx, analysisData.frequency);
      }
      if (analysisData.floatFrequency) {
        this.drawFloatFrequency(this.ctx, analysisData.floatFrequency);
      }
    }
  }

  drawFrequenecy(ctx: CanvasRenderingContext2D, arr: Uint8Array) {
    ctx.clearRect(0, 0, this.width, this.height);
    const padding = 20;
    const splitArea = Math.floor((this.width - padding * 2) / arr.byteLength);
    ctx.lineWidth = splitArea - 2;
    ctx.lineCap = 'round';
    const bottom = this.height - 300;
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    let num = 0;
    ctx.moveTo(padding, bottom);
    ctx.lineTo(this.width - padding, bottom);
    for (const i of arr) {
      ctx.moveTo(padding + num * splitArea, bottom);
      ctx.lineTo(padding + num * splitArea, bottom - i);
      num++;
    }
    ctx.stroke();
  }

  drawFloatFrequency(ctx: CanvasRenderingContext2D, arr: Float32Array) {
    ctx.clearRect(0, 0, this.width, this.height);
    const barWidth = (this.width / arr.byteLength) * 2.5;
    let posX = 0;
    for (let i = 0; i < arr.byteLength; i++) {
      const barHeight = (arr[i] + 140) * 2;
      ctx.fillStyle = `rgb(${Math.floor(barHeight + 100)}, 50, 50)`;
      ctx.fillRect(posX, this.height - barHeight / 2, barWidth, barHeight / 2);
      posX += barWidth + 1;
    }
  }
}
