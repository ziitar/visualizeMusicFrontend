import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IFormat, Tags } from 'src/electronAPI';
import { ColumnsType } from '../components/table/table.component';
import { SearchSongType, SongService } from '../utils/services/song.service';
import { isFalseValue, isTrulyValue, msToTime } from 'src/utils/utils';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NotificationService } from '../utils/services/notification.service';
import { from, forkJoin, pipe, catchError, of } from 'rxjs';

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.less'],
})
export class MusicComponent implements OnInit {
  library: string[] = [];
  root = '';
  activeFile: undefined | string;
  oldOrNew = 'old';
  fileID3: undefined | Tags;
  oldFileID3: undefined | Tags;
  oldImgUrl: undefined | SafeUrl;
  oldFileFormat: (Omit<IFormat, 'duration'> & { duration?: string }) | undefined;
  fileDuration = '-';
  imgUrl: undefined | SafeUrl;
  searchName: undefined | string;
  columns: ColumnsType<SearchSongType>[] = [
    {
      title: '操作',
      key: 'operation',
      temp: true,
      width: 40,
    },
    {
      key: 'name',
      title: '歌名',
    },
    {
      key: 'artists',
      title: '作者',
      render: (data) => {
        return data.artists.map((item) => item.name).join();
      },
    },
    {
      title: '专辑',
      key: 'album',
      render: (data) => {
        return data.album.name;
      },
    },
  ];
  songs: SearchSongType[] = [];
  tableSelectId: undefined | number;
  total = 0;
  pageNo = 1;
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
    const { common: fileID3, format } = await window.electronAPI.invokeReadID3(this.root, file);
    if (fileID3) {
      if (fileID3.title) {
        this.searchName = `${fileID3.title} ${fileID3.artist || ''} ${fileID3.album || ''}`.trim();
      } else {
        this.searchName = file.replace(/(.+)\.[a-z0-9]+$/, '$1');
      }
      this.handleSearch();
      this.oldFileID3 = fileID3;
      this.oldFileFormat = {
        ...format,
        duration: format.duration ? msToTime(format.duration * 1000) : '',
      };
      if (fileID3.image) {
        if (typeof fileID3.image === 'string') {
          this.oldImgUrl = fileID3.image;
        } else {
          this.oldImgUrl = this.sanitizer.bypassSecurityTrustUrl(
            URL.createObjectURL(
              new Blob([fileID3.image.imageBuffer], { type: fileID3.image.mime }),
            ),
          );
        }
      }
    } else {
      this.searchName = file.replace(/(.+)\.[a-z0-9]+$/, '$1');
      this.handleSearch();
    }
    this.changeDetectorRef.detectChanges();
  }
  setID3(
    result: SearchSongType & Pick<Tags, 'track' | 'date' | 'albumartist' | 'label' | 'label'>,
    picUrl?: string,
  ) {
    const year = `${new Date(result.album.publishTime).getFullYear()}`;
    const tags: Tags = {
      title: result.name,
      artist: result.artists.map((item) => item.name).join('/'),
      artists: result.artists.map((item) => item.name),
      albumartist: result.albumartist,
      album: result.album.name,
      year: Number(year),
      track: result.track,
      date: result.date,
      label: result.label,
      comment: [`网易云音乐ID: ${result.id}`],
    };
    if (picUrl) {
      tags.image = picUrl;
    }
    if (result.duration) {
      this.fileDuration = msToTime(result.duration);
    }
    this.fileID3 = tags;
    this.oldOrNew = 'new';
    this.changeDetectorRef.detectChanges();
  }
  getMsg = (event: MouseEvent, data?: SearchSongType) => {
    if (data) {
      return forkJoin([
        this.songService.getSongMsg(data.id),
        this.songService.getAlbum(data.album.id).pipe(catchError(() => of(undefined))),
      ]).subscribe(([res, albumRes]) => {
        console.log(res, albumRes);
        if (res.code === 200 && res.result) {
          this.tableSelectId = data.id;
          const picUrl = `${res.result.picUrl}?param=500y500`;
          this.imgUrl = picUrl;
          const extendsData: Pick<Tags, 'track' | 'date' | 'albumartist' | 'label'> &
            Partial<Pick<SearchSongType, 'album'>> = {};
          if (albumRes && albumRes.code === 200) {
            if (albumRes.album.company) extendsData.label = [albumRes.album.company];
            if (!isFalseValue(albumRes.album.publishTime)) {
              extendsData.date = new Date(albumRes.album.publishTime)
                .toLocaleDateString()
                .replace(/\//g, '-');
            }
            if (albumRes.songs && albumRes.songs.length) {
              extendsData.track = {
                of: albumRes.songs.length,
                no: albumRes.songs.findIndex((item) => item.id === data.id) + 1,
              };
            }
            extendsData.albumartist = albumRes.album.artists.map((item) => item.name).join('/');
          } else {
            extendsData.albumartist = data.artists.map((item) => item.name).join('/');
            extendsData.track = { of: 1, no: 1 };
            extendsData.album = {
              name: data.name,
              id: 0,
              publishTime: new Date().getTime(),
            };
          }
          this.setID3({ ...data, ...extendsData }, picUrl);
        } else {
          this.setID3(data);
        }
      });
    }
    return;
  };
  setTags = () => {
    const run = async () => {
      if (this.fileID3 && this.activeFile) {
        const margeTags = {
          ...this.oldFileID3,
          ...this.fileID3,
        };
        const result = await window.electronAPI.invokeSetID3(this.root, this.activeFile, margeTags);
        return result;
      }
      return;
    };
    return from(run()).subscribe((result) => {
      if (result) {
        this.notification.success({
          title: 'success',
          message: '修改成功',
        });
      } else {
        this.notification.error({
          title: 'error',
          message: '修改失败',
        });
      }
    });
  };
  resetVar() {
    this.activeFile = undefined;
    this.oldFileID3 = undefined;
    this.oldFileFormat = undefined;
    this.fileDuration = '-';
    this.fileID3 = undefined;
    this.oldImgUrl = undefined;
    this.imgUrl = undefined;
    this.oldOrNew = 'old';
    this.searchName = undefined;
    this.songs = [];
    this.tableSelectId = undefined;
    this.pageNo = 1;
    this.total = 0;
  }
  handleResearch(event: KeyboardEvent) {
    if (event.key === 'Enter' && isTrulyValue(this.searchName)) {
      this.pageNo = 1;
      this.handleSearch();
    }
  }
  handleSearch() {
    const search = encodeURIComponent(this.searchName || '');
    this.songService.getSearchSong(search, this.pageNo, 10).subscribe((data) => {
      if (data.code) {
        this.songs = data.result?.songs || [];
        this.total = data.result?.songCount || 0;
        this.changeDetectorRef.detectChanges();
      }
    });
  }
  handlePageChange(pageNo: number) {
    this.pageNo = pageNo;
    this.handleSearch();
    this.changeDetectorRef.detectChanges();
  }
}
