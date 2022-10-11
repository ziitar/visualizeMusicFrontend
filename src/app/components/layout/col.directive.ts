import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCol]',
  host: {
    '[class.app-col]': 'true',
  },
})
export class ColDirective {
  @Input() xxl = 0;
  @Input() xl = 0;
  @Input() lg = 0;
  @Input() md = 0;
  @Input() sm = 0;
  @Input() xs = 0;
  @Input() span = 0;
  constructor(private el: ElementRef<{ className: string }>) {
    if (this.xxl > 0) {
      this.el.nativeElement.className += ` app-col-xxl-${this.xxl}`;
    }
    if (this.xl > 0) {
      this.el.nativeElement.className += ` app-col-xl-${this.xxl}`;
    }
    if (this.lg > 0) {
      this.el.nativeElement.className += ` app-col-lg-${this.xxl}`;
    }
    if (this.md > 0) {
      this.el.nativeElement.className += ` app-col-md-${this.xxl}`;
    }
    if (this.sm > 0) {
      this.el.nativeElement.className += ` app-col-sm-${this.xxl}`;
    }
    if (this.xs > 0) {
      this.el.nativeElement.className += ` app-col-xs-${this.xxl}`;
    }
    if (this.span > 0) {
      this.el.nativeElement.className += ` app-col-span-${this.xxl}`;
    }
  }
}
