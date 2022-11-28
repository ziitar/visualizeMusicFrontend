import { PlaylistService } from './../../../utils/services/playlist.service';
import { ColumnsType } from './../../../components/table/table.component';
import { isTrulyValue } from 'src/utils/utils';
import { SongService, SearchSongType } from './../../../utils/services/song.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less'],
})
export class SearchComponent implements OnInit {
  searchContent = '';
  total = 0;
  pageNo = 1;
  pageSize = 25;
  result: SearchSongType[] = [];
  columns: ColumnsType<SearchSongType>[] = [
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
  constructor(private songService: SongService, private playlistService: PlaylistService) {}

  ngOnInit(): void {}

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
}
