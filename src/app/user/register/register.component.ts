import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  password = new FormControl(null, [
    Validators.required,
    Validators.pattern('^[\\w_\\-%#@$!*]{6,}$'),
  ]);
  repassword = new FormControl(null, [
    Validators.required,
    Validators.pattern('^[\\w_\\-%#@$!*]{6,}$'),
  ]);
  form: FormGroup = new FormGroup(
    {
      username: this.username,
      password: this.password,
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

  constructor() {}

  ngOnInit(): void {}

  submit() {
    console.log('run');
    console.log(this.form.value, this.form);
  }
}
