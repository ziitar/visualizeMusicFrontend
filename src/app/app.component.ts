import { Component } from '@angular/core';
import { BackgroundService } from './utils/services/background.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'visualizeMusicFrontend';
  bgUrl: string | undefined;
  constructor(private backgroundService: BackgroundService) {
    this.backgroundService.backgroundUrlObservable.subscribe((url) => {
      this.bgUrl = `url(${url})`;
    });
  }
}
