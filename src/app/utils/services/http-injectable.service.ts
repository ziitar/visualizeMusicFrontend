import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NotificationService } from './notification.service';
import { ResponseJSONType } from './httpResponseJSON';
import { environment } from 'src/environments/environment';

@Injectable()
export class HttpInjectable implements HttpInterceptor {
  constructor(private notification: NotificationService) {}

  intercept<T = any, R = any>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<R>> {
    const cloneReq = req.clone({
      url: `${environment.service}${req.url}`,
      withCredentials: true,
    });
    return next.handle(cloneReq).pipe(
      map((event) => this.handleMapResponseBody(event, req.responseType)),
      catchError((err: HttpErrorResponse, caugth) => {
        console.log(err, caugth);
        let title = '接口请求报错',
          property: 'error' | 'warning' = 'error',
          msg = '';
        const error = err.error as ResponseJSONType<any> | undefined;
        if (error) {
          if (error.code >= 300 && error.code < 400) {
            title = '重定向';
            property = 'warning';
          } else if (error.code >= 400 && error.code < 500) {
            title = '客户端异常';
            msg = error.msg || '请求接口或参数异常';
          } else {
            title = '服务端异常';
            switch (error.code) {
              case 500:
                msg = error.msg || '服务器或数据库异常';
                break;
              default:
                msg = '服务器或数据库异常';
            }
          }
          this.notification[property]({
            title,
            message: msg || '',
          });
        }
        throw err;
      }),
    );
  }

  private handleMapResponseBody(
    event: HttpEvent<any>,
    responseType: HttpRequest<any>['responseType'],
  ) {
    if (event instanceof HttpResponse) {
      if (event.ok) {
        switch (responseType) {
          case 'arraybuffer':
          case 'blob':
          case 'text':
            return event;
          case 'json':
          default: {
            const body = event.body as ResponseJSONType;
            if (body.code >= 200 && body.code < 300) {
              return event.clone({ body });
            } else {
              let title = '接口请求报错',
                property: 'error' | 'warning' = 'error';
              if (body.code >= 300 && body.code < 400) {
                title = '重定向';
                property = 'warning';
              } else if (body.code >= 400 && body.code < 500) {
                title = '客户端异常';
              } else {
                title = '服务端异常';
              }
              this.notification[property]({
                title,
                message: body.msg || '',
              });
              return event.clone({ body: undefined });
            }
          }
        }
      }
    }
    return event;
  }
}
