import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  MOCK_RESULTS,
  TAG_VOCAB,
  extractTags,
  formatTime,
  getYouTubeId,
  langFromId,
  mockVideoInfo,
  ytThumb,
  type SearchResult,
  type VideoInfo,
} from "@/lib/stormix-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Stormix — Search inside YouTube videos" },
      {
        name: "description",
        content:
          "Stormix understands YouTube videos. Search for any topic and jump directly to the right segment.",
      },
    ],
  }),
  component: StormixPage,
});

type ViewState = "empty" | "loading" | "results";

const SS_KEY = "stormix:lastSearch";
const LS_HISTORY = "stormix:history";

interface PersistedSearch {
  query: string;
  usedTags: string[];
  results: SearchResult[];
  activeId: string | null;
}

function loadPersisted(): PersistedSearch | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedSearch;
  } catch {
    return null;
  }
}

function savePersisted(p: PersistedSearch) {
  try {
    sessionStorage.setItem(SS_KEY, JSON.stringify(p));
  } catch {}
}

function loadHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_HISTORY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function pushHistory(q: string) {
  try {
    const cur = loadHistory().filter((h) => h.toLowerCase() !== q.toLowerCase());
    const next = [q, ...cur].slice(0, 20);
    localStorage.setItem(LS_HISTORY, JSON.stringify(next));
  } catch {}
}

function StormixPage() {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<ViewState>("empty");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [usedTags, setUsedTags] = useState<string[]>([]);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Restore from sessionStorage
  useEffect(() => {
    setHistory(loadHistory());
    const p = loadPersisted();
    if (p && p.results.length) {
      setQuery(p.query);
      setUsedTags(p.usedTags);
      setResults(p.results);
      setActiveId(p.activeId);
      setState("results");
    }
  }, []);

  const active = useMemo(
    () => results.find((r) => r.id === activeId) ?? results[0] ?? null,
    [results, activeId],
  );

  // Fetch full video info when active changes
  useEffect(() => {
    if (!active) {
      setVideoInfo(null);
      return;
    }
    const vid = active.payload.videoId;
    let cancelled = false;
    setLoadingVideo(true);
    (async () => {
      let info: VideoInfo | null = null;
      try {
        const res = await fetch(
          `https://localhost:7260/api/v1/videos/${vid}`,
        );
        if (res.ok) info = (await res.json()) as VideoInfo;
      } catch {}
      if (!info) info = mockVideoInfo(vid, results);
      if (!cancelled) {
        setVideoInfo(info);
        setLoadingVideo(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [active?.payload.videoId, results]);

  async function runSearch(e?: React.FormEvent, override?: string) {
    e?.preventDefault();
    const text = (override ?? query).trim();
    if (!text) return;
    setQuery(text);
    setShowHistory(false);
    const tags = extractTags(text);
    setUsedTags(tags);
    setState("loading");
    setResults([]);
    setActiveId(null);

    let data: SearchResult[] | null = null;
    try {
      const res = await fetch("https://localhost:7260/api/v1/videos/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, tags }),
      });
      if (res.ok) data = await res.json();
    } catch {}
    await new Promise((r) => setTimeout(r, 700));
    const final = (data && data.length ? data : MOCK_RESULTS).slice(0, 10);
    const firstId = final[0]?.id ?? null;
    setResults(final);
    setActiveId(firstId);
    setState("results");
    pushHistory(text);
    setHistory(loadHistory());
    savePersisted({ query: text, usedTags: tags, results: final, activeId: firstId });
  }

  function selectActive(id: string) {
    setActiveId(id);
    const p = loadPersisted();
    if (p) savePersisted({ ...p, activeId: id });
  }

  function resetAll() {
    setQuery("");
    setResults([]);
    setActiveId(null);
    setState("empty");
    setUsedTags([]);
    setVideoInfo(null);
    try { sessionStorage.removeItem(SS_KEY); } catch {}
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  const filteredHistory = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = history.filter((h) => h.toLowerCase() !== q);
    if (!q) return base.slice(0, 8);
    return base.filter((h) => h.toLowerCase().includes(q)).slice(0, 8);
  }, [history, query]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
          <button
            onClick={resetAll}
            className="flex items-center gap-2 font-semibold text-lg tracking-tight"
          >
            <TornadoMark />
            Stormix
          </button>
          {state !== "empty" && (
            <form onSubmit={runSearch} className="flex-1 max-w-2xl mx-auto relative">
              <div className="flex items-center bg-background rounded-md border border-border overflow-hidden focus-within:border-primary">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setShowHistory(true)}
                  onBlur={() => setTimeout(() => setShowHistory(false), 150)}
                  placeholder="Ask Stormix…"
                  className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90"
                >
                  Search
                </button>
              </div>
              {showHistory && filteredHistory.length > 0 && (
                <HistoryDropdown
                  items={filteredHistory}
                  onPick={(v) => runSearch(undefined, v)}
                />
              )}
            </form>
          )}
        </div>
      </header>

      <main className="flex-1">
        {state === "empty" && (
          <EmptyState
            query={query}
            setQuery={setQuery}
            onSubmit={runSearch}
            inputRef={inputRef}
            history={filteredHistory}
            showHistory={showHistory}
            setShowHistory={setShowHistory}
          />
        )}

        {state === "loading" && <LoadingState query={query} />}

        {state === "results" && active && (
          <ResultsView
            active={active}
            results={results}
            activeId={active.id}
            setActiveId={selectActive}
            usedTags={usedTags}
            videoInfo={videoInfo}
            loadingVideo={loadingVideo}
          />
        )}
      </main>

      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        Stormix · Search inside YouTube videos
      </footer>
    </div>
  );
}

function TornadoMark() {
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-sm bg-primary text-primary-foreground font-black">
      S
    </span>
  );
}

function HistoryDropdown({
  items,
  onPick,
}: {
  items: string[];
  onPick: (v: string) => void;
}) {
  return (
    <div className="absolute left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-20 overflow-hidden">
      <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
        Recent searches
      </div>
      {items.map((h) => (
        <button
          key={h}
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            onPick(h);
          }}
          className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center gap-2"
        >
          <span className="text-muted-foreground">↻</span>
          <span className="truncate">{h}</span>
        </button>
      ))}
    </div>
  );
}

function EmptyState({
  query,
  setQuery,
  onSubmit,
  inputRef,
  history,
  showHistory,
  setShowHistory,
}: {
  query: string;
  setQuery: (v: string) => void;
  onSubmit: (e?: React.FormEvent, override?: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  history: string[];
  showHistory: boolean;
  setShowHistory: (v: boolean) => void;
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 flex flex-col items-center text-center">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
        Search <span className="text-primary">Stormix</span> understands YouTube videos
      </h1>
      <p className="mt-3 text-muted-foreground">
        Currently optimized for Claude, Codex, Cursor, AI Agents, Vibe coding.
      </p>
      <form
        onSubmit={(e) => onSubmit(e)}
        className="mt-10 w-full relative"
      >
        <div className="flex items-center bg-card rounded-lg border border-border overflow-hidden shadow-sm focus-within:border-primary">
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowHistory(true)}
            onBlur={() => setTimeout(() => setShowHistory(false), 150)}
            placeholder="e.g. Claude design system, MCP connectors, Cursor agent mode…"
            className="flex-1 bg-transparent px-4 py-4 outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="m-1 px-5 py-3 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:opacity-90"
          >
            Search
          </button>
        </div>
        {showHistory && history.length > 0 && (
          <HistoryDropdown items={history} onPick={(v) => onSubmit(undefined, v)} />
        )}
      </form>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {["Claude Design", "MCP connectors", "Cursor rules", "Codex CLI"].map(
          (s) => (
            <button
              key={s}
              onClick={() => onSubmit(undefined, s)}
              className="px-3 py-1.5 text-xs rounded-full border border-border bg-card hover:border-primary hover:text-primary transition-colors"
            >
              {s}
            </button>
          ),
        )}
      </div>
    </div>
  );
}

function LoadingState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-5">
      <div className="tornado">
        <span /><span /><span /><span /><span />
      </div>
      <div className="text-sm text-muted-foreground">
        Searching for <span className="text-foreground">“{query}”</span>…
      </div>
    </div>
  );
}

function ResultsView({
  active,
  results,
  activeId,
  setActiveId,
  usedTags,
  videoInfo,
  loadingVideo,
}: {
  active: SearchResult;
  results: SearchResult[];
  activeId: string;
  setActiveId: (id: string) => void;
  usedTags: string[];
  videoInfo: VideoInfo | null;
  loadingVideo: boolean;
}) {
  const ytId = getYouTubeId(active.payload.url);
  const rest = results.filter((r) => r.id !== activeId);

  // Set of segmentIds that were search matches for this video
  const matchedSegIds = useMemo(
    () =>
      new Set(
        results
          .filter((r) => r.payload.videoId === active.payload.videoId)
          .map((r) => r.payload.segmentId),
      ),
    [results, active.payload.videoId],
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
      {/* Sidebar: full video timeline */}
      <aside className="hidden lg:block">
        <div className="sticky top-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Video timeline
            </div>
            {loadingVideo && (
              <span className="text-[10px] text-muted-foreground">loading…</span>
            )}
          </div>
          <div className="space-y-1 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1">
            {(videoInfo?.segments ?? []).map((seg) => {
              const isMatch = matchedSegIds.has(seg.segmentId);
              const isActive = seg.segmentId === active.payload.segmentId;
              return (
                <div
                  key={seg.segmentId}
                  className={
                    "rounded-md border transition-colors " +
                    (isActive
                      ? "border-primary bg-primary/10"
                      : isMatch
                        ? "border-primary/50 bg-primary/5"
                        : "border-border bg-card")
                  }
                >
                  <button
                    onClick={() => {
                      // If this matched segment exists in results, select it
                      const found = results.find(
                        (r) => r.payload.segmentId === seg.segmentId,
                      );
                      if (found) setActiveId(found.id);
                    }}
                    className="w-full text-left px-3 py-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[11px] font-mono text-muted-foreground">
                        {formatTime(seg.start)} – {formatTime(seg.end)}
                      </div>
                      <span className="text-[9px] uppercase text-muted-foreground">
                        {langFromId(seg.languageId)}
                      </span>
                    </div>
                    <div className="text-xs mt-0.5 line-clamp-2">
                      {seg.primaryTopic}
                    </div>
                    {isMatch && (
                      <div className="mt-1.5 text-[10px] text-primary flex items-center gap-1">
                        <span>✦</span>
                        <span>This is from your search</span>
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
            {!videoInfo && !loadingVideo && (
              <div className="text-xs text-muted-foreground px-3 py-2">
                No timeline available.
              </div>
            )}
          </div>
        </div>
      </aside>

      <section className="min-w-0">
        {usedTags.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted-foreground">Detected tags:</span>
            {usedTags.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="rounded-lg border border-primary/40 bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-primary/10">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Best Match
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              {formatTime(active.payload.start)} – {formatTime(active.payload.end)}
            </span>
          </div>
          <div className="aspect-video bg-black">
            {ytId && (
              <iframe
                key={active.id}
                src={`https://www.youtube.com/embed/${ytId}?start=${active.payload.start}&autoplay=1&rel=0`}
                title={active.payload.primaryTopic}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            )}
          </div>
          <div className="p-4">
            <h2 className="text-lg font-semibold">{active.payload.primaryTopic}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {active.payload.summary}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {active.payload.tags.map((t) => (
                <TagBadge key={t} tag={t} highlight={usedTags.includes(t)} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            More results
          </h3>
          <div className="grid gap-3">
            {rest.map((r, i) => (
              <ResultCard
                key={r.id}
                rank={i + 2}
                result={r}
                onClick={() => setActiveId(r.id)}
                usedTags={usedTags}
              />
            ))}
            {rest.length === 0 && (
              <div className="text-sm text-muted-foreground">
                No additional results.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function ResultCard({
  rank,
  result,
  onClick,
  usedTags,
}: {
  rank: number;
  result: SearchResult;
  onClick: () => void;
  usedTags: string[];
}) {
  const p = result.payload;
  const thumb = ytThumb(p.url);
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      className="cursor-pointer text-left rounded-lg border border-border bg-card p-4 hover:border-primary/60 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 shrink-0 rounded-md bg-muted text-xs font-mono flex items-center justify-center text-muted-foreground">
          {rank}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-medium text-sm">{p.primaryTopic}</h4>
            <span className="text-[11px] font-mono text-muted-foreground">
              {formatTime(p.start)} – {formatTime(p.end)}
            </span>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
            {p.summary}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {p.tags.map((t) => (
              <TagBadge key={t} tag={t} highlight={usedTags.includes(t)} />
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="text-[11px] font-mono text-muted-foreground">
            {(result.score * 100).toFixed(0)}%
          </div>
          {thumb && (
            <div
              className="w-20 h-12 rounded overflow-hidden bg-black/50 border border-border pointer-events-none select-none"
              aria-hidden="true"
            >
              <img
                src={thumb}
                alt=""
                className="w-full h-full object-cover opacity-80"
                draggable={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TagBadge({ tag, highlight }: { tag: string; highlight: boolean }) {
  return (
    <span
      className={
        "px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide border " +
        (highlight
          ? "bg-primary/15 text-primary border-primary/40"
          : "bg-muted text-muted-foreground border-border")
      }
    >
      {tag}
    </span>
  );
}

void TAG_VOCAB;
