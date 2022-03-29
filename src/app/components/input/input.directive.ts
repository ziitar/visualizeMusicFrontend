import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[appInput]',
  host: {
    '[class.app-input]': 'true',
    '[class.app-input-disabled]': 'disabled',
    '[class.app-input-loading]': 'loading',
    '[disabled]': 'disabled',
  },
})
export class InputDirective {
  @Input() disabled = false;
  @Input() loading: boolean | undefined;
  constructor() {}
}
