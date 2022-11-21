import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export const defaultBG = `${environment.service}/assets/music-head.jpg`;
@Injectable({
  providedIn: 'root',
})
export class BackgroundService {
  private subject = new Subject<string>();
  backgroundUrlObservable = this.subject.asObservable();

  setUrl(url: string) {
    this.subject.next(url);
  }

  setReset() {
    this.subject.next(defaultBG);
  }
}
