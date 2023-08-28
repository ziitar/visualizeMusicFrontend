import { BitRate } from 'src/app/utils/services/config.service';
import { LocalSongType, SongDetailType, SongUrlType } from 'src/app/utils/services/song.service';
import { environment } from 'src/environments/environment';

export function isObj<T extends Record<string | number, any>>(obj: any): obj is T {
  return /^\[object\sObject\]$/.test(Object.prototype.toString.call(obj));
}

export function isStr(str: any): str is string {
  return typeof str === 'string';
}
type EmptyOrNull = undefined | null | '';
export function isEmptyOrNull(v: any): v is EmptyOrNull {
  // 判断字符串是否为空
  return typeof v === 'undefined' || v === '' || v === null ? true : false;
}
// 判断一个对象是否为空
export function isEmptyObject(obj: { [key: string]: any }): boolean {
  for (const i in obj) {
    return false;
  }
  return true;
}
type FalseValue = undefined | null | '' | false;
export function isFalseValue(v: any): v is FalseValue {
  if (v === 0) {
    return false;
  } else {
    return !v;
  }
}

export function isTrulyValue(v: any): boolean {
  if (v === 0) {
    return true;
  } else {
    return !!v;
  }
}

export function isTrulyArg(...v: any[]): boolean {
  return v.every((item) => isTrulyValue(item));
}

/**
 * 判定表单有效值(指除了 undefined null '' [] {} 之外的值为有效值)
 *   @param {undefined |null | string | number | Array<any> | object} value 待判定值
 *   @param {boolean} isStrict 是否是严格模式
 */
export function hasFormItemValue(
  value: undefined | null | string | number | Array<any> | object,
  isStrict = false,
): boolean {
  if (!isEmptyOrNull(value)) {
    if (Array.isArray(value)) {
      if (isStrict) {
        return !!value.filter((item) => hasFormItemValue(item)).length;
      } else {
        return !!value.length;
      }
    }
    if (typeof value === 'object') {
      return isEmptyObject(value);
    }
    return true;
  }
  return false;
}

export function msToTime(duration: number): string {
  const seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}

export const passwordReg = '^[\\w_\\-%#@$!&*]{6,}$';

export function formatLocalSongMsg(
  song: LocalSongType,
  bitrate: BitRate,
): SongDetailType & SongUrlType {
  let songUrl = encodeURIComponent(song.url);
  const filterKey = ['duration', 'start', 'type', 'title', 'album', 'artist'];
  let extra = '';
  if (bitrate === '1') {
    extra = `&lossless=${bitrate}`;
  } else {
    if (song.bitrate && song.bitrate > parseInt(bitrate.replace('k', '')) * 1000) {
      extra = `&lossless=0&bitrate=${bitrate}`;
    } else {
      extra = `&lossless=${bitrate}`;
    }
  }
  songUrl = `${environment.service}/assets/decode/${songUrl}?${Object.entries(song)
    .filter(([key, value]) => filterKey.includes(key) && value)
    .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
    .join('&')}${extra}`;
  const imgUrl = song.image ? `${environment.service}${song.image}` : undefined;
  return {
    id: song.id,
    name: song.title,
    imgUrl,
    url: songUrl,
    artists: song.artist.map((item) => ({ name: item })),
  };
}
