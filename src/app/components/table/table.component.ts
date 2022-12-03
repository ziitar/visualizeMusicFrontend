import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { isTrulyValue } from 'src/utils/utils';

export interface ColumnsType<T extends Record<string, any>> {
  key: number | string;
  render?: (data: T, key: ColumnsType<T>['key'], index: number) => string;
  temp?: boolean;
  width?: number;
  align?: 'center' | 'left' | 'right';
  title: string;
}

type ScrollType = Partial<Record<'x' | 'y', 'auto' | boolean | number>>;

function isScrollType(value: object): value is ScrollType {
  if (isTrulyValue((value as ScrollType).x) || isTrulyValue((value as ScrollType).y)) {
    return true;
  }
  return false;
}
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.less'],
})
export class TableComponent<T extends Record<string, any>> implements OnInit {
  @Input() data: T[] = [];
  @Input() columns: ColumnsType<T>[] = [];
  @Input() borderd = false;
  @Input() columnTemp:
    | Record<string, TemplateRef<{ data: T; key: ColumnsType<T>['key']; index: number }>>
    | undefined;
  @Input() small = false;
  @Input()
  set scroll(value: boolean | ScrollType) {
    if (typeof value === 'boolean') {
      this._scroll_x = value;
      this._scroll_y = value;
    } else if (isScrollType(value)) {
      if (typeof value.x === 'number') {
        this._scroll_x_num = value.x;
        this._scroll_x = true;
      } else {
        this._scroll_x = !!value.x;
      }
      if (typeof value.y === 'number') {
        this._scroll_y = true;
        this._scroll_y_num = value.y;
      } else {
        this._scroll_y = !!value.y;
      }
    } else {
      this._scroll_x = false;
      this._scroll_y = false;
    }
  }

  _scroll_x = false;
  _scroll_y = false;
  _scroll_x_num = 0;
  _scroll_y_num = 0;

  constructor() {}

  ngOnInit(): void {}
}
