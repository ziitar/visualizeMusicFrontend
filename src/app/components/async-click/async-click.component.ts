import { Component, Input, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-async-click',
  templateUrl: './async-click.component.html',
  styleUrls: ['./async-click.component.less'],
})
export class AsyncClickComponent {
  constructor(private el: ElementRef<HTMLElement>) {
    this.el.nativeElement.addEventListener('click', (e) => {
      this.onClick(e);
    });
  }
  loading = false;
  @Input() handleClick:
    | ((e: MouseEvent, param?: Record<string, any>) => Subscription | void)
    | undefined;
  @Input() inline = false;
  @Input() param: Record<string, any> | undefined;

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
