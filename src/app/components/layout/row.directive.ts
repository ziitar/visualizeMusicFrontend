import { Directive, Input, OnInit, ElementRef } from '@angular/core';

@Directive({
  selector: '[appRow]',
  host: {
    '[class.app-row]': 'true',
    '[class.app-row-flex]': 'flex',
    '[class.app-row-flex-nowrap]': 'flexNowrap',
  },
})
export class RowDirective implements OnInit {
  @Input() flex = false;
  @Input() flexNowrap = false;
  @Input() gutter: number | undefined;

  constructor(private el: ElementRef<Element>) {}

  ngOnInit() {
    if (this.gutter) {
      this.el.nativeElement.className += ` app-row-gutter-${this.gutter}`;
    }
  }
}
