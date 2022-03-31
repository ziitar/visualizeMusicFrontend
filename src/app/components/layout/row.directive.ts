import { Directive } from '@angular/core';

@Directive({
  selector: '[appRow]',
  host: {
    'class.app-row': 'true',
  },
})
export class RowDirective {
  constructor() {}
}
