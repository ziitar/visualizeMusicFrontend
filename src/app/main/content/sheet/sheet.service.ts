import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseJSONType } from 'src/app/utils/services/httpResponseJSON';
import { NotificationService } from 'src/app/utils/services/notification.service';
import { delay } from 'rxjs';
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
  constructor(private http: HttpClient, private notification: NotificationService) {}
  getSheet() {
    return this.http.get<ResponseJSONType<Sheet[]>>('/sheets').subscribe((data) => {
      if (data.code === 200) {
        this.sheets = data.result || [];
      }
    });
  }
  deleteSheet(id: string) {
    return this.http
      .delete<ResponseJSONType<boolean>>(`/sheets/${id}`)
      .pipe(delay(4000))
      .subscribe((data) => {
        if (data.code === 200) {
          this.notification.success({
            title: '操作成功',
            message: '歌单已删除',
          });
        }
        this.getSheet();
      });
  }
}
