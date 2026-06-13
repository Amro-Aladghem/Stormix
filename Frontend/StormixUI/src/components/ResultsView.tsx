import React, { useMemo } from "react";
import { Clock, Globe, HelpCircle, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { SearchResult, VideoInfo } from "../types";
import { formatTime, getYouTubeId } from "../utils";
import ResultCard from "./ResultCard";
import TagBadge from "./TagBadge";

interface ResultsViewProps {
  active: SearchResult;
  results: SearchResult[];
  activeId: string;
  setActiveId: (id: string) => void;
  usedTags: string[];
  videoInfo: VideoInfo | null;
  loadingVideo: boolean;
}

export default function ResultsView({
  active,
  results,
  activeId,
  setActiveId,
  usedTags,
  videoInfo,
  loadingVideo,
}: ResultsViewProps) {
  const ytId = getYouTubeId(active.payload.url);
  const rest = results.filter((r) => r.id !== activeId);

  // Set of segment ID string keys that are matches for the current active search terms query
  const matchedSegIds = useMemo(
    () =>
      new Set(
        results
          .filter((r) => r.payload.videoId === active.payload.videoId)
          .map((r) => r.payload.segmentId)
      ),
    [results, active.payload.videoId]
  );

  return (
    <div className="w-full h-[calc(100vh-3.5rem)] flex overflow-hidden">
      {/* Dynamic sidebar timeline */}
      <aside className="w-72 border-r border-border bg-[#212120] flex flex-col overflow-hidden shrink-0">
        <div className="p-4 border-b border-border flex items-center justify-between bg-[#252524] shrink-0">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#888888] flex items-center gap-1.5 select-none">
            <Clock className="w-3.5 h-3.5" /> Video Timeline
          </h3>
          {loadingVideo ? (
            <span className="flex items-center gap-1 text-[10px] font-medium text-primary">
              <Loader2 className="w-3 h-3 animate-spin" /> Syncing...
            </span>
          ) : (
            <span className="text-[10px] text-primary opacity-80 select-none">Sync active</span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-[#212120]">
          {videoInfo?.segments && videoInfo.segments.length > 0 ? (
            videoInfo.segments.map((seg, idx) => {
              const isMatch = matchedSegIds.has(seg.segmentId);
              const isActive = seg.segmentId === active.payload.segmentId;

              return (
                <motion.div
                  key={seg.segmentId || idx}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.04, 0.4) }}
                  className={
                    "rounded border transition-all text-left " +
                    (isActive
                      ? "border-primary/40 bg-primary/10"
                      : isMatch
                      ? "border-primary/25 bg-primary/5 hover:border-primary/40"
                      : "border-border bg-[#1c1c1b] opacity-70 hover:opacity-100")
                  }
                >
                  <button
                    onClick={() => {
                      const found = results.find(
                        (r) => r.payload.segmentId === seg.segmentId
                      );
                      if (found) {
                        setActiveId(found.id);
                      } else {
                        const fauxId = `${active.payload.videoId}_seg_${idx}`;
                        setActiveId(fauxId);
                      }
                    }}
                    className="w-full text-left p-3 cursor-pointer focus:outline-none"
                  >
                    <div className="flex items-center justify-between gap-2 text-[10px] font-mono mb-1">
                      <span className="text-primary font-bold">
                        {formatTime(seg.start)} — {formatTime(seg.end)}
                      </span>
                      <span className="text-[#888888] uppercase">EN</span>
                    </div>
                    <div className="text-xs font-semibold text-[#f2f1ef] leading-tight">
                      {seg.primaryTopic}
                    </div>
                    {isMatch && (
                      <div className="mt-2 text-[9px] flex items-center gap-1 text-primary">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Matched Search
                      </div>
                    )}
                  </button>
                </motion.div>
              );
            })
          ) : loadingVideo ? (
            <div className="space-y-2 py-4 px-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="h-16 rounded bg-[#1c1c1b] animate-pulse border border-border/40" />
              ))}
            </div>
          ) : (
            <div className="text-xs text-[#888888] px-2 py-12 text-center flex flex-col items-center gap-2">
              <AlertCircle className="w-5 h-5 opacity-40 text-muted-foreground" />
              <span>No segments listed. Waiting for dynamic timeline processing.</span>
            </div>
          )}
        </div>
      </aside>

      {/* Main player search visual content panel */}
      <section className="flex-1 overflow-y-auto p-6 bg-[#161615] flex flex-col min-w-0">
        <div className="flex items-center gap-2 mb-4 shrink-0 overflow-x-auto pb-1 select-none">
          <span className="text-[10px] text-[#888888] uppercase tracking-widest pt-0.5">Tags:</span>
          {usedTags.length > 0 ? (
            usedTags.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-primary/15 text-primary border border-primary/30"
              >
                {t}
              </span>
            ))
          ) : (
            active.payload.tags.slice(0, 4).map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#313130] text-[#888888] border border-[#444443]"
              >
                {t}
              </span>
            ))
          )}
        </div>

        {/* Hero Video Media Player Frame Card with High Density sizing */}
        <div className="rounded border border-primary/30 bg-black aspect-video relative group overflow-hidden mb-6 shadow-2xl shrink-0 max-w-4xl">
          {ytId ? (
            <iframe
              key={`${active.id}-${active.payload.start}`}
              src={`https://www.youtube.com/embed/${ytId}?start=${active.payload.start}&autoplay=1&rel=0`}
              title={active.payload.primaryTopic}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0 absolute inset-0"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-[#888888]">
              <p className="text-xs font-semibold">Video stream requires active integration.</p>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#444443]">
            <div className="h-full bg-primary w-1/3"></div>
          </div>
          <div className="absolute top-3 left-3 bg-black/60 px-2 py-1 rounded text-[10px] font-mono text-[#f2f1ef] z-10 select-none">
            {formatTime(active.payload.start)} / Segment Matches
          </div>
        </div>

        {/* Segment Info Layout Block */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8 max-w-7xl">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#f2f1ef] tracking-tight leading-tight">
              {active.payload.primaryTopic}
            </h1>
            <p className="mt-3 text-xs md:text-sm text-[#888888] leading-relaxed">
              {active.payload.summary}
            </p>

            <div className="mt-6">
              <h3 className="text-xs font-bold text-[#888888] uppercase tracking-widest mb-3">
                More Matches in this Video
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {results
                  .filter((r) => r.payload.videoId === active.payload.videoId && r.id !== active.id)
                  .map((r, i) => (
                    <div
                      key={r.id}
                      onClick={() => setActiveId(r.id)}
                      className="flex items-center gap-3 p-2 rounded bg-[#252524] border border-[#313130] hover:border-primary/50 cursor-pointer transition-colors"
                    >
                      <div className="w-12 h-8 rounded bg-black/40 border border-white/5 shrink-0 overflow-hidden relative">
                        {getYouTubeId(r.payload.url) && (
                          <img
                            src={`https://img.youtube.com/vi/${getYouTubeId(r.payload.url)}/mqdefault.jpg`}
                            alt=""
                            className="w-full h-full object-cover opacity-60"
                            referrerPolicy="no-referrer"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate text-[#f2f1ef]">{r.payload.primaryTopic}</div>
                        <div className="text-[10px] font-mono text-[#888888]">
                          {formatTime(r.payload.start)} — {formatTime(r.payload.end)}
                        </div>
                      </div>
                      <div className="text-[10px] font-bold text-primary mr-2 shrink-0">
                        {Math.round(r.score * 100)}%
                      </div>
                    </div>
                  ))}
                {results.filter((r) => r.payload.videoId === active.payload.videoId && r.id !== active.id).length === 0 && (
                  <div className="text-xs text-[#555555] italic select-none">
                    No other overlapping segments detected.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Videos Column inside active match result */}
          <div className="border-t md:border-t-0 md:border-l border-[#313130] pt-6 md:pt-0 md:pl-8">
            <h3 className="text-xs font-bold text-[#888888] uppercase tracking-widest mb-4">
              Related Videos
            </h3>
            <div className="space-y-4">
              {rest.slice(0, 3).map((r) => {
                const thumbUrl = `https://img.youtube.com/vi/${getYouTubeId(r.payload.url)}/mqdefault.jpg`;
                return (
                  <div
                    key={r.id}
                    onClick={() => setActiveId(r.id)}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-video rounded bg-[#252524] border border-[#313130] mb-2 overflow-hidden relative">
                      <img
                        src={thumbUrl}
                        alt=""
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all scale-100 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="text-xs font-bold line-clamp-2 leading-tight group-hover:text-primary text-[#ccc] transition-colors">
                      {r.payload.primaryTopic}
                    </div>
                    <div className="text-[10px] text-[#666666] mt-1 italic select-none">
                      Match Level: {Math.round(r.score * 100)}%
                    </div>
                  </div>
                );
              })}
              {rest.length === 0 && (
                <div className="text-xs text-[#555555] italic select-none">
                  No additional videos loaded.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
