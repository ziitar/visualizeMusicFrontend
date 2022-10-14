import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface AnalysisData {
  frequency?: Uint8Array;
  floatFrequency?: Float32Array;
  timeDomain?: Uint8Array;
  floatTimeDomain?: Float32Array;
}

@Injectable({
  providedIn: 'root',
})
export class AnalyserService {
  private subject = new Subject<AnalysisData>();

  analyserObservable = this.subject.asObservable();

  constructor() {}

  sendData(data: AnalysisData) {
    this.subject.next(data);
  }
}
