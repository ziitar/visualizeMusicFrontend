import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appFormItemContent]',
})
export class FormItemContentDirective {
  constructor(public templateRef: TemplateRef<{ onChange: (value: any, e: Event) => void }>) {}
}
