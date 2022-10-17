import { UserService } from './../user.service';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MD5 } from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent {
  username: FormControl = new FormControl(null, [
    Validators.required,
    (control) => {
      if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]*$/.test(control.value as string)) {
        return { 'custom-reg': '请输入数字中英文或_' };
      }
      return null;
    },
  ]);
  password = new FormControl(null, [
    Validators.required,
    Validators.pattern('^[\\w_\\-%#@$!*]{6,}$'),
  ]);
  form: FormGroup = new FormGroup({
    username: this.username,
    password: this.password,
  });

  constructor(private user: UserService) {}

  loading = false;

  handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.loading = true;
      const sub = this.submit();
      if (sub) {
        sub.add(() => {
          this.loading = false;
        });
      } else {
        this.loading = false;
      }
    }
  }

  submit = () => {
    if (this.form.valid) {
      return this.user.login({
        username: this.username.value,
        password: MD5(this.password.value).toString(),
      });
    }
    return;
  };
}
