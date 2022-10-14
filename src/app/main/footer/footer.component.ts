import { AnalysisData } from './../../utils/services/analyser.service';
import { Component, OnInit, ElementRef } from '@angular/core';
import { AnalyserService } from 'src/app/utils/services/analyser.service';
import AudioContent from 'src/utils/audioContext';

type AnalysisFlag = Partial<Record<keyof AnalysisData, boolean>>;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less'],
})
export class FooterComponent implements OnInit {
  audio: HTMLAudioElement | undefined;
  audioContext: AudioContent;
  shouldAnalyser = false;
  constructor(private el: ElementRef<HTMLElement>, private analyser: AnalyserService) {
    this.audioContext = new AudioContent(512);
  }

  ngOnInit(): void {
    this.audio = this.el.nativeElement.querySelector('#audio') as HTMLAudioElement;
    this.audioContext.connectSource(this.audio);
  }

  handlePlay() {
    this.shouldAnalyser = true;
    console.log('play');
    this.animateExec({ frequency: true });
  }

  handlePause() {
    this.shouldAnalyser = false;
  }

  animateExec(analysisFlag: AnalysisFlag) {
    const step = () => {
      let data, data1, data2, data3;
      if (analysisFlag.frequency) {
        data = this.audioContext.getAnalyserData();
      }
      if (analysisFlag.timeDomain) {
        data1 = this.audioContext.getAnalyserDomainData();
      }
      if (analysisFlag.floatFrequency) {
        data2 = this.audioContext.getFloatAnalyserData();
      }
      if (analysisFlag.floatTimeDomain) {
        data3 = this.audioContext.getFloatAnalyserDomainData();
      }
      this.analyser.sendData({
        frequency: data,
        timeDomain: data1,
        floatFrequency: data2,
        floatTimeDomain: data3,
      });
      if (this.shouldAnalyser) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }
}
