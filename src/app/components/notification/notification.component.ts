import { NotificationConfig, NotificationService } from './../../utils/notification.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.less'],
})
export class NotificationComponent {
  title = '';
  message = '';
  status: NotificationConfig['status'] = 'info';
  show = false;

  constructor(private notification: NotificationService) {
    notification.observableNotification.subscribe((observer) => {
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
}
