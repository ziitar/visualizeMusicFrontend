import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.less'],
})
export class ButtonComponent {
  @Input() handleClick: ((e: MouseEvent) => Subscription | void) | undefined;
  @Input() disabled = false;
  @Input()
  set loading(value: undefined | boolean) {
    this.localLoading = !!value || this.localLoading;
  }
  @Output() loadingStatus = new EventEmitter<boolean>();

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  localLoading = false;

  onClick(e: MouseEvent) {
    if (this.handleClick && typeof this.handleClick === 'function') {
      this.localLoading = true;
      this.loadingStatus.emit(true);
      this.changeDetectorRef.detectChanges();
      const result = this.handleClick(e);
      if (result) {
        result.add(() => {
          this.localLoading = false;
          this.loadingStatus.emit(false);
          this.changeDetectorRef.detectChanges();
        });
      } else {
        this.localLoading = false;
        this.loadingStatus.emit(false);
        this.changeDetectorRef.detectChanges();
      }
    }
  }
}
