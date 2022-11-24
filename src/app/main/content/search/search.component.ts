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

  result: SearchSongType[] = [];
  columns: ColumnsType<SearchSongType>[] = [];
  constructor(private songService: SongService, private playlistService: PlaylistService) {}

  ngOnInit(): void {}

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && isTrulyValue(this.searchContent)) {
      this.songService.getSearchSong(this.searchContent).subscribe((data) => {
        if (data.code) {
          this.result = data.result?.songs || [];
        }
      });
    }
  }
}
