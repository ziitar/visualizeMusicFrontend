import { UserService } from './user/user.service';
import { Component, OnInit } from '@angular/core';
import { BackgroundService } from './utils/services/background.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  title = 'visualizeMusicFrontend';
  bgUrl: string | undefined;
  constructor(private backgroundService: BackgroundService, private userHttp: UserService) {
    this.backgroundService.backgroundUrlObservable.subscribe((url) => {
      this.bgUrl = `url(${url})`;
    });
  }

  ngOnInit(): void {
    this.userHttp.getLogin();
  }
}
