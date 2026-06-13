export const TAG_VOCAB = [
  "claude","cursor","codex","mcp","agents","skills","projects","artifacts",
  "connectors","prompting","vision","web-search","automation","workflow",
  "productivity","coding","integration","context","cli","api","sdk",
  "authentication","deployment","hosting","pricing","subscription",
  "account-setup","rag","vector-db","embeddings","tool-calling","memory",
  "vibe-coding","code-generation","code-review","debugging","refactoring",
  "testing","cursor-rules","agent-mode","codebase-chat","github","git",
  "terminal","fastapi","nextjs","react","python","dotnet","typescript",
];

export interface SearchResult {
  id: string;
  score: number;
  payload: {
    segmentId: string;
    videoId: string;
    start: number;
    end: number;
    summary: string;
    primaryTopic: string;
    questions: string[];
    tags: string[];
    language: string;
    url: string;
  };
}

export interface VideoSegment {
  segmentId: string;
  start: number;
  end: number;
  summary: string;
  primaryTopic: string;
  questions: string[];
  tags: string[];
  languageId: number;
}

export interface VideoInfo {
  videoId: string;
  segments: VideoSegment[];
  url: string;
}

export function langFromId(id: number): string {
  if (id === 1) return "ar";
  return "en";
}

export function extractTags(text: string): string[] {
  const words = text.toLowerCase().split(/\s+/).slice(0, 100);
  const found = new Set<string>();
  for (const w of words) {
    const clean = w.replace(/[^a-z0-9-]/g, "");
    if (TAG_VOCAB.includes(clean)) found.add(clean);
  }
  return Array.from(found);
}

export function getYouTubeId(url: string): string {
  const m = url.match(/(?:youtu\.be\/|v=)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : "";
}

export function ytThumb(url: string): string {
  const id = getYouTubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/mqdefault.jpg` : "";
}

export function formatTime(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
}

// Mock data
export const MOCK_RESULTS: SearchResult[] = [
  {
    id: "7133910c-fdda-485d-acd2-6c308e7e5451",
    score: 0.7740801,
    payload: {
      segmentId: "7133910c-fdda-485d-acd2-6c308e7e5451",
      videoId: "33e8ed41-4ec2-481c-8d4f-a47c2a5ce1c8",
      start: 0,
      end: 324,
      summary:
        "Introduction to Claude Design, explaining it as a powerful visual tool for branding, prototypes, and UI, powered by Opus 4.7.",
      primaryTopic: "What Is Claude Design",
      questions: [
        "What is Claude Design?",
        "How does Claude Design differ from other tools?",
        "What is Opus 4.7?",
      ],
      tags: ["claude", "vision", "productivity"],
      language: "en",
      url: "https://youtu.be/ovabeVoWrA0?si=fJyqNSB1410BSH1L",
    },
  },
  {
    id: "4bfb8be4-10b1-4e36-920c-1a379eb16832",
    score: 0.76250887,
    payload: {
      segmentId: "4bfb8be4-10b1-4e36-920c-1a379eb16832",
      videoId: "358a43bd-6c92-4bf2-849b-46bc667981e0",
      start: 1200,
      end: 1513,
      summary:
        "Explains creating custom skills and the Claude Design tool for UI/UX work.",
      primaryTopic: "Design & Custom Skills",
      questions: [
        "How to create custom skills?",
        "What is Claude Design used for?",
      ],
      tags: ["claude", "skills", "design", "productivity"],
      language: "en",
      url: "https://youtu.be/wZeOwqmSw84?si=qrqU6DOmwRDqBIWS",
    },
  },
  {
    id: "05581e0c-a4f5-4ef6-a303-473d4a2e6c41",
    score: 0.7441236,
    payload: {
      segmentId: "05581e0c-a4f5-4ef6-a303-473d4a2e6c41",
      videoId: "33e8ed41-4ec2-481c-8d4f-a47c2a5ce1c8",
      start: 1193,
      end: 1410,
      summary:
        "Structuring and creating the design system and markdown specifications for Tally.",
      primaryTopic: "Creating the Design System",
      questions: [
        "How to create a design system in Claude?",
        "What is a design markdown file?",
      ],
      tags: ["claude", "artifacts", "coding"],
      language: "en",
      url: "https://youtu.be/ovabeVoWrA0?si=fJyqNSB1410BSH1L",
    },
  },
  {
    id: "6cd2813d-ef43-4fb1-b7ef-1bc02cabe155",
    score: 0.7432424,
    payload: {
      segmentId: "6cd2813d-ef43-4fb1-b7ef-1bc02cabe155",
      videoId: "ab457eae-8165-428f-bd9b-2555f761cfb4",
      start: 0,
      end: 56,
      summary:
        "Introduction to Claude as an intelligent AI collaborator that helps break down complex projects.",
      primaryTopic: "Introduction",
      questions: ["What is Claude?", "How can AI help with complex projects?"],
      tags: ["claude", "productivity"],
      language: "en",
      url: "https://youtu.be/0vZ_UVLhSQQ?si=4htOh5ecgTApiwpd",
    },
  },
  {
    id: "cf04701e-7f97-4e2c-9647-c22735adfc0e",
    score: 0.7356476,
    payload: {
      segmentId: "cf04701e-7f97-4e2c-9647-c22735adfc0e",
      videoId: "ab457eae-8165-428f-bd9b-2555f761cfb4",
      start: 56,
      end: 170,
      summary:
        "Exploration of the Claude interface, including the sidebar, projects, and artifacts.",
      primaryTopic: "Interface and Features",
      questions: [
        "What features are in the sidebar?",
        "How do projects work in Claude?",
        "What are artifacts?",
      ],
      tags: ["claude", "projects", "artifacts"],
      language: "en",
      url: "https://youtu.be/0vZ_UVLhSQQ?si=4htOh5ecgTApiwpd",
    },
  },
  {
    id: "a1b2c3d4-0001-0000-0000-000000000001",
    score: 0.7201,
    payload: {
      segmentId: "a1b2c3d4-0001-0000-0000-000000000001",
      videoId: "33e8ed41-4ec2-481c-8d4f-a47c2a5ce1c8",
      start: 410,
      end: 720,
      summary:
        "Walks through prompting strategies for visual artifacts and iterating on UI variations.",
      primaryTopic: "Prompting for Design",
      questions: ["How to prompt for UI?", "Iterating on visual artifacts?"],
      tags: ["claude", "prompting", "artifacts"],
      language: "en",
      url: "https://youtu.be/ovabeVoWrA0?si=fJyqNSB1410BSH1L",
    },
  },
  {
    id: "a1b2c3d4-0002-0000-0000-000000000002",
    score: 0.7102,
    payload: {
      segmentId: "a1b2c3d4-0002-0000-0000-000000000002",
      videoId: "358a43bd-6c92-4bf2-849b-46bc667981e0",
      start: 60,
      end: 420,
      summary:
        "Overview of MCP connectors and how to wire external tools into Claude skills.",
      primaryTopic: "MCP & Connectors",
      questions: ["What is MCP?", "How to add connectors?"],
      tags: ["claude", "mcp", "connectors", "skills"],
      language: "en",
      url: "https://youtu.be/wZeOwqmSw84?si=qrqU6DOmwRDqBIWS",
    },
  },
];

// Build a mocked full-video info from search results for a given videoId
export function mockVideoInfo(videoId: string, all: SearchResult[]): VideoInfo {
  const matches = all.filter((r) => r.payload.videoId === videoId);
  const url = matches[0]?.payload.url ?? "";
  // Use matched segments as a base; fabricate a few extra segments around them
  const base: VideoSegment[] = matches.map((r) => ({
    segmentId: r.payload.segmentId,
    start: r.payload.start,
    end: r.payload.end,
    summary: r.payload.summary,
    primaryTopic: r.payload.primaryTopic,
    questions: r.payload.questions,
    tags: r.payload.tags,
    languageId: r.payload.language === "ar" ? 1 : 2,
  }));
  // Add a few synthetic surrounding segments to look like a real timeline
  const extras: VideoSegment[] = [];
  const maxEnd = base.reduce((m, s) => Math.max(m, s.end), 0);
  const filler = [
    { topic: "Setup & Installation", summary: "Walkthrough of the initial setup, accounts, and required tooling." },
    { topic: "Core Concepts", summary: "Key terminology and the mental model behind the workflow." },
    { topic: "Live Demo", summary: "End-to-end live demo applying the concepts to a real project." },
    { topic: "Q & A", summary: "Common audience questions and answers." },
    { topic: "Wrap Up", summary: "Recap and next steps." },
  ];
  let cursor = maxEnd + 30;
  for (const f of filler) {
    const start = cursor;
    const end = cursor + 180;
    extras.push({
      segmentId: `mock-${videoId}-${start}`,
      start,
      end,
      summary: f.summary,
      primaryTopic: f.topic,
      questions: [],
      tags: [],
      languageId: 2,
    });
    cursor = end + 15;
  }
  const segments = [...base, ...extras].sort((a, b) => a.start - b.start);
  return { videoId, segments, url };
}
