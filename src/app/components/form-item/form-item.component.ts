import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-item',
  templateUrl: './form-item.component.html',
  styleUrls: ['./form-item.component.less'],
})
export class FormItemComponent implements OnInit {
  @Input('key') key!: string;
  @Input('control') formControl: FormControl = new FormControl();

  errors: string[] | null = [];

  ngOnInit(): void {
    this.formControl.statusChanges.subscribe((status) => {
      if (status === 'INVALID') {
        this.errors =
          this.formControl.errors &&
          Object.entries(this.formControl.errors)
            .filter(([key, item]) => /^custom-.+$/.test(key) && typeof item === 'string')
            .map(([_, item]) => item as string);
      }
    });
  }
}
