import { NotificationService } from './../utils/services/notification.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInfo } from './user';
import { ResponseJSONType } from '../utils/services/httpResponseJSON';
import { Router } from '@angular/router';
import { ReplaySubject, map } from 'rxjs';

export interface UserServiceMsg {
  isLogin: boolean;
  user: UserInfo | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private subject = new ReplaySubject<UserServiceMsg>();

  isLoginObservable = this.subject.asObservable();
  isLogin = false;
  user: UserInfo | undefined;
  NMCLogin = false;
  constructor(
    private http: HttpClient,
    private notification: NotificationService,
    private router: Router,
  ) {
    this.isLoginObservable.subscribe((data) => {
      this.isLogin = data.isLogin;
      this.user = data.user;
    });
  }

  getLogin() {
    this.http.get<ResponseJSONType<UserInfo | undefined>>('/user/user').subscribe((data) => {
      if (data.result) {
        this.subject.next({
          user: data.result,
          isLogin: true,
        });
      }
    });
  }

  login(user: { username: string; password: string }) {
    return this.http
      .post<ResponseJSONType<UserInfo | undefined>>('/user/login', user)
      .subscribe((data) => {
        if (data.status === 1) {
          this.subject.next({
            user: data.result,
            isLogin: true,
          });
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
    return this.http
      .post<ResponseJSONType<UserInfo | undefined>>('/user/register', user)
      .subscribe((data) => {
        if (data.status === 1) {
          this.subject.next({
            user: data.result,
            isLogin: true,
          });
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
  loginOut() {
    const userName = this.user?.username || '';
    return this.http.put<ResponseJSONType<undefined>>('/user/loginOut', null).subscribe((data) => {
      if (data.status === 1) {
        this.subject.next({
          user: undefined,
          isLogin: false,
        });
        this.notification.success({
          title: '退出成功',
          message: `拜拜${userName}`,
          duration: 1000,
        });
      } else {
        this.notification.warning({
          message: data.msg || '',
          title: '退出失败',
        });
      }
    });
  }
}
