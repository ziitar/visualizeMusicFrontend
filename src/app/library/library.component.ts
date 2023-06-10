import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Tags } from 'src/electronAPI';
import { ColumnsType } from '../components/table/table.component';
import { LocalSongType, SaveLocalSongType, SongService } from '../utils/services/song.service';
import { isEmptyObject, isTrulyValue } from 'src/utils/utils';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NotificationService } from '../utils/services/notification.service';
import { catchError, from, firstValueFrom } from 'rxjs';

const typeMap = {
  single: '分轨',
  tracks: '正轨',
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
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private songService: SongService,
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

  ngOnInit(): void {}

  async handleActive(file: string) {
    this.resetVar();
    this.activeFile = file;
    const fileID3 = await window.electronAPI?.invokeReadID3(this.root, file);
    if (fileID3 && (fileID3.title || fileID3.artist)) {
      this.searchContent = [fileID3.artist || '', fileID3.title].join('-');
      this.handleSearch();
      this.fileID3 = fileID3;
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

  addCurrentFile = () => {
    const run = async () => {
      if (!isEmptyObject(this.fileID3) && this.activeFile) {
        const data: SaveLocalSongType = {
          title: this.fileID3.title,
          artist: this.fileID3.artist,
          album: this.fileID3.album,
          albumartist: this.fileID3.artist,
          year: this.fileID3.year ? parseInt(this.fileID3.year) : undefined,
          duration: this.fileID3.comment?.text,
          url: await window.electronAPI.invokeAbsolutePath(this.root, this.activeFile),
          type: 'single' as const,
        };
        if (this.fileID3.image) {
          if (typeof this.fileID3.image === 'string') {
            data.picUrl = this.fileID3.image;
          } else {
            data.file = new Blob([this.fileID3.image.imageBuffer], {
              type: this.fileID3.image.mime || 'image/jpeg',
            });
          }
        }
        const res = await firstValueFrom(this.songService.addLocalSong(data));
        return { res, title: data.title };
      }
      return;
    };
    return from(run()).subscribe((res) => {
      if (res && res.res.result) {
        this.notification.success({
          title: '添加成功',
          message: `已将${res.title || ''}添加到数据库`,
        });
      }
      this.changeDetectorRef.detectChanges();
    });
  };

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
    this.songService.getSearchLocalSong(title, artist).subscribe((data) => {
      if (data.code) {
        this.songs = data.result || [];
        this.changeDetectorRef.detectChanges();
      }
    });
  }
}
