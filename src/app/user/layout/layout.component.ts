import { animate, keyframes, state, style, transition } from '@angular/animations';
import { trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { switchAnimation } from 'src/app/utils/animations/switchAnimation';

const leftStateStyle = style({
  left: 0,
  'border-left-width': 0,
  'border-right-width': '20px',
});

const rightStateStyle = style({
  left: 'calc(100% - 189px)',
  'border-left-width': '20px',
  'border-right-width': 0,
});
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less'],
  animations: [
    switchAnimation,
    trigger('switchTitle', [
      state('left', leftStateStyle),
      state('right', rightStateStyle),
      transition('left => right', [
        animate(
          '200ms ease-out',
          keyframes([
            leftStateStyle,
            style({
              left: '169px',
              'border-left-width': 0,
              'border-right-width': 0,
            }),
            rightStateStyle,
          ]),
        ),
      ]),
      transition('right => left', [
        animate(
          '200ms ease-out',
          keyframes([
            rightStateStyle,
            style({
              left: '169px',
              'border-left-width': 0,
              'border-right-width': 0,
            }),
            leftStateStyle,
          ]),
        ),
      ]),
    ]),
  ],
})
export class LayoutComponent {
  switchRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animateName'] as string;
  }
}
