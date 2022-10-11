import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface NotificationConfig {
  title: string;
  message: string;
  duration?: number;
  status: 'success' | 'info' | 'error' | 'warning';
  show: boolean;
}

type NotificationSubject = (Omit<NotificationConfig, 'show'> & { show: true }) | { show: false };

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private subject = new Subject<NotificationSubject>();

  observableNotification = this.subject.asObservable();

  notif(config: NotificationConfig) {
    if (config.show) {
      setTimeout(() => {
        this.subject.next({ show: false });
      }, config.duration || 4500);
    }
    this.subject.next(config);
  }

  success(config: Omit<NotificationConfig, 'status' | 'show'>) {
    this.notif({
      ...config,
      show: true,
      status: 'success',
    });
  }
  info(config: Omit<NotificationConfig, 'status' | 'show'>) {
    this.notif({
      ...config,
      show: true,
      status: 'info',
    });
  }
  error(config: Omit<NotificationConfig, 'status' | 'show'>) {
    this.notif({
      ...config,
      show: true,
      status: 'error',
    });
  }
  warning(config: Omit<NotificationConfig, 'status' | 'show'>) {
    this.notif({
      ...config,
      show: true,
      status: 'warning',
    });
  }

  close() {
    this.subject.next({ show: false });
  }
}
