import { ResponseJSONType } from 'src/app/utils/services/httpResponseJSON';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface SongDetailType {
  id: number;
  name: string;
  imgUrl?: string;
  artists: {
    id: number;
    name: string;
  }[];
}

export interface SongUrlType {
  id: number;
  url?: string;
}

export interface SongDetailResultType {
  id: number;
  name: string;
  picUrl: string;
  pic_str: string;
  pic: number;
  artists: {
    id: number;
    name: string;
  }[];
}

export type SongResultType = {
  id: number;
  url: string;
  size: number;
  md5: string;
}[];

@Injectable({
  providedIn: 'root',
})
export class SongService {
  private songMsgSubject = new Subject<SongDetailType>();
  private songUrlSubject = new Subject<SongUrlType>();
  songMsgObserver = this.songMsgSubject.asObservable();
  songUrlObserver = this.songUrlSubject.asObservable();

  constructor(private service: HttpClient) {}

  private getSongMsg(id: number) {
    this.service
      .get<ResponseJSONType<SongDetailResultType>>(`/cloudApi/song/detail/${id}`)
      .subscribe((data) => {
        if (data.code === 200 && data.result) {
          const { name, picUrl, artists } = data.result;
          this.songMsgSubject.next({
            id,
            name,
            imgUrl: picUrl,
            artists,
          });
        }
      });
  }

  private getSongUrl(id: number) {
    this.service
      .get<ResponseJSONType<SongResultType>>(`/cloudApi/musicUrl/${id}`)
      .subscribe((data) => {
        if (data.code === 200 && data.result && data.result.length) {
          const { id, url } = data.result[data.result.length - 1];
          this.songUrlSubject.next({
            id,
            url,
          });
        }
      });
  }

  setSong(song: SongDetailType) {
    if (!song.imgUrl) {
      this.getSongMsg(song.id);
    } else {
      this.songMsgSubject.next(song);
    }
    this.getSongUrl(song.id);
  }
}
