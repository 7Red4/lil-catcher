export interface Fragment {
  url: string;
  duration: number;
}

export interface HttpHeaders {
  'User-Agent': string;
  Accept: string;
  'Accept-Language': string;
  'Sec-Fetch-Mode': string;
}

export interface DownloaderOptions {
  http_chunk_size: number;
}

export interface Format {
  format_id: string;
  format_note: string;
  ext: string;
  protocol: string;
  acodec: string;
  vcodec: string;
  url: string;
  width?: number;
  height?: number;
  fps?: number;
  rows: number;
  columns: number;
  fragments: Fragment[];
  resolution: string;
  aspect_ratio?: number;
  http_headers: HttpHeaders;
  audio_ext: string;
  video_ext: string;
  format: string;
  asr?: number;
  filesize?: number;
  source_preference?: number;
  audio_channels?: number;
  quality?: number;
  has_drm?: boolean;
  tbr?: number;
  language?: any;
  language_preference?: number;
  preference?: number;
  dynamic_range: string;
  abr?: number;
  downloader_options: DownloaderOptions;
  container: string;
  vbr?: number;
}

export interface Thumbnail {
  url: string;
  preference: number;
  id: string;
  height?: number;
  width?: number;
  resolution: string;
}

export interface DownloaderOptions2 {
  http_chunk_size: number;
}

export interface HttpHeaders2 {
  'User-Agent': string;
  Accept: string;
  'Accept-Language': string;
  'Sec-Fetch-Mode': string;
}

export interface RequestedFormat {
  asr?: number;
  filesize: number;
  format_id: string;
  format_note: string;
  source_preference: number;
  fps?: number;
  audio_channels?: number;
  height?: number;
  quality: number;
  has_drm: boolean;
  tbr: number;
  url: string;
  width?: number;
  language?: string;
  language_preference: number;
  preference?: string;
  ext: string;
  vcodec: string;
  acodec: string;
  dynamic_range: string;
  vbr: number;
  downloader_options: DownloaderOptions2;
  container: string;
  protocol: string;
  resolution: string;
  aspect_ratio?: number;
  http_headers: HttpHeaders2;
  video_ext: string;
  audio_ext: string;
  format: string;
  abr?: number;
}

export interface Version {
  version: string;
  current_git_head?: string;
  release_git_head: string;
  repository: string;
}

export interface VideoDetails {
  id: string;
  title: string;
  formats: Format[];
  thumbnails: Thumbnail[];
  thumbnail: string;
  description: string;
  uploader: string;
  uploader_id: string;
  uploader_url: string;
  channel_id: string;
  channel_url: string;
  duration: number;
  view_count: number;
  average_rating?: string;
  age_limit: number;
  webpage_url: string;
  categories: string[];
  tags: number[];
  playable_in_embed: boolean;
  live_status: string;
  release_timestamp?: number;
  _format_sort_fields: string[];
  comment_count: number;
  chapters?: any[];
  like_count: number;
  channel: string;
  channel_follower_count: number;
  upload_date: string;
  availability: string;
  original_url: string;
  webpage_url_basename: string;
  webpage_url_domain: string;
  extractor: string;
  extractor_key: string;
  playlist?: any;
  playlist_index?: any;
  display_id: string;
  fulltitle: string;
  duration_string: string;
  is_live: boolean;
  was_live: boolean;
  requested_subtitles?: any;
  _has_drm?: any;
  requested_formats: RequestedFormat[];
  format: string;
  format_id: string;
  ext: string;
  protocol: string;
  language?: string;
  format_note: string;
  filesize_approx: number;
  tbr: number;
  width: number;
  height: number;
  resolution: string;
  fps: number;
  dynamic_range: string;
  vcodec: string;
  vbr: number;
  stretched_ratio?: any;
  aspect_ratio: number;
  acodec: string;
  abr: number;
  asr: number;
  audio_channels: number;
  epoch: number;
  _filename: string;
  filename: string;
  urls: string;
  _type: string;
  _version: Version;
}
