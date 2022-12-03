import { WindowResizeService } from './../../../utils/services/window-resize.service';
import { PlaylistService } from './../../../utils/services/playlist.service';
import { ColumnsType } from './../../../components/table/table.component';
import { isTrulyValue } from 'src/utils/utils';
import { SongService, SearchSongType } from './../../../utils/services/song.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less'],
})
export class SearchComponent implements OnInit, OnDestroy {
  searchContent = '';
  total = 0;
  pageNo = 1;
  pageSize = 25;
  result: SearchSongType[] = [];
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
  scrollY = 0;
  _windowResizeSubscription;
  constructor(
    private songService: SongService,
    private playlistService: PlaylistService,
    private windowResize: WindowResizeService,
  ) {
    this._windowResizeSubscription = this.windowResize.resizeObservable.subscribe((data) => {
      const [_, innerHeight] = data;
      this.scrollY = innerHeight - 85 - 80 - 80 - 24 - 54;
    });
  }

  ngOnInit(): void {
    this.scrollY = window.innerHeight - 85 - 80 - 80 - 24 - 54;
  }

  getSongResult() {
    this.songService
      .getSearchSong(this.searchContent, this.pageNo, this.pageSize)
      .subscribe((data) => {
        if (data.code) {
          this.result = data.result?.songs || [];
          this.total = data.result?.songCount || 0;
          this.pageNo = 1;
        }
      });
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && isTrulyValue(this.searchContent)) {
      this.getSongResult();
    }
  }
  handleChange(pageNo: number) {
    this.pageNo = pageNo;
    if (isTrulyValue(this.searchContent)) {
      this.getSongResult();
    }
  }
  handlePlay(data: SearchSongType) {
    this.playlistService.addSong(data);
    this.playlistService.setPlayingId(data.id);
    this.songService.setSong(data);
  }

  ngOnDestroy(): void {
    this._windowResizeSubscription.unsubscribe();
  }
}
