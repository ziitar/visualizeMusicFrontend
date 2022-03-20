import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BackgroundService {
  private subject = new Subject<string>();
  backgroundUrlObservable = this.subject.asObservable();

  setUrl(url: string) {
    this.subject.next(url);
  }
}
