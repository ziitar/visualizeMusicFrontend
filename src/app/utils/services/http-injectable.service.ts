import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationService } from './notification.service';
import { ResponseJSONType } from './httpResponseJSON';

@Injectable()
export class httpInjectable implements HttpInterceptor {
  constructor(private notification: NotificationService) {}

  intercept<T = any, R = any>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<R>> {
    return next
      .handle(req)
      .pipe(map((event) => this.handleMapResponseBody(event, req.responseType)));
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
            const body = JSON.parse(event.body as string) as ResponseJSONType;
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
      } else {
        let title = '接口请求报错',
          property: 'error' | 'warning' = 'error',
          msg = '',
          body: ResponseJSONType | undefined = undefined;
        if (event.body && typeof event.body === 'string') {
          body = JSON.parse(event.body) as ResponseJSONType;
        }
        if (event.status >= 300 && event.status < 400) {
          title = '重定向';
          property = 'warning';
        } else if (event.status >= 400 && event.status < 500) {
          title = '客户端异常';
          switch (event.status) {
            case 400:
              msg = body?.msg || '请求接口或参数异常';
              break;
            default:
              msg = '请求接口或参数异常';
          }
        } else {
          title = '服务端异常';
          switch (event.status) {
            case 500:
              msg = body?.msg || '服务器或数据库异常';
              break;
            default:
              msg = '服务器或数据库异常';
          }
        }
        this.notification[property]({
          title,
          message: msg || '',
        });
        return event.clone({ body: undefined });
      }
    } else {
      return event;
    }
  }
}
