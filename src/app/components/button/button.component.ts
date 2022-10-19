import { Component, Input, OnChanges, Output, SimpleChanges, EventEmitter } from '@angular/core';
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
  @Output() loadingStatus = new EventEmitter<boolean>();

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
      this.loadingStatus.emit(true);
      const result = this.handleClick(e);
      if (result) {
        result.add(() => {
          this.localLoading = false;
          this.loadingStatus.emit(false);
        });
      } else {
        this.localLoading = false;
        this.loadingStatus.emit(false);
      }
    }
  }
}
