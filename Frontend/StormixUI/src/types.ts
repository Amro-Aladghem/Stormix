export interface SearchResultPayload {
  videoId: string;
  segmentId: string;
  url: string;
  start: number;
  end: number;
  primaryTopic: string;
  summary: string;
  tags: string[];
}

export interface SearchResult {
  id: string;
  score: number;
  payload: SearchResultPayload;
}

export interface VideoSegment {
  segmentId: string;
  start: number;
  end: number;
  languageId?: string;
  primaryTopic: string;
  summary: string;
  tags: string[];
}

export interface VideoInfo {
  videoId: string;
  videoTitle?: string;
  segments: VideoSegment[];
}

export type ViewState = "empty" | "loading" | "results";

export interface PersistedSearch {
  query: string;
  usedTags: string[];
  results: SearchResult[];
  activeId: string | null;
}
