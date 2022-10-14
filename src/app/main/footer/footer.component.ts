import { Component, OnInit, ElementRef } from '@angular/core';
import { AnalyserService } from 'src/app/utils/services/analyser.service';
import AudioContent from 'src/utils/audioContext';

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
    this.audioContext = new AudioContent(64);
  }

  ngOnInit(): void {
    this.audio = this.el.nativeElement.querySelector('#audio') as HTMLAudioElement;
    this.audioContext.connectSource(this.audio);
  }

  handlePlay() {
    this.shouldAnalyser = true;
    this.animateExec();
  }

  handlePause() {
    this.shouldAnalyser = false;
  }

  animateExec() {
    const step = () => {
      const data = this.audioContext.getAnalyserData();
      if (data) {
        this.analyser.sendData(data);
      }
      if (this.shouldAnalyser) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }
}
