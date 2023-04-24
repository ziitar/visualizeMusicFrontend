import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-async-click',
  templateUrl: './async-click.component.html',
  styleUrls: ['./async-click.component.less'],
})
export class AsyncClickComponent<T extends Record<string, any>> {
  constructor() {}
  loading = false;
  @Input() handleClick: ((e: MouseEvent, param?: T) => Subscription | void) | undefined;
  @Input() inline = false;
  @Input() param: T | undefined;

  onClick(e: MouseEvent) {
    if (this.handleClick) {
      this.loading = true;
      const result = this.handleClick(e, this.param);
      if (result) {
        result.add(() => {
          this.loading = false;
        });
      } else {
        this.loading = false;
      }
    }
  }
}
