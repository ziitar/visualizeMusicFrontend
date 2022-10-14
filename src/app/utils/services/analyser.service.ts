import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnalyserService {
  private subject = new Subject<Uint8Array>();

  analyserObservable = this.subject.asObservable();

  constructor() {}

  sendData(data: Uint8Array) {
    this.subject.next(data);
  }
}
