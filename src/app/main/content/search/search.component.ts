import { SongService } from './../../../utils/services/song.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less'],
})
export class SearchComponent implements OnInit {
  constructor(private songServicec: SongService) {}

  ngOnInit(): void {}

  handleSetSong() {
    this.songServicec.setSong({
      id: 1892532629,
      name: '光亮',
      artists: [],
    });
  }
}
