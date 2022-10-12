import { Directive, Input, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appCol]',
  host: {
    '[class.app-col]': 'true',
  },
})
export class ColDirective implements OnInit {
  @Input() xxl = 0;
  @Input() xl = 0;
  @Input() lg = 0;
  @Input() md = 0;
  @Input() sm = 0;
  @Input() xs = 0;
  @Input() span = 0;
  constructor(private el: ElementRef<{ className: string }>) {}

  ngOnInit(): void {
    if (this.xxl > 0) {
      this.el.nativeElement.className += ` app-col-xxl-${this.xxl}`;
    }
    if (this.xl > 0) {
      this.el.nativeElement.className += ` app-col-xl-${this.xl}`;
    }
    if (this.lg > 0) {
      this.el.nativeElement.className += ` app-col-lg-${this.lg}`;
    }
    if (this.md > 0) {
      this.el.nativeElement.className += ` app-col-md-${this.md}`;
    }
    if (this.sm > 0) {
      this.el.nativeElement.className += ` app-col-sm-${this.sm}`;
    }
    if (this.xs > 0) {
      this.el.nativeElement.className += ` app-col-xs-${this.xs}`;
    }
    if (this.span > 0) {
      this.el.nativeElement.className += ` app-col-span-${this.span}`;
    }
  }
}
