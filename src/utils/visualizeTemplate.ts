export interface VisulizeTemplateType {
  run: (ctx: CanvasRenderingContext2D, arr: Uint8Array, width: number, height: number) => void;
}
const template: Record<string, VisulizeTemplateType> = {
  default: {
    run: (ctx: CanvasRenderingContext2D, arr: Uint8Array, width: number, height: number) => {
      ctx.clearRect(0, 0, width, height);
      // model2
      ctx.strokeStyle = '#bbdde8';
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 30, 0, Math.PI * 2, true);
      ctx.lineWidth = 2;
      ctx.stroke();
      for (let i = 0; i < arr.length; i++) {
        const R = (arr[i] / 800) * 50;
        if (R != 0) {
          ctx.beginPath();
          ctx.arc(
            width / 2 + i * 2,
            height / 2,
            40,
            Math.PI * (R / 50),
            Math.PI * 2 - Math.PI * (R / 50),
            true,
          );
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(
            width / 2 - i * 2,
            height / 2,
            40,
            Math.PI + Math.PI * (R / 50),
            Math.PI - Math.PI * (R / 50),
            true,
          );
          ctx.stroke();
        }
      }
    },
  },
  line: {
    run: (ctx: CanvasRenderingContext2D, arr: Uint8Array, width: number, height: number) => {
      ctx.clearRect(0, 0, width, height);
      const padding = 20;
      const splitArea = Math.floor((width - padding * 2) / arr.byteLength);
      ctx.lineWidth = splitArea - 2;
      ctx.lineCap = 'round';
      const bottom = height - 300;
      ctx.strokeStyle = '#000';
      ctx.beginPath();
      let num = 0;
      ctx.moveTo(padding, bottom);
      ctx.lineTo(width - padding, bottom);
      for (const i of arr) {
        ctx.moveTo(padding + num * splitArea, bottom);
        ctx.lineTo(padding + num * splitArea, bottom - i);
        num++;
      }
      ctx.stroke();
    },
  },
};

export default template;
