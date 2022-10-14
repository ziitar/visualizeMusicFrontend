import { AnalyserService } from './../../utils/services/analyser.service';
import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import CanvasContent from 'src/utils/canvasContext';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.less'],
})
export class CanvasComponent implements OnInit, OnDestroy {
  ctxInstance: CanvasContent | undefined;
  subscription;
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
      this.ctxInstance = new CanvasContent(canvas, canvas.clientWidth, canvas.clientHeight);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
