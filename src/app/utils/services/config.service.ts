import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type BitRate = '128k' | '320k' | '1';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private bitrateSubject = new Subject<BitRate>();
  bitrateObserver = this.bitrateSubject.asObservable();
  bitrate: BitRate = '1';
  setBitrate(bitrate: BitRate) {
    this.bitrate = bitrate;
    this.bitrateSubject.next(this.bitrate);
  }
}
