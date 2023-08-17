import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { Tags } from 'src/electronAPI';
import { ColumnsType } from '../components/table/table.component';
import { LocalSongType, SongService } from '../utils/services/song.service';
import { isEmptyObject, isTrulyValue, msToTime } from 'src/utils/utils';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NotificationService } from '../utils/services/notification.service';
import { catchError, from, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
const typeMap = {
  single: '分轨',
  tracks: '整轨',
};

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.less'],
})
export class LibraryComponent implements OnInit {
  library: string[] = [];
  root = '';
  activeFile: undefined | string;
  fileID3: Tags = {};
  fileDuration = '-';
  imgUrl: string | SafeUrl | undefined;
  searchContent = '';
  columns: ColumnsType<LocalSongType>[] = [
    {
      title: '删除',
      key: 'operation',
      temp: true,
      width: 40,
    },
    {
      title: '播放',
      key: 'play',
      temp: true,
      width: 40,
    },
    {
      key: 'title',
      title: '歌名',
    },
    {
      key: 'artist',
      title: '作者',
    },
    {
      title: '专辑',
      key: 'album',
    },
    {
      key: 'duration',
      title: '时长',
    },
    {
      key: 'type',
      title: '类型',
      render: (data) => {
        return typeMap[data.type];
      },
    },
    {
      key: 'nime',
      title: '文件类型',
      render: (data) => {
        return data.url.replace(/.+\.(\w+)$/, '$1');
      },
    },
  ];
  songs: LocalSongType[] = [];
  audioSafeUrl: SafeUrl | undefined;
  #audio: HTMLAudioElement | undefined;
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private songService: SongService,
    private sanitizer: DomSanitizer,
    private notification: NotificationService,
    private el: ElementRef<Element>,
  ) {
    window.electronAPI?.handleDirectory((event, root, files) => {
      if (files) {
        this.root = root;
        this.library = files;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  ngOnInit(): void {
    this.#audio = this.el.nativeElement.querySelector('#audio') as HTMLAudioElement;
  }

  async handleActive(file: string) {
    this.resetVar();
    this.activeFile = file;
    const { common: fileID3, format } = await window.electronAPI.invokeReadID3(this.root, file);
    if (fileID3 && (fileID3.title || fileID3.artist)) {
      this.searchContent = [fileID3.artist || '', fileID3.title].join('-');
      this.handleSearch();
      this.fileID3 = fileID3;
      if (format.duration) this.fileDuration = msToTime(format.duration * 1000);
      if (fileID3.image) {
        if (typeof fileID3.image === 'string') {
          this.imgUrl = fileID3.image;
        } else {
          this.imgUrl = this.sanitizer.bypassSecurityTrustUrl(
            URL.createObjectURL(
              new Blob([fileID3.image.imageBuffer], { type: fileID3.image.mime }),
            ),
          );
        }
      }
    } else {
      this.searchContent = this.activeFile;
      this.handleSearch();
    }
    this.changeDetectorRef.detectChanges();
  }

  deleteCurrentFile = () => {
    if (this.activeFile) {
      const run = async () => {
        await window.electronAPI?.invokeRmFile(this.root, this.activeFile!, true);
      };
      return from(run())
        .pipe(
          catchError((err) => {
            this.notification.error({
              title: '删除失败',
              message: '本地文件删除失败，请手动删除',
            });
            this.changeDetectorRef.detectChanges();
            throw err;
          }),
        )
        .subscribe(() => {
          this.resetVar();
          this.notification.success({
            title: '删除成功',
            message: '本地文件删除成功',
          });
          this.changeDetectorRef.detectChanges();
        });
    }
    return;
  };

  deleteLibraryFile = (_: MouseEvent, item?: LocalSongType) => {
    if (item) {
      const run = async () => {
        await window.electronAPI?.invokeRmFile(item.url, '', false);
      };
      return from(run())
        .pipe(
          catchError((err) => {
            this.notification.error({
              title: '删除失败',
              message: '',
            });
            this.changeDetectorRef.detectChanges();
            throw err;
          }),
        )
        .subscribe(() => {
          this.notification.success({
            title: '删除成功',
            message: '本地文件删除成功',
          });
          this.changeDetectorRef.detectChanges();
          this.songService.deleteLocalSong(item.id).subscribe((data) => {
            if (data.result) {
              this.notification.success({
                title: '删除成功',
                message: '数据库删除成功',
              });
              this.changeDetectorRef.detectChanges();
              this.handleSearch();
            } else {
              this.notification.error({
                title: '删除失败',
                message: '数据库删除失败，请手动删除',
              });
              this.changeDetectorRef.detectChanges();
            }
          });
        });
    }
    return;
  };

  resetVar() {
    this.activeFile = undefined;
    this.fileDuration = '-';
    this.imgUrl = undefined;
    this.songs = [];
  }
  handleResearch(event: KeyboardEvent) {
    if (event.key === 'Enter' && isTrulyValue(this.searchContent)) {
      this.handleSearch();
    }
  }
  handleSearch() {
    const [artist, title] = this.searchContent.split('-');
    this.songService.getSearchLocalSong({ title, artist }, 1, 10).subscribe((data) => {
      if (data.status) {
        this.songs = data.result?.data || [];
        this.changeDetectorRef.detectChanges();
      }
    });
  }
  setAudioSafeUrl(url: string) {
    const encodeUrl = encodeURIComponent(url);
    this.audioSafeUrl = this.sanitizer.bypassSecurityTrustUrl(
      `${environment.service}/assets/proxy/${encodeUrl}`,
    );
    this.changeDetectorRef.detectChanges();
    this.#audio && this.#audio.load();
  }
  async setCurrentUrl() {
    if (this.activeFile && this.root) {
      const url = await window.electronAPI.invokeAbsolutePath(this.root, this.activeFile);
      this.setAudioSafeUrl(url);
    }
  }
}
