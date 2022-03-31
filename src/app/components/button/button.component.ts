import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.less'],
})
export class ButtonComponent implements OnInit {
  @Input() handleClick: ((e: MouseEvent) => Promise<any> | Observable<any> | void) | undefined;
  @Input() disabled = false;
  @Input() loading = false;

  localLoading = false;

  constructor() {}

  ngOnInit(): void {}
}
