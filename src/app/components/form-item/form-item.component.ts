import { Subscription } from 'rxjs';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

interface GridType {
  labelCol?: number;
  controlCol?: number;
}
@Component({
  selector: 'app-form-item',
  templateUrl: './form-item.component.html',
  styleUrls: ['./form-item.component.less'],
})
export class FormItemComponent implements OnInit, OnChanges, OnDestroy {
  @Input('key') key!: string;
  @Input('control') formControl: FormControl | FormGroup = new FormControl();
  @Input() label = '';
  @Input() layout: 'vertical' | 'horizontal' = 'horizontal';
  @Input() grid: GridType | undefined;

  errors: string[] | null = [];
  isInvalid = false;
  labelClass = {};
  controlClass = {};
  isRequired = false;

  statusChangesSubscription: Subscription | undefined;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['grid']) {
      const grid: GridType = changes['grid'].currentValue as GridType;
      if (grid.labelCol) {
        this.labelClass = {
          [`app-form-item-label-col-${grid.labelCol}`]: true,
        };
      }
      if (grid.controlCol) {
        this.controlClass = {
          [`app-form-item-control-col-${grid.controlCol}`]: true,
        };
      }
    }
  }

  ngOnInit(): void {
    this.statusChangesSubscription = this.formControl.statusChanges.subscribe((status) => {
      if (status === 'INVALID') {
        this.errors =
          this.formControl.errors &&
          Object.entries(this.formControl.errors)
            .filter(([key, item]) => /^custom-.+$/.test(key) && typeof item === 'string')
            .map(([_, item]) => item as string);
      }
      this.isInvalid =
        this.formControl.invalid && (this.formControl.dirty || this.formControl.touched);
    });
    this.isRequired = this.formControl.hasValidator(Validators.required);
  }

  ngOnDestroy(): void {
    this.statusChangesSubscription?.unsubscribe();
  }
}
