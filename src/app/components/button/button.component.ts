import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.less'],
})
export class ButtonComponent implements OnChanges {
  @Input() handleClick: ((e: MouseEvent) => Subscription | void) | undefined;
  @Input() disabled = false;
  @Input() loading = false;

  observabel: Observable<MouseEvent> | undefined;
  localLoading = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['loading']) {
      const loadingChange = changes['loading'];
      this.localLoading = !!loadingChange.currentValue || this.localLoading;
    }
  }

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
