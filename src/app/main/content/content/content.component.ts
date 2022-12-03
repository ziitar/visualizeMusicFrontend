import { UserService } from './../../../user/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.less'],
})
export class ContentComponent implements OnInit {
  subscription;
  isLogin = false;
  constructor(private userService: UserService) {
    this.subscription = this.userService.isLoginObservable.subscribe((data) => {
      this.isLogin = data.isLogin;
    });
  }

  ngOnInit(): void {}

  loginOut = (e: MouseEvent) => {
    return this.userService.loginOut();
  };
}
