import { ResponseJSONType } from 'src/app/utils/services/httpResponseJSON';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { isSongDetailType, isSongUrlType, PlayListItemType } from './playlist.service';
import { distinctUntilChanged } from 'rxjs';

interface BaseType {
  id: number;
  name: string;
}

export interface SongDetailType {
  id: number;
  name: string;
  imgUrl?: string;
  artists: BaseType[];
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
  artists: BaseType[];
}

export interface AlbumDetailResultType {
  songs: BaseType[];
  album: {
    artists: BaseType[];
    company?: string;
    picUrl: string;
    publishTime?: number;
  };
}

export type SongResultType = {
  id: number;
  url: string;
  size: number;
  md5: string;
}[];

export interface SearchSongType {
  id: number;
  name: string;
  artists: {
    id: number;
    name: string;
    img1v1Url: string;
  }[];
  album: {
    id: number;
    name: string;
    publishTime: number;
  };
  duration: number;
}
export interface LocalSongType {
  id: number;
  type: 'tracks' | 'single';
  url: string;
  title?: string;
  artist?: string;
  album?: string;
  albumartist?: string;
  year?: number;
  picUrl: string;
  duration?: string;
}
export type SaveLocalSongType = Omit<LocalSongType, 'picUrl' | 'id'> & {
  picUrl?: string;
  file?: Blob;
};
export type SearchSongResultType = {
  songs: SearchSongType[];
  hasMore: boolean;
  songCount: number;
};

@Injectable({
  providedIn: 'root',
})
export class SongService {
  private songMsgSubject = new Subject<SongDetailType>();
  private songUrlSubject = new Subject<SongUrlType>();
  songMsgObserver = this.songMsgSubject.asObservable();
  songUrlObserver = this.songUrlSubject.asObservable();

  constructor(private service: HttpClient) {}

  getSearchLocalSong(title: string, artist: string) {
    return this.service
      .get<ResponseJSONType<LocalSongType[]>>(`/songs/search?title=${title}&artist=${artist}`)
      .pipe(distinctUntilChanged());
  }

  deleteLocalSong(id: number) {
    return this.service
      .delete<ResponseJSONType<boolean>>(`/songs/${id}`)
      .pipe(distinctUntilChanged());
  }

  addLocalSong(data: SaveLocalSongType) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      if (key !== 'file') {
        formData.append(key, `${value as string}`);
      } else {
        formData.append(key, value as Blob, data.album);
      }
    }
    return this.service.post<ResponseJSONType<boolean>>('/songs/create', formData);
  }

  getSearchSong(key: string, pageNo: number, pageSize: number) {
    return this.service
      .get<ResponseJSONType<SearchSongResultType>>(`/cloudApi/search/${key}`, {
        params: {
          limit: pageSize,
          offset: (pageNo - 1) * pageSize,
        },
      })
      .pipe(distinctUntilChanged());
  }

  getSongMsg(id: number) {
    return this.service.get<ResponseJSONType<SongDetailResultType>>(`/cloudApi/song/detail/${id}`);
  }

  getAlbum(id: number) {
    return this.service.get<AlbumDetailResultType & { code: number }>(`/cloudApi/album/${id}`);
  }

  private _getSongMsg(id: number) {
    this.getSongMsg(id).subscribe((data) => {
      if (data.code === 200 && data.result) {
        const { name, picUrl, artists } = data.result;
        const song = {
          id,
          name,
          imgUrl: picUrl,
          artists,
        };
        this.songMsgSubject.next(song);
      }
    });
  }

  private getSongUrl(id: number) {
    this.service
      .get<ResponseJSONType<SongResultType>>(`/cloudApi/musicUrl/${id}`)
      .subscribe((data) => {
        if (data.code === 200 && data.result && data.result.length) {
          const { id, url } = data.result[data.result.length - 1];
          const song = {
            id,
            url,
          };
          this.songUrlSubject.next(song);
        }
      });
  }

  setSong(song: PlayListItemType) {
    if (isSongDetailType(song)) {
      this.songMsgSubject.next(song);
    } else {
      this._getSongMsg(song.id);
    }
    if (isSongUrlType(song)) {
      this.songUrlSubject.next(song);
    } else {
      this.getSongUrl(song.id);
    }
  }
}
