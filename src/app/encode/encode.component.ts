import { ChangeDetectorRef, Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationService } from '../utils/services/notification.service';
import { CUEType } from 'src/electronAPI';
import { t2s } from '../../utils/chinese-s2t/index';
import { from, catchError } from 'rxjs';

@Component({
  selector: 'app-encode',
  templateUrl: './encode.component.html',
  styleUrls: ['./encode.component.less'],
})
export class EncodeComponent {
  root = '';
  library: string[] = [];
  activeFile: string | undefined;
  activeCode: string | undefined;
  codes: CUEType['analyse'] = [];
  content = '';
  sourceBuffer: Uint8Array | undefined;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private notification: NotificationService,
  ) {
    window.electronAPI?.handleDirectory((event, root, files) => {
      if (files) {
        this.root = root;
        this.library = files;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  handleTranslate() {
    if (this.content) {
      this.content = t2s(this.content);
    }
  }

  handleSet = () => {
    if (this.content && this.activeFile) {
      const textEncode = new TextEncoder();
      const content = textEncode.encode(this.content);
      return from(window.electronAPI.invokeSetCue(this.root, this.activeFile, content))
        .pipe(
          catchError((error) => {
            this.notification.error({
              title: '写入失败',
              message: '',
            });
            console.error(error);
            throw error;
          }),
        )
        .subscribe(() => {
          this.notification.success({
            title: '写入成功',
            message: '',
          });
        });
    }
    return;
  };

  async handleActive(file: string) {
    const { analyse, buffer } = await window.electronAPI.invokeReadCue(this.root, file);
    this.activeFile = file;
    this.codes = analyse;
    this.activeCode = analyse[0].name;
    const textDecode = new TextDecoder(this.activeCode);
    this.content = textDecode.decode(buffer);
    this.sourceBuffer = buffer;
    this.changeDetectorRef.detectChanges();
  }

  selectCode(code: string) {
    this.activeCode = code;
    const decode = new TextDecoder(code);
    this.content = decode.decode(this.sourceBuffer);
    this.changeDetectorRef.detectChanges();
  }
}
