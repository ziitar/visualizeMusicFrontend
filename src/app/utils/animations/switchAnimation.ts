import { animate, animateChild, query, style, transition, trigger } from '@angular/animations';

export const switchAnimation = trigger('switchAnimation', [
  transition('right => left', [
    style({
      position: 'relative',
      width: '200%',
      right: '100%',
      display: 'flex',
      'flex-direction': 'row-reverse',
    }),
    query(':enter, :leave', [
      style({
        width: '50%',
      }),
    ]),
    query(':enter', [
      style({
        order: 0,
      }),
    ]),
    query(':leave', animateChild()),
    animate('200ms ease-out', style({ right: '0%' })),
    query(':enter', animateChild()),
  ]),
  transition('left => right', [
    style({
      position: 'relative',
      width: '200%',
      left: '0%',
    }),
    query(':enter, :leave', [
      style({
        display: 'inline-block',
        width: '50%',
      }),
    ]),
    query(':leave', animateChild()),
    animate('200ms ease-out', style({ left: '-100%' })),
    query(':enter', animateChild()),
  ]),
]);
