import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[appRow]',
  host: {
    '[class.app-row]': 'true',
    '[class.app-row-flex]': 'flex',
  },
})
export class RowDirective {
  @Input() flex = false;
}
