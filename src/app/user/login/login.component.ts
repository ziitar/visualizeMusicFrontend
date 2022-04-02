import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent implements OnInit {
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

  constructor() {}

  ngOnInit(): void {}

  submit() {
    console.log('run');
    console.log(this.form.value, this.form);
  }
}
