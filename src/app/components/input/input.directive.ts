import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[appInput]',
  host: {
    '[class.app-input]': 'true',
    '[class.app-input-disabled]': 'disabled',
    '[disabled]': 'disabled || loading',
  },
})
export class InputDirective {
  @Input() disabled = false;
  @Input() loading: boolean | undefined;
  constructor() {}
}
