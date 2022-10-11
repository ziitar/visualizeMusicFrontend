import { NotificationService } from './../utils/services/notification.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { userInfo } from './user';
import { ResponseJSONType } from '../utils/services/httpResponseJSON';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  isLogin = false;
  NMCLogin = false;
  user: userInfo | undefined;
  constructor(
    private http: HttpClient,
    private notification: NotificationService,
    private router: Router,
  ) {}

  getLogin() {
    this.http.get<ResponseJSONType<userInfo | undefined>>('/user/user').subscribe((data) => {
      if (data) {
        this.user = data.result;
        this.isLogin = true;
      }
    });
  }

  login(user: { username: string; password: string }) {
    this.http
      .post<ResponseJSONType<userInfo | undefined>>('/user/login', user)
      .subscribe((data) => {
        if (data.status === 1) {
          this.user = data.result;
          this.isLogin = true;
          this.notification.success({
            title: '登录成功',
            message: `欢迎${data.result?.username || ''}`,
            duration: 2000,
          });
          this.router.navigate(['/']);
        } else {
          this.notification.warning({
            message: data.msg || '',
            title: '登录失败',
          });
        }
      });
  }

  register(user: { username: string; password: string; email?: string }) {
    this.http
      .post<ResponseJSONType<userInfo | undefined>>('/user/register', user)
      .subscribe((data) => {
        if (data.status === 1) {
          this.user = data.result;
          this.isLogin = true;
          this.notification.success({
            title: '创建成功',
            message: `欢迎${data.result?.username || ''}`,
            duration: 2000,
          });
          this.router.navigate(['/']);
        } else {
          this.notification.warning({
            message: data.msg || '',
            title: '注册失败',
          });
        }
      });
  }
}
