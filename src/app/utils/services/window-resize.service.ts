import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WindowResizeService {
  private resize$ = new Subject<[number, number]>();
  resizeObservable = this.resize$.asObservable();

  constructor() {
    window.addEventListener('resize', () => {
      this.resize$.next([window.innerWidth, window.innerHeight]);
    });
  }
}
