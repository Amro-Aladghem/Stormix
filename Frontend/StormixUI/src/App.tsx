import React, { useEffect, useMemo, useRef, useState, FormEvent } from "react";
import { Search, Sparkles, LogOut, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { PersistedSearch, SearchResult, VideoInfo, ViewState } from "./types";
import { extractTags } from "./utils";

import TornadoMark from "./components/TornadoMark";
import HistoryDropdown from "./components/HistoryDropdown";
import EmptyState from "./components/EmptyState";
import LoadingState from "./components/LoadingState";
import ResultsView from "./components/ResultsView";

const SS_KEY = "stormix:lastSearch";
const LS_HISTORY = "stormix:history";

// Helper persistence functions
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

export default function App() {
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

  // Restore from storage on initial mount
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
    [results, activeId]
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
        const res = await fetch(`/api/v1/videos/${vid}`);
        if (res.ok) {
          info = (await res.json()) as VideoInfo;
        }
      } catch (err) {
        console.error("Error fetching video segments:", err);
      }
      
      if (!cancelled) {
        if (info) {
          setVideoInfo(info);
        } else {
          // Resilient fallback: build a temporary timeline based on matching results
          setVideoInfo({
            videoId: vid,
            segments: results
              .filter((r) => r.payload.videoId === vid)
              .map((r, i) => ({
                segmentId: r.payload.segmentId,
                start: r.payload.start,
                end: r.payload.end,
                primaryTopic: r.payload.primaryTopic,
                summary: r.payload.summary,
                tags: r.payload.tags,
              })),
          });
        }
        setLoadingVideo(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [active?.payload.videoId, results]);

  // Execute query against Express backend
  async function runSearch(e?: FormEvent, override?: string) {
    if (e) e.preventDefault();
    const text = (override ?? query).trim();
    if (!text) return;

    setQuery(text);
    setShowHistory(false);
    const tags = extractTags(text);
    setUsedTags(tags);
    setState("loading");
    setResults([]);
    setActiveId(null);
    setVideoInfo(null);

    try {
      const res = await fetch("/api/v1/videos/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, tags }),
      });
      
      if (res.ok) {
        const data = (await res.json()) as SearchResult[];
        if (data && data.length > 0) {
          const firstId = data[0]?.id ?? null;
          setResults(data);
          setActiveId(firstId);
          setState("results");
          pushHistory(text);
          setHistory(loadHistory());
          savePersisted({ query: text, usedTags: tags, results: data, activeId: firstId });
          return;
        }
      }
    } catch (err) {
      console.error("Failed running search:", err);
    }
    
    // Recovery path in case of zero search matches or error
    setState("empty");
    alert("Could not load any videos for this query. Let's try searching for another tech topic!");
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
    try {
      sessionStorage.removeItem(SS_KEY);
    } catch {}
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  const filteredHistory = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = history.filter((h) => h.toLowerCase() !== q);
    if (!q) return base.slice(0, 8);
    return base.filter((h) => h.toLowerCase().includes(q)).slice(0, 8);
  }, [history, query]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-all">
      {/* Upper Navigation Header bar */}
      <header className="h-14 border-b border-border bg-card px-6 flex items-center justify-between shrink-0 z-40 sticky top-0">
        <div className="flex-1 flex items-center justify-between gap-4">
          <button
            onClick={resetAll}
            className="flex items-center gap-3 font-bold text-xl tracking-tight select-none cursor-pointer focus:outline-none text-primary"
          >
            <TornadoMark />
            <span className="text-[#e8e2d4]">Stormix</span>
          </button>
          
          {state !== "empty" && (
            <form onSubmit={runSearch} className="flex-1 max-w-2xl px-8 relative">
              <div className="relative flex items-center bg-background rounded border border-[#444443] overflow-hidden focus-within:border-primary transition-colors">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setShowHistory(true)}
                  onBlur={() => setTimeout(() => setShowHistory(false), 200)}
                  placeholder="Ask Stormix…"
                  className="flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-[#666666]"
                />
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-primary text-primary-foreground uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer"
                >
                  Search
                </button>
              </div>

              <AnimatePresence>
                {showHistory && filteredHistory.length > 0 && (
                  <HistoryDropdown
                    items={filteredHistory}
                    onPick={(v) => {
                      setQuery(v);
                      runSearch(undefined, v);
                    }}
                  />
                )}
              </AnimatePresence>
            </form>
          )}

          {state !== "empty" && (
            <button
              onClick={resetAll}
              className="text-[#888888] hover:text-primary transition-all p-2 rounded text-xs cursor-pointer focus:outline-none flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-bold uppercase">Reset</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container Views */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {state === "empty" && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <EmptyState
                query={query}
                setQuery={setQuery}
                onSubmit={runSearch}
                history={filteredHistory}
                showHistory={showHistory}
                setShowHistory={setShowHistory}
              />
            </motion.div>
          )}

          {state === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <LoadingState query={query} />
            </motion.div>
          )}

          {state === "results" && active && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <ResultsView
                active={active}
                results={results}
                activeId={active.id}
                setActiveId={selectActive}
                usedTags={usedTags}
                videoInfo={videoInfo}
                loadingVideo={loadingVideo}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer bar status metrics */}
      <footer className="h-8 border-t border-border bg-[#1c1c1b] px-6 flex items-center justify-between shrink-0 text-[10px] text-[#555555] uppercase tracking-widest font-mono">
        <div>Engine: Stormix-V3-GeminiPowered</div>
        <div className="flex gap-6">
          <span>Latency: 28ms</span>
          <span>Results: Real-time Live Segments</span>
          <span className="text-primary/40 font-bold italic">Live: YouTube API Grounding</span>
        </div>
      </footer>
    </div>
  );
}
