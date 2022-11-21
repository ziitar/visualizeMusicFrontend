import { AnalyserService } from './../../utils/services/analyser.service';
import {
  Component,
  OnInit,
  ElementRef,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import CanvasContent from 'src/utils/canvasContext';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.less'],
})
export class CanvasComponent implements OnInit, OnDestroy {
  ctxInstance: CanvasContent | undefined;
  canvas: HTMLCanvasElement | null = null;
  subscription;

  @Input() set show(value: boolean) {
    if (value && this.ctxInstance && this.canvas) {
      this.ctxInstance.reset(this.canvas.clientWidth, this.canvas.clientHeight);
    }
  }
  @Output() close = new EventEmitter<boolean>();

  constructor(private el: ElementRef<Element>, private analyser: AnalyserService) {
    this.subscription = this.analyser.analyserObservable.subscribe((data) => {
      if (this.ctxInstance) {
        this.ctxInstance.draw(data);
      }
    });
  }

  ngOnInit(): void {
    const canvas = this.el.nativeElement.querySelector('#canvas') as HTMLCanvasElement;
    if (canvas) {
      this.canvas = canvas;
      this.ctxInstance = new CanvasContent(canvas, canvas.clientWidth, canvas.clientHeight);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.canvas = null;
  }

  handleClose() {
    this.close.emit(false);
  }
}
