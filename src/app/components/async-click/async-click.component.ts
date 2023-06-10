import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-async-click',
  templateUrl: './async-click.component.html',
  styleUrls: ['./async-click.component.less'],
})
export class AsyncClickComponent<T extends Record<string, any>> {
  constructor(private changeDetectorRef: ChangeDetectorRef) {}
  loading = false;
  @Input() handleClick: ((e: MouseEvent, param?: T) => Subscription | void) | undefined;
  @Input() inline = false;
  @Input() param: T | undefined;

  onClick(e: MouseEvent) {
    if (this.handleClick) {
      this.loading = true;
      this.changeDetectorRef.detectChanges();
      const result = this.handleClick(e, this.param);
      if (result) {
        result.add(() => {
          this.loading = false;
          this.changeDetectorRef.detectChanges();
        });
      } else {
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      }
    }
  }
}
