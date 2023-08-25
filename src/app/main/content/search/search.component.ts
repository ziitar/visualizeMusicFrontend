import { ConfigService } from './../../../utils/services/config.service';
import { WindowResizeService } from './../../../utils/services/window-resize.service';
import { PlaylistService } from './../../../utils/services/playlist.service';
import { ColumnsType } from './../../../components/table/table.component';
import { formatLocalSongMsg, isTrulyValue } from 'src/utils/utils';
import { LocalSongType, SongService } from './../../../utils/services/song.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

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
  result: LocalSongType[] = [];
  columns: ColumnsType<LocalSongType>[] = [
    {
      title: '操作',
      key: 'operation',
      temp: true,
      width: 120,
    },
    {
      key: 'title',
      title: '歌名',
    },
    {
      key: 'artist',
      title: '作者',
      render: (data) => {
        return data.artist?.join() || '';
      },
    },
    {
      title: '专辑',
      key: 'album',
    },
  ];
  scrollY = 0;
  _snapshot: string | undefined;
  _windowResizeSubscription;
  constructor(
    private songService: SongService,
    private playlistService: PlaylistService,
    private windowResize: WindowResizeService,
    private configService: ConfigService,
  ) {
    this._windowResizeSubscription = this.windowResize.resizeObservable.subscribe((data) => {
      const [_, innerHeight] = data;
      this.scrollY = innerHeight - 85 - 80 - 80 - 24 - 54;
    });
  }

  ngOnInit(): void {
    this.scrollY = window.innerHeight - 85 - 80 - 80 - 24 - 54;
  }

  getSongResult(snapshot?: string) {
    const search = (snapshot || this.searchContent).split('-');
    const params = {
      title: search[0],
      artist: search[1],
      album: search[2],
    };
    this.songService.getSearchLocalSong(params, this.pageNo, this.pageSize).subscribe((data) => {
      if (data.status) {
        this.result = data.result?.data || [];
        this.total = data.result?.total || 0;
        if (!snapshot) {
          this._snapshot = this.searchContent;
          this.pageNo = 1;
        }
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
    this.getSongResult(this._snapshot);
  }
  handlePlay(data: LocalSongType) {
    const song = formatLocalSongMsg(data, this.configService.bitrate);
    this.playlistService.addSong(song);
    this.playlistService.setPlayingId(song.id);
    this.songService.setSong(song);
  }

  ngOnDestroy(): void {
    this._windowResizeSubscription.unsubscribe();
  }
}
