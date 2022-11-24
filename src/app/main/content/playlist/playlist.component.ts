import { SongService } from './../../../utils/services/song.service';
import { ColumnsType } from './../../../components/table/table.component';
import {
  PlaylistService,
  PlayListItemType,
  isSongDetailType,
} from './../../../utils/services/playlist.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.less'],
})
export class PlaylistComponent implements OnInit {
  playList: PlayListItemType[] = [];
  playingId: number | undefined;
  columns: ColumnsType<PlayListItemType>[] = [
    {
      title: '',
      width: 30,
      key: 'play',
      temp: true,
    },
    {
      key: 'name',
      title: '歌曲名',
      width: 200,
      align: 'left',
    },
    {
      title: '作者',
      key: 'artists',
      width: 70,
      align: 'left',
      render: (data) => {
        if (isSongDetailType(data)) {
          return data.artists.map((item) => item.name).join(',');
        }
        return '-';
      },
    },
  ];
  constructor(private playlistService: PlaylistService, private songService: SongService) {
    this.playlistService.listObserver.subscribe((data) => {
      this.playList = data;
    });
    this.playlistService.playingIdObserver.subscribe((data) => {
      this.playingId = data;
    });
  }

  ngOnInit(): void {}

  handlePlay(data: PlayListItemType) {
    this.songService.setSong(data);
  }
}
