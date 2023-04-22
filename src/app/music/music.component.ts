import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Tags } from 'src/electronAPI';
import { ColumnsType } from '../components/table/table.component';
import { SearchSongType, SongService } from '../utils/services/song.service';
import { isTrulyValue } from 'src/utils/utils';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { switchAnimation } from '../utils/animations/switchAnimation';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.less'],
  animations: [switchAnimation],
})
export class MusicComponent implements OnInit {
  library: string[] = [];
  root = '';
  activeFile: undefined | string;
  oldOrNew = new FormControl('old');
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
      width: 120,
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
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private songService: SongService,
    private sanitizer: DomSanitizer,
  ) {
    window.electronAPI?.handleDirectory((event, root, files) => {
      if (files) {
        this.root = root;
        this.library = files;
        event.sender.send('update-files', 1);
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  ngOnInit(): void {}

  async handleActive(file: string) {
    this.activeFile = file;
    this.searchName = file.replace(/(.+)\.[a-z0-9]+$/, '$1');
    this.handleSearch(file);
    const fileID3 = await window.electronAPI?.invokeReadID3(this.root, file);
    if (fileID3) {
      this.fileID3 = fileID3;
      console.log(fileID3);
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
    }
    this.changeDetectorRef.detectChanges();
  }
  getMsg(data: SearchSongType) {
    this.songService.getSongMsg(data.id).subscribe((data) => {
      if (data.code === 200 && data.result) {
        const { name, picUrl, artists } = data.result;
      }
    });
  }
  handleResearch(event: KeyboardEvent) {
    if (event.key === 'Enter' && isTrulyValue(this.searchName)) {
      this.handleSearch(this.searchName!);
    }
  }
  handleSearch(name: string) {
    this.songService.getSearchSong(name, 1, 10).subscribe((data) => {
      if (data.code) {
        this.songs = data.result?.songs || [];

        this.changeDetectorRef.detectChanges();
      }
    });
  }
}
