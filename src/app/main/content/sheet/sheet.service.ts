import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseJSONType } from 'src/app/utils/services/httpResponseJSON';
import { NotificationService } from 'src/app/utils/services/notification.service';

export interface Sheet {
  id: number;
  sheetName: string;
  url?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SheetService {
  sheets: Sheet[] = [];
  constructor(
    private http: HttpClient,
    private router: Router,
    private notification: NotificationService,
  ) {}
  getSheet() {
    return this.http.get<ResponseJSONType<Sheet[]>>('/sheets').subscribe((data) => {
      if (data.code === 200) {
        this.sheets = data.result || [];
      } else {
        this.notification.warning({
          title: '无权限',
          message: data.msg || '',
        });
        this.router.navigate(['user', 'login']);
      }
    });
  }
}
