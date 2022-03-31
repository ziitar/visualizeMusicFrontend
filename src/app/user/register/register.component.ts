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
  password = new FormControl('');
  repassword = new FormControl('');
  form: FormGroup = new FormGroup({
    username: this.username,
    password: this.password,
    repassword: this.repassword,
  });

  constructor() {}

  ngOnInit(): void {}

  submit() {
    console.log('run');
    console.log(this.form.value, this.form);
  }
}
