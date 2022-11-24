import { NotificationService } from 'src/app/utils/services/notification.service';
import { SongService, SongDetailType, SongUrlType } from './song.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type PlayListItemType = SongDetailType | SongUrlType | (SongDetailType & SongUrlType);

export function isSongDetailType(song: PlayListItemType): song is SongDetailType {
  return !!(song as SongDetailType).imgUrl;
}

export function isSongUrlType(song: PlayListItemType): song is SongUrlType {
  return !!(song as SongUrlType).url;
}

export type PlayModeType = 1 | 2 | 3 | 0;

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  private list: Array<PlayListItemType> = [];
  private playingId: number | undefined;
  /**
   * @property playMode 1: 循环播放， 2：单曲循环， 3：随机播放， 0：顺序播放
   */
  private playMode: PlayModeType = 1;
  private listSubject = new Subject<Array<PlayListItemType>>();
  listObserver = this.listSubject.asObservable();
  private playModeSubject = new Subject<PlayModeType>();
  playModeObserver = this.playModeSubject.asObservable();

  private playingIdSubject = new Subject<number | undefined>();
  playingIdObserver = this.playingIdSubject.asObservable();

  constructor(private songService: SongService, private notification: NotificationService) {}

  setList(list: Array<PlayListItemType>) {
    this.list = [...list];
    this.listSubject.next(this.list);
  }

  addList(song: PlayListItemType) {
    this.list.unshift(song);
    this.listSubject.next(this.list);
  }

  pre() {
    const findIndex = this.list.findIndex((item) => item.id === this.playingId);
    if (findIndex >= 0) {
      let preItem: PlayListItemType | undefined;
      switch (this.playMode) {
        case 1: {
          if (findIndex !== 0) {
            preItem = this.list[findIndex - 1];
          } else {
            preItem = this.list[this.list.length - 1];
          }
          break;
        }
        case 2:
          preItem = this.list[findIndex];
          break;
        case 3: {
          let index = findIndex;
          while (index == findIndex && this.list.length !== 1) {
            index = Math.floor(Math.random() * (this.list.length - 1));
          }
          preItem = this.list[index];
          break;
        }
        case 0: {
          if (findIndex !== 0) {
            preItem = this.list[findIndex - 1];
          }
        }
      }
      if (preItem) {
        this.playingId = preItem.id;
        this.playingIdSubject.next(this.playingId);
        this.songService.setSong(preItem);
      } else {
        this.notification.warning({
          title: '播放失败',
          message: '没有上一曲',
        });
      }
    } else {
      this.notification.warning({
        title: '播放失败',
        message: '没有上一曲',
      });
    }
  }
  next() {
    const findIndex = this.list.findIndex((item) => item.id === this.playingId);
    if (findIndex >= 0) {
      let nextItem: PlayListItemType | undefined;
      switch (this.playMode) {
        case 1: {
          if (findIndex !== this.list.length - 1) {
            nextItem = this.list[findIndex + 1];
          } else {
            nextItem = this.list[0];
          }
          break;
        }
        case 2:
          nextItem = this.list[findIndex];
          break;
        case 3: {
          let index = findIndex;
          while (index == findIndex && this.list.length !== 1) {
            index = Math.floor(Math.random() * (this.list.length - 1));
          }
          nextItem = this.list[index];
          break;
        }
        case 0: {
          if (findIndex !== this.list.length - 1) {
            nextItem = this.list[findIndex + 1];
          }
        }
      }
      if (nextItem) {
        this.playingId = nextItem.id;
        this.playingIdSubject.next(this.playingId);
        this.songService.setSong(nextItem);
      } else {
        this.notification.warning({
          title: '播放失败',
          message: '没有下一曲',
        });
      }
    } else {
      this.notification.warning({
        title: '播放失败',
        message: '没有下一曲',
      });
    }
  }

  mergeMsg(song: PlayListItemType) {
    const findIndex = this.list.findIndex((item) => item.id === song.id);
    if (findIndex >= 0) {
      this.list.splice(findIndex, 1, {
        ...this.list[findIndex],
        ...song,
      });
    }
    this.listSubject.next(this.list);
  }

  changePlayMode() {
    this.playMode = ((this.playMode + 1) % 4) as 0 | 1 | 2 | 3;
    this.playModeSubject.next(this.playMode);
  }

  setPlayingId(id: number | undefined) {
    this.playingId = id;
    this.playingIdSubject.next(id);
  }
}
