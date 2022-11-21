import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[appShow]',
})
export class ShowDirective {
  @Input() set appShow(value: boolean) {
    if (value) {
      this.el.nativeElement.style.display = 'block';
    } else {
      this.el.nativeElement.style.display = 'none';
    }
  }
  constructor(private el: ElementRef<HTMLElement>) {}
}
