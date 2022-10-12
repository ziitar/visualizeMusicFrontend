import { Component, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.less'],
})
export class ButtonComponent {
  @Input() handleClick: ((e: MouseEvent) => Subscription | void) | undefined;
  @Input() disabled = false;
  @Input() loading = false;

  observabel: Observable<MouseEvent> | undefined;
  localLoading = false;

  onClick(e: MouseEvent) {
    if (this.handleClick && typeof this.handleClick === 'function') {
      this.localLoading = true;
      const result = this.handleClick(e);
      if (result) {
        result.add(() => {
          this.localLoading = false;
        });
      } else {
        this.localLoading = false;
      }
    }
  }
}
