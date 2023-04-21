import { PlaylistService, PlayModeType } from './../../utils/services/playlist.service';
import { BackgroundService, defaultBG } from './../../utils/services/background.service';
import { SongService, SongDetailType } from './../../utils/services/song.service';
import { AnalysisData } from './../../utils/services/analyser.service';
import { Component, OnInit, ElementRef, Output, EventEmitter, NgZone } from '@angular/core';
import { AnalyserService } from 'src/app/utils/services/analyser.service';
import AudioContent from 'src/utils/audioContext';
type AnalysisFlag = Partial<Record<keyof AnalysisData, boolean>>;

interface PlayMsgType {
  currentTime: number;
  durationTime: number;
  volume: number;
  progress: number;
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less'],
})
export class FooterComponent implements OnInit {
  audio: HTMLAudioElement | undefined;
  audioContext: AudioContent;
  shouldAnalyser = false;
  defaultBG = defaultBG;
  @Output() switchCanvas = new EventEmitter<void>();
  songMsg: SongDetailType | undefined;
  playMsg: PlayMsgType = {
    currentTime: 0,
    durationTime: 0,
    volume: 50,
    progress: 0,
  };
  playMode: PlayModeType = 1;

  constructor(
    private el: ElementRef<HTMLElement>,
    private analyser: AnalyserService,
    private songService: SongService,
    private backgroundService: BackgroundService,
    private palylistService: PlaylistService,
    private ngZone: NgZone,
  ) {
    this.audioContext = new AudioContent(256);
    this.songService.songMsgObserver.subscribe((data) => {
      if (!this.songMsg || this.songMsg.id === data.id) {
        if (data.imgUrl) {
          this.backgroundService.setUrl(data.imgUrl);
        }
        this.songMsg = {
          ...this.songMsg,
          ...data,
        };
      }
      this.palylistService.mergeMsg(data);
    });
    this.songService.songUrlObserver.subscribe((data) => {
      if (data.url) {
        this.audioContext.changeCtxState();
        this.loadMusic(data.url);
        this.palylistService.mergeMsg(data);
      }
    });
    this.palylistService.playModeObserver.subscribe((data) => {
      this.playMode = data;
    });
  }

  ngOnInit(): void {
    this.audio = this.el.nativeElement.querySelector('#audio') as HTMLAudioElement;
    this.audioContext.connectSource(this.audio);
    if (this.audio) {
      this.audio.addEventListener('loadedmetadata', () => {
        this.playMsg.durationTime = this.audio?.duration || 0;
      });
      this.audio.addEventListener('timeupdate', () => {
        if (this.audio) {
          this.playMsg.currentTime = this.audio.currentTime || 0;
          if (!this.playMsg.durationTime) {
            this.playMsg.durationTime = this.audio.duration;
          }
          this.playMsg.progress = Number(
            ((this.audio.currentTime / (this.audio.duration || 1)) * 100).toFixed(2),
          );
        }
      });
      this.audio.addEventListener('ended', () => {
        this.shouldAnalyser = false;
        this.resetPlayMsg(this.playMsg.volume);
      });
      this.audio.addEventListener('pause', () => {
        this.shouldAnalyser = false;
      });
      this.audio.addEventListener('play', () => {
        this.shouldAnalyser = true;
        this.animateExec({ frequency: true });
      });
    }
  }

  async loadMusic(url: string) {
    if (this.audio) {
      this.audio.src = url;
      this.audio.load();
      this.audio.volume = Number((this.playMsg.volume / 100).toFixed(2));
      await this.audio.play();
      this.handlePlay();
    }
  }

  handlePlay() {
    if (this.songMsg) {
      if (this.audio && this.audio.paused) {
        this.audio.play();
      }
    }
  }

  handlePause() {
    if (this.audio) {
      this.audio.pause();
    }
  }

  handleStop() {
    if (this.audio) {
      this.songMsg = undefined;
      this.audio.pause();
      this.audio.currentTime = 0;
      this.resetPlayMsg(50);
    }
  }

  resetPlayMsg(volume?: number) {
    this.playMsg = {
      currentTime: 0,
      durationTime: 0,
      volume: volume || 0,
      progress: 0,
    };
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
        this.ngZone.runOutsideAngular(() => requestAnimationFrame(step));
      }
    };
    this.ngZone.runOutsideAngular(() => requestAnimationFrame(step));
  }

  handleSwithCanvas() {
    this.switchCanvas.emit();
  }

  handleChangeVolume(event: Event) {
    this.playMsg.volume = Number((event.target as HTMLInputElement).value);
    if (this.audio) this.audio.volume = Number((this.playMsg.volume / 100).toFixed(2));
  }
  handleChangeCurrrentTime(event: Event) {
    if (this.audio && !!this.audio.duration) {
      this.audio.currentTime = Number(
        ((Number((event.target as HTMLInputElement).value) * this.audio.duration) / 100).toFixed(3),
      );
    }
  }

  changePlayMode() {
    this.palylistService.changePlayMode();
  }

  handlePre() {
    this.palylistService.pre();
  }

  handleNext() {
    this.palylistService.next();
  }
}
