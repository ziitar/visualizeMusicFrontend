import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.less'],
})
export class PaginationComponent implements OnInit {
  @Input()
  get total(): number {
    return this._total || 0;
  }
  set total(value: number) {
    this._total = value;
    this._pageNo = 1;
    this.count = new Array<number>(Math.ceil(value / this._pageSize))
      .fill(1)
      .map((_, index) => index + 1);
    this.range = this.getRange(this._pageNo, this.count);
  }
  @Input()
  get pageSize(): number {
    return this._pageSize || 25;
  }
  set pageSize(value: number) {
    this._pageSize = value;
    if (value) {
      this.count = new Array<number>(Math.ceil(this.total / value))
        .fill(1)
        .map((_, index) => index + 1);
      if (this._pageNo > this.count.length) {
        this._pageNo = 1;
        this.range = this.getRange(this._pageNo, this.count);
      } else {
        this.range = this.getRange(this.pageNo, this.count);
      }
    }
  }
  @Input()
  get pageNo(): number {
    return this._pageNo || 1;
  }
  set pageNo(value) {
    this._pageNo = value;
    this.range = this.getRange(value, this.count);
  }
  @Input() showJump = false;
  @Input() pageSizeList = [10, 25, 50, 100];
  @Output() change = new EventEmitter<Parameters<(pageNo: number, pageSize: number) => void>>();
  @Output() pageNoChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() jump = new EventEmitter<number>();

  _total = 0;
  _pageNo = 1;
  _pageSize = 25;
  count: number[] = [];
  range: number[] = [];
  lContinuity = true;
  rContinuity = true;
  constructor() {}

  ngOnInit(): void {}

  handlePageNoChange(i: number) {
    this.pageNoChange.emit(i);
    this.change.emit([i, this.pageSize]);
  }
  handlePageSizeChange(i: number) {
    this.pageSizeChange.emit(i);
    this.change.emit([this.pageNo, i]);
  }
  private getRange(i: number, count: number[]) {
    const result = count.filter((item) => {
      if (item === 1) {
        return true;
      } else if (item === count.length) {
        return true;
      } else if (i < 4 && item <= 4) {
        return true;
      } else if (i > count.length - 3 && item > count.length - 4) {
        return true;
      } else {
        return item > i - 2 && item <= i + 1;
      }
    });
    this.lContinuity = true;
    this.rContinuity = true;
    result.reduce<number>((prev, current) => {
      if (prev + 1 !== current) {
        if (prev === 1) {
          this.lContinuity = false;
        } else {
          this.rContinuity = false;
        }
      }
      return current;
    }, 0);
    return result;
  }
}
