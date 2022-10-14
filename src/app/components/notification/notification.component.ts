import {
  NotificationConfig,
  NotificationService,
} from './../../utils/services/notification.service';
import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.less'],
})
export class NotificationComponent implements OnDestroy {
  title = '';
  message = '';
  status: NotificationConfig['status'] = 'info';
  show = false;
  subscription;

  constructor(private notification: NotificationService) {
    this.subscription = notification.observableNotification.subscribe((observer) => {
      if (observer.show) {
        this.title = observer.title;
        this.message = observer.message;
        this.show = observer.show;
        this.status = observer.status;
      } else {
        this.title = '';
        this.message = '';
        this.status = 'info';
        this.show = false;
      }
    });
  }

  handleClose() {
    this.notification.close();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
