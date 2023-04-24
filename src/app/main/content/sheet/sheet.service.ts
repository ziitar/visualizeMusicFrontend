import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseJSONType } from 'src/app/utils/services/httpResponseJSON';
import { NotificationService } from 'src/app/utils/services/notification.service';
import { delay, map } from 'rxjs';
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
    return this.http.delete<ResponseJSONType<boolean>>(`/sheets/${id}`);
  }
  createSheet(name: string) {
    return this.http
      .post<ResponseJSONType<boolean>>('/sheets', JSON.stringify({ name: name }))
      .pipe(
        map((data) => {
          if (data.result) {
            this.notification.success({
              title: `成功`,
              message: `${name}创建成功`,
            });
          }
          return data;
        }),
      );
  }
}
