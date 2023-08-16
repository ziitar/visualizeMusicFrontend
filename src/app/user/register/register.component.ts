import { UserService } from './../user.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MD5 } from 'crypto-js';
import { passwordReg } from 'src/utils/utils';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less'],
})
export class RegisterComponent implements OnInit {
  username: FormControl = new FormControl(null, [
    Validators.required,
    (control) => {
      if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]*$/.test(control.value as string)) {
        return { 'custom-reg': '请输入数字中英文或_' };
      }
      return null;
    },
  ]);
  password = new FormControl(null, [Validators.required, Validators.pattern(passwordReg)]);
  email = new FormControl(null, [Validators.pattern('^[\\w]+@[\\da-zA-Z.]+\\.[a-zA-Z]+$')]);
  repassword = new FormControl(null, [Validators.required, Validators.pattern(passwordReg)]);
  form: FormGroup = new FormGroup(
    {
      username: this.username,
      password: this.password,
      email: this.email,
      repassword: this.repassword,
    },
    {
      validators: (controls) => {
        const password = controls.get('password');
        const repassword = controls.get('repassword');
        if (password?.status === 'VALID' && repassword?.status === 'VALID') {
          if (password.value == repassword.value) {
            return null;
          }
          repassword.setErrors({ 'custom-password': '两次输入密码不一致,请修改' });
          return { 'custom-password': '两次输入密码不一致,请修改' };
        }
        return null;
      },
    },
  );

  constructor(private user: UserService) {}

  ngOnInit(): void {}

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
      return this.user.register({
        username: this.username.value as string,
        password: MD5(this.password.value as string).toString(),
        email: this.email.value as string,
      });
    }
    return;
  };
}
