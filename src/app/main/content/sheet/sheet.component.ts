import { Sheet, SheetService } from './sheet.service';
import { UserService } from './../../../user/user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.less'],
})
export class SheetComponent implements OnInit, OnDestroy {
  constructor(private user: UserService, private sheetService: SheetService) {
    this.subscription = this.user.isLoginObservable.subscribe((data) => {
      this.isLogin = data.isLogin;
    });
  }
  sheets: Sheet[] = [];
  isLogin = false;
  subscription;
  creating = false;
  ngOnInit(): void {
    this.sheetService.getSheet().add(() => {
      this.sheets = this.sheetService.sheets;
    });
    this.isLogin = this.user.isLogin;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  handleDelete = (e: MouseEvent, param?: Record<string, any>) => {
    if (param) return this.sheetService.deleteSheet(param['id'] as string);
    return;
  };
  handleCreate = () => {
    this.creating = true;
  };
  handleCancel() {}
}
