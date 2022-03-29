import { Component } from '@angular/core';
import { BackgroundService } from './utils/services/background.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'visualizeMusicFrontend';
  bgUrl = 'url("//y.qq.com/music/photo_new/T002R300x300M000000VSc1r2y60EW.jpg?max_age=2592000")';
  constructor(private backgroundService: BackgroundService) {
    this.backgroundService.backgroundUrlObservable.subscribe((url) => {
      this.bgUrl = `url(${url})`;
    });
  }
}
