import { NotificationService } from 'src/app/utils/services/notification.service';
import { Sheet, SheetService } from './sheet.service';
import { UserService } from './../../../user/user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { isTrulyValue } from 'src/utils/utils';

@Component({
  selector: 'app-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.less'],
})
export class SheetComponent implements OnInit, OnDestroy {
  constructor(
    private user: UserService,
    private sheetService: SheetService,
    private notification: NotificationService,
  ) {
    this.subscription = this.user.isLoginObservable.subscribe((data) => {
      this.isLogin = data.isLogin;
      if (this.isLogin) {
        this.userId = data.user?.id;
        this.getSheets();
      }
    });
  }
  userId: number | undefined;
  sheets: Sheet[] = [];
  isLogin = false;
  subscription;
  creating = false;
  isCreating = false;
  sheetsGetting = false;
  sheetName = '';
  ngOnInit(): void {
    this.sheetsGetting = true;
    this.isLogin = this.user.isLogin;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  getSheets() {
    this.sheetsGetting = true;
    this.sheetService.getSheet().add(() => {
      this.sheetsGetting = false;
      this.sheets = this.sheetService.sheets;
    });
  }
  handleDelete = (e: MouseEvent, param?: Record<string, any>) => {
    if (param)
      return this.sheetService.deleteSheet(param['id'] as string).subscribe((data) => {
        if (data.code === 200) {
          this.notification.success({
            title: '操作成功',
            message: '歌单已删除',
          });
          this.getSheets();
        }
      });
    return;
  };
  handleCreate = () => {
    if (isTrulyValue(this.sheetName)) {
      return this.sheetService.createSheet(this.sheetName).subscribe((data) => {
        if (data.result) {
          this.creating = false;
          this.getSheets();
        }
      });
    } else {
      this.notification.error({
        title: '歌单名称错误',
        message: '请输入正确的歌单名',
      });
    }
    return;
  };
}
