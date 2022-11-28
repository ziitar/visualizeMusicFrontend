import { Component, Input, OnInit, TemplateRef } from '@angular/core';

export interface ColumnsType<T extends Record<string, any>> {
  key: number | string;
  render?: (data: T, key: ColumnsType<T>['key'], index: number) => string;
  temp?: boolean;
  width?: number;
  align?: 'center' | 'left' | 'right';
  title: string;
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
  constructor() {}

  ngOnInit(): void {}
}
