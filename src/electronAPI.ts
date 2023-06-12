interface IpcRenderer {
  // Docs: https://electronjs.org/docs/api/ipc-renderer

  /**
   * Resolves with the response from the main process.
   *
   * Send a message to the main process via `channel` and expect a result
   * asynchronously. Arguments will be serialized with the Structured Clone
   * Algorithm, just like `window.postMessage`, so prototype chains will not be
   * included. Sending Functions, Promises, Symbols, WeakMaps, or WeakSets will throw
   * an exception.
   *
   * The main process should listen for `channel` with `ipcMain.handle()`.
   *
   * For example:
   *
   * If you need to transfer a `MessagePort` to the main process, use
   * `ipcRenderer.postMessage`.
   *
   * If you do not need a response to the message, consider using `ipcRenderer.send`.
   *
   * > **Note** Sending non-standard JavaScript types such as DOM objects or special
   * Electron objects will throw an exception.
   *
   * Since the main process does not have support for DOM objects such as
   * `ImageBitmap`, `File`, `DOMMatrix` and so on, such objects cannot be sent over
   * Electron's IPC to the main process, as the main process would have no way to
   * decode them. Attempting to send such objects over IPC will result in an error.
   *
   * > **Note** If the handler in the main process throws an error, the promise
   * returned by `invoke` will reject. However, the `Error` object in the renderer
   * process will not be the same as the one thrown in the main process.
   */
  invoke(channel: string, ...args: any[]): Promise<any>;
  /**
   * Listens to `channel`, when a new message arrives `listener` would be called with
   * `listener(event, args...)`.
   */
  on(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): this;
  /**
   * Adds a one time `listener` function for the event. This `listener` is invoked
   * only the next time a message is sent to `channel`, after which it is removed.
   */
  once(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): this;
  /**
   * Send a message to the main process, optionally transferring ownership of zero or
   * more `MessagePort` objects.
   *
   * The transferred `MessagePort` objects will be available in the main process as
   * `MessagePortMain` objects by accessing the `ports` property of the emitted
   * event.
   *
   * For example:
   *
   * For more information on using `MessagePort` and `MessageChannel`, see the MDN
   * documentation.
   */
  postMessage(channel: string, message: any, transfer?: MessagePort[]): void;
  /**
   * Removes all listeners, or those of the specified `channel`.
   */
  removeAllListeners(channel: string): this;
  /**
   * Removes the specified `listener` from the listener array for the specified
   * `channel`.
   */
  removeListener(channel: string, listener: (...args: any[]) => void): this;
  /**
   * Send an asynchronous message to the main process via `channel`, along with
   * arguments. Arguments will be serialized with the Structured Clone Algorithm,
   * just like `window.postMessage`, so prototype chains will not be included.
   * Sending Functions, Promises, Symbols, WeakMaps, or WeakSets will throw an
   * exception.
   *
   * > **NOTE:** Sending non-standard JavaScript types such as DOM objects or special
   * Electron objects will throw an exception.
   *
   * Since the main process does not have support for DOM objects such as
   * `ImageBitmap`, `File`, `DOMMatrix` and so on, such objects cannot be sent over
   * Electron's IPC to the main process, as the main process would have no way to
   * decode them. Attempting to send such objects over IPC will result in an error.
   *
   * The main process handles it by listening for `channel` with the `ipcMain`
   * module.
   *
   * If you need to transfer a `MessagePort` to the main process, use
   * `ipcRenderer.postMessage`.
   *
   * If you want to receive a single response from the main process, like the result
   * of a method call, consider using `ipcRenderer.invoke`.
   */
  send(channel: string, ...args: any[]): void;
  /**
   * The value sent back by the `ipcMain` handler.
   *
   * Send a message to the main process via `channel` and expect a result
   * synchronously. Arguments will be serialized with the Structured Clone Algorithm,
   * just like `window.postMessage`, so prototype chains will not be included.
   * Sending Functions, Promises, Symbols, WeakMaps, or WeakSets will throw an
   * exception.
   *
   * > **NOTE:** Sending non-standard JavaScript types such as DOM objects or special
   * Electron objects will throw an exception.
   *
   * Since the main process does not have support for DOM objects such as
   * `ImageBitmap`, `File`, `DOMMatrix` and so on, such objects cannot be sent over
   * Electron's IPC to the main process, as the main process would have no way to
   * decode them. Attempting to send such objects over IPC will result in an error.
   *
   * The main process handles it by listening for `channel` with `ipcMain` module,
   * and replies by setting `event.returnValue`.
   *
   * > :warning: **WARNING**: Sending a synchronous message will block the whole
   * renderer process until the reply is received, so use this method only as a last
   * resort. It's much better to use the asynchronous version, `invoke()`.
   */
  sendSync(channel: string, ...args: any[]): any;
  /**
   * Sends a message to a window with `webContentsId` via `channel`.
   */
  sendTo(webContentsId: number, channel: string, ...args: any[]): void;
  /**
   * Like `ipcRenderer.send` but the event will be sent to the `<webview>` element in
   * the host page instead of the main process.
   */
  sendToHost(channel: string, ...args: any[]): void;
}

interface IpcRendererEvent extends Event {
  // Docs: https://electronjs.org/docs/api/structures/ipc-renderer-event

  /**
   * A list of MessagePorts that were transferred with this message
   */
  ports: MessagePort[];
  /**
   * The `IpcRenderer` instance that emitted the event originally
   */
  sender: IpcRenderer;
  /**
   * The `webContents.id` that sent the message, you can call
   * `event.sender.sendTo(event.senderId, ...)` to reply to the message, see
   * ipcRenderer.sendTo for more information. This only applies to messages sent from
   * a different renderer. Messages sent directly from the main process set
   * `event.senderId` to `0`.
   */
  senderId: number;
}
export interface IPicture {
  /**
   * Image mime type
   */
  format: string;
  /**
   * Image data
   */
  data: ArrayBuffer;
  /**
   * Optional description
   */
  description?: string;
  /**
   * Picture type
   */
  type?: string;
  /**
   * File name
   */
  name?: string;
}
export interface IRating {
  /**
   * Rating source, could be an e-mail address
   */
  source?: string;
  /**
   * Rating [0..1]
   */
  rating: number;
}
export interface Tags {
  track?: {
    no: number | null;
    of: number | null;
  };
  disk?: {
    no: number | null;
    of: number | null;
  };
  /**
   * Release year
   */
  year?: number;
  /**
   * Track title
   */
  title?: string;
  /**
   * Track, maybe several artists written in a single string.
   */
  artist?: string;
  /**
   * Track artists, aims to capture every artist in a different string.
   */
  artists?: string[];
  /**
   * Track album artists
   */
  albumartist?: string;
  /**
   * Album title
   */
  album?: string;
  /**
   * Release data
   */
  date?: string;
  /**
   * Original release date
   */
  originaldate?: string;
  /**
   * Original release yeat
   */
  originalyear?: number;
  /**
   * List of comments
   */
  comment?: string[];
  /**
   * Genre
   */
  genre?: string[];
  /**
   * Embedded album art
   */
  picture?: IPicture[];
  /**
   * Track composer
   */
  composer?: string[];
  /**
   * Lyrics
   */
  lyrics?: string[];
  /**
   * Album title, formatted for alphabetic ordering
   */
  albumsort?: string;
  /**
   * Track title, formatted for alphabetic ordering
   */
  titlesort?: string;
  /**
   * The canonical title of the work
   */
  work?: string;
  /**
   * Track artist, formatted for alphabetic ordering
   */
  artistsort?: string;
  /**
   * Album artist, formatted for alphabetic ordering
   */
  albumartistsort?: string;
  /**
   * Composer, formatted for alphabetic ordering
   */
  composersort?: string;
  /**
   * Lyricist(s)
   */
  lyricist?: string[];
  /**
   * Writer(s)
   */
  writer?: string[];
  /**
   * Conductor(s)
   */
  conductor?: string[];
  /**
   * Remixer(s)
   */
  remixer?: string[];
  /**
   * Arranger(s)
   */
  arranger?: string[];
  /**
   * Engineer(s)
   */
  engineer?: string[];
  /**
   * Producer(s)
   */
  producer?: string[];
  /**
   * Mix-DJ(s)
   */
  djmixer?: string[];
  /**
   * Mixed by
   */
  mixer?: string[];
  technician?: string[];
  label?: string[];
  grouping?: string;
  subtitle?: string[];
  description?: string[];
  longDescription?: string;
  discsubtitle?: string[];
  totaltracks?: string;
  totaldiscs?: string;
  movementTotal?: number;
  compilation?: boolean;
  rating?: IRating[];
  bpm?: number;
  /**
   * Keywords to reflect the mood of the audio, e.g. 'Romantic' or 'Sad'
   */
  mood?: string;
  /**
   * Release format, e.g. 'CD'
   */
  media?: string;
  /**
   * Release catalog number(s)
   */
  catalognumber?: string[];
  /**
   * TV show title
   */
  tvShow?: string;
  /**
   * TV show title, formatted for alphabetic ordering
   */
  tvShowSort?: string;
  /**
   * TV season title sequence number
   */
  tvSeason?: number;
  /**
   * TV Episode sequence number
   */
  tvEpisode?: number;
  /**
   * TV episode ID
   */
  tvEpisodeId?: string;
  /**
   * TV network
   */
  tvNetwork?: string;
  podcast?: boolean;
  podcasturl?: string;
  releasestatus?: string;
  releasetype?: string[];
  releasecountry?: string;
  script?: string;
  language?: string;
  copyright?: string;
  license?: string;
  encodedby?: string;
  encodersettings?: string;
  gapless?: boolean;
  barcode?: string;
  isrc?: string[];
  asin?: string;
  musicbrainz_recordingid?: string;
  musicbrainz_trackid?: string;
  musicbrainz_albumid?: string;
  musicbrainz_artistid?: string[];
  musicbrainz_albumartistid?: string[];
  musicbrainz_releasegroupid?: string;
  musicbrainz_workid?: string;
  musicbrainz_trmid?: string;
  musicbrainz_discid?: string;
  acoustid_id?: string;
  acoustid_fingerprint?: string;
  musicip_puid?: string;
  musicip_fingerprint?: string;
  website?: string;
  'performer:instrument'?: string[];
  averageLevel?: number;
  peakLevel?: number;
  notes?: string[];
  originalalbum?: string;
  originalartist?: string;
  discogs_artist_id?: number[];
  discogs_release_id?: number;
  discogs_label_id?: number;
  discogs_master_release_id?: number;
  discogs_votes?: number;
  discogs_rating?: number;
  /**
   * Track gain ratio [0..1]
   */
  replaygain_track_gain_ratio?: number;
  /**
   * Track peak ratio [0..1]
   */
  replaygain_track_peak_ratio?: number;
  /**
   * Track gain ratio
   */
  /**
   * minimum & maximum global gain values across a set of files scanned as an album
   */
  replaygain_undo?: {
    leftChannel: number;
    rightChannel: number;
  };
  /**
   * minimum & maximum global gain values across a set of files scanned as an album
   */
  replaygain_track_minmax?: number[];
  /**
   * The initial key of the music in the file, e.g. "A Minor".
   * Ref: https://docs.microsoft.com/en-us/windows/win32/wmformat/wm-initialkey
   */
  key?: string;
  /**
   * Podcast Category
   */
  category?: string[];
  /**
   * iTunes Video Quality
   *
   * 2: Full HD
   * 1: HD
   * 0: SD
   */
  hdVideo?: number;
  /**
   * Podcast Keywords
   */
  keywords?: string[];
  /**
   * Movement
   */
  movement?: string;
  /**
   * Movement Index/Total
   */
  movementIndex?: {
    no?: number;
    of?: number;
  };
  /**
   * Podcast Identifier
   */
  podcastId?: string;
  /**
   * Show Movement
   */
  showMovement?: boolean;
  /**
   * iTunes Media Type
   *
   * 1: Normal
   * 2: Audiobook
   * 6: Music Video
   * 9: Movie
   * 10: TV Show
   * 11: Booklet
   * 14: Ringtone
   *
   * https://github.com/sergiomb2/libmp4v2/wiki/iTunesMetadata#user-content-media-type-stik
   */
  stik?: number;

  image?:
    | string
    | {
        mime: string;
        imageBuffer: ArrayBuffer;
      };
}

export interface CUEType {
  analyse: Array<{ confidence: number; name: string; lang?: string }>;
  buffer: Uint8Array;
}

export interface ElectronAPI {
  handleFiles: (cb: (event: IpcRendererEvent, files: string[]) => void) => void;
  handleDirectory: (
    cb: (event: IpcRendererEvent, root: string, fileList: string[]) => void,
  ) => void;
  invokeReadID3: (root: string, file: string) => PromiseLike<Tags>;
  invokeSetID3: (root: string, file: string, tags: Tags) => PromiseLike<boolean>;
  invokeReadCue: (root: string, file: string) => PromiseLike<CUEType>;
  invokeSetCue: (root: string, file: string, content: Uint8Array) => PromiseLike<void>;
  invokeRmFile: (root: string, file: string, refresh: boolean) => PromiseLike<void>;
  invokeAbsolutePath: (root: string, file: string) => PromiseLike<string>;
}
