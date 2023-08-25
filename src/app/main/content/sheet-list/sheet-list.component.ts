import { ConfigService } from './../../../utils/services/config.service';
import { WindowResizeService } from './../../../utils/services/window-resize.service';
import { PlaylistService } from './../../../utils/services/playlist.service';
import { Sheet, SheetService } from './../sheet/sheet.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColumnsType } from 'src/app/components/table/table.component';
import {
  LocalSongType,
  SongDetailType,
  SongService,
  SongUrlType,
} from 'src/app/utils/services/song.service';
import { environment } from 'src/environments/environment';
import { formatLocalSongMsg } from 'src/utils/utils';

@Component({
  selector: 'app-sheet-list',
  templateUrl: './sheet-list.component.html',
  styleUrls: ['./sheet-list.component.less'],
})
export class SheetListComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private sheetService: SheetService,
    private playlistService: PlaylistService,
    private songService: SongService,
    private windowResizeService: WindowResizeService,
    private configService: ConfigService,
  ) {}

  sheetId: number | undefined;
  songs: LocalSongType[] = [];
  playlistSongs: (SongDetailType & SongUrlType)[] = [];
  sheet: Sheet | undefined;
  total = 0;
  sheetImg = `${environment.service}/assets/music-head.jpg`;
  columns: ColumnsType<LocalSongType>[] = [
    {
      title: '',
      key: 'operation',
      temp: true,
    },
    {
      title: '歌名',
      key: 'title',
    },
    {
      title: '时长',
      key: 'duration',
    },
    {
      title: '歌手',
      key: 'artist',
      render: (data) => {
        return data.artist?.join(', ') || '';
      },
    },
    {
      title: '专辑',
      key: 'album',
    },
    {
      title: '品质',
      key: 'lossless',
      render: (data) => {
        return data.lossless ? '无损' : `${data.bitrate || ''}`;
      },
    },
  ];
  scroll_y: number | undefined;
  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.sheetId = Number(routeParams.get('sheetId'));
    if (this.sheetId) {
      this.sheetService.getSheetSong(this.sheetId).subscribe((data) => {
        if (data.status && data.result) {
          this.songs = data.result.songs;
          this.total = data.result.total;
          this.sheet = data.result.sheet;
          if (data.result.sheet.url) {
            this.sheetImg = data.result.sheet.url;
          } else if (data.result.songs[0] && data.result.songs[0].image) {
            this.sheetImg = `${environment.service}${data.result.songs[0].image}`;
          }
          this.playlistSongs = data.result.songs.map((song) =>
            formatLocalSongMsg(song, this.configService.bitrate),
          );
        }
      });
    }
    this.scroll_y = window.innerHeight - 24 * 2 - 175 - 58.5 - 54 - 85;
    this.windowResizeService.resizeObservable.subscribe((data) => {
      const [_, h] = data;
      this.scroll_y = h - 24 * 2 - 175 - 58.5 - 54 - 85;
    });
  }

  handlePlay(data: LocalSongType) {
    this.playlistService.setList(this.playlistSongs);
    const song = this.playlistSongs.find((item) => item.id === data.id);
    if (song) {
      this.playlistService.setPlayingId(song.id);
      this.songService.setSong(song);
    }
  }
}
