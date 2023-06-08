import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Tags } from 'src/electronAPI';
import { ColumnsType } from '../components/table/table.component';
import { SearchSongType, SongService } from '../utils/services/song.service';
import { isTrulyValue, msToTime } from 'src/utils/utils';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NotificationService } from '../utils/services/notification.service';
import { from } from 'rxjs';

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
    const fileID3 = await window.electronAPI?.invokeReadID3(this.root, file);
    if (fileID3) {
      if (fileID3.title) {
        this.searchName = `${fileID3.title} ${fileID3.artist || ''} ${fileID3.album || ''}`.trim();
      } else {
        this.searchName = file.replace(/(.+)\.[a-z0-9]+$/, '$1');
      }
      this.handleSearch();
      this.oldFileID3 = fileID3;
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
  setID3(result: SearchSongType, picUrl?: string) {
    const year = `${new Date(result.album.publishTime).getFullYear()}`;
    const tags: Tags = {
      title: result.name,
      artist: result.artists.map((item) => item.name).join(','),
      album: result.album.name,
      year: year,
      originalYear: year,
      comment: {
        language: '',
        text: msToTime(result.duration),
      },
    };
    if (picUrl) {
      tags.image = picUrl;
    }
    this.fileID3 = tags;
    this.oldOrNew = 'new';
    this.changeDetectorRef.detectChanges();
  }
  getMsg = (event: MouseEvent, data?: SearchSongType) => {
    if (data) {
      return this.songService.getSongMsg(data.id).subscribe((res) => {
        if (res.code === 200 && res.result) {
          this.tableSelectId = data.id;
          const picUrl = `${res.result.picUrl}?param=500y500`;
          this.imgUrl = picUrl;
          this.setID3(data, picUrl);
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
    this.songService.getSearchSong(this.searchName || '', this.pageNo, 10).subscribe((data) => {
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
  }
}
