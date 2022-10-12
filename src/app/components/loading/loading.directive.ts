import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[appLoading]',
  host: {
    '[class.app-loading]': 'loading && !inline',
    '[class.app-inline-loading]': 'loading && inline',
  },
})
export class LoadingDirective {
  @Input() loading = false;
  @Input() inline = false;
  constructor() {}
}
