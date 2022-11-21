import { UserService } from './user/user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BackgroundService, defaultBG } from './utils/services/background.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'visualizeMusicFrontend';
  bgUrl = `url(${defaultBG})`;
  subscription;
  constructor(private backgroundService: BackgroundService, private userHttp: UserService) {
    this.subscription = this.backgroundService.backgroundUrlObservable.subscribe((url) => {
      this.bgUrl = `url(${url})`;
    });
  }

  ngOnInit(): void {
    this.userHttp.getLogin();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
