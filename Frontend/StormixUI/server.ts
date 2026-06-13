import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Lazy initializer for Gemini API client to prevent crashing if the key is missing on start
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is not defined. Please add it to your secrets in Settings.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// In-memory cache for loaded videos to speed up detail requests
interface VideoSegment {
  segmentId: string;
  start: number;
  end: number;
  languageId: string;
  primaryTopic: string;
  summary: string;
  tags: string[];
}

interface VideoCache {
  videoId: string;
  videoTitle: string;
  segments: VideoSegment[];
}

const memoryVideoCache = new Map<string, VideoCache>();

// Simple YouTube URL extractor helper
function extractYouTubeIdFromText(text: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = text.trim().match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// Search result type
interface SearchResultPayload {
  videoId: string;
  segmentId: string;
  url: string;
  start: number;
  end: number;
  primaryTopic: string;
  summary: string;
  tags: string[];
}

interface SearchResult {
  id: string;
  score: number;
  payload: SearchResultPayload;
}

// Gemini Response schemas
const searchResponseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      videoId: {
        type: Type.STRING,
        description: "The actual YouTube video 11-character ID (like dQw4w9WgXcQ) parsed from the search results.",
      },
      url: {
        type: Type.STRING,
        description: "The full YouTube watch URL (e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ).",
      },
      videoTitle: {
        type: Type.STRING,
        description: "The actual clean title of this YouTube video.",
      },
      score: {
        type: Type.NUMBER,
        description: "Relevance confidence score, must be between 0.80 and 1.00.",
      },
      segments: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            start: {
              type: Type.INTEGER,
              description: "Approximate start time in seconds (e.g. 0, 90, 240). Must be chronological.",
            },
            end: {
              type: Type.INTEGER,
              description: "Approximate end time of this segment in seconds. Must be larger than start.",
            },
            primaryTopic: {
              type: Type.STRING,
              description: "Highly engaging, crisp header for this chapter or segment.",
            },
            summary: {
              type: Type.STRING,
              description: "2-3 sentences summarising the specific knowledge shared in this portion.",
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-5 relevant key lowercase tags or technical terms.",
            },
          },
          required: ["start", "end", "primaryTopic", "summary", "tags"],
        },
      },
    },
    required: ["videoId", "url", "videoTitle", "score", "segments"],
  },
};

const singleVideoResponseSchema = {
  type: Type.OBJECT,
  properties: {
    videoId: { type: Type.STRING, description: "The YouTube video ID." },
    videoTitle: { type: Type.STRING, description: "The title of the video" },
    segments: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          start: { type: Type.INTEGER, description: "Start time in seconds." },
          end: { type: Type.INTEGER, description: "End time in seconds." },
          primaryTopic: { type: Type.STRING },
          summary: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["start", "end", "primaryTopic", "summary", "tags"],
      },
    },
  },
  required: ["videoId", "videoTitle", "segments"],
};

// API Endpoint to search or parse YouTube videos
app.all("/api/v1/videos/search", async (req, res) => {
  try {
    const text = (req.body?.text || req.query?.text || req.query?.q || "").toString().trim();
    const tagsInput = req.body?.tags || [];

    if (!text) {
      res.status(400).json({ error: "Search query text is required" });
      return;
    }

    const ai = getGeminiClient();
    const directVideoId = extractYouTubeIdFromText(text);

    if (directVideoId) {
      // User entered a direct YouTube URL - analyze that specific video!
      console.log(`Analyzing direct YouTube URL with ID: ${directVideoId}`);
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Inspect the YouTube video with ID "${directVideoId}" or URL "https://www.youtube.com/watch?v=${directVideoId}". Provide high-quality structural segment timeline chapters with titles, descriptions and timestamps (start/end in seconds). Keep it accurate based on the video content, description or web metadata.`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: singleVideoResponseSchema,
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      const segments: VideoSegment[] = (parsed.segments || []).map((seg: any, idx: number) => ({
        segmentId: `${directVideoId}-seg-${idx}`,
        start: Number(seg.start) || 0,
        end: Number(seg.end) || 120,
        languageId: "en",
        primaryTopic: seg.primaryTopic || "Segment Topic",
        summary: seg.summary || "Summary of segment content.",
        tags: seg.tags || [],
      }));

      // Cache video details
      memoryVideoCache.set(directVideoId, {
        videoId: directVideoId,
        videoTitle: parsed.videoTitle || "Analyzed Video",
        segments,
      });

      // Map to SearchResult format
      const searchResults: SearchResult[] = segments.map((seg, idx) => ({
        id: `${directVideoId}_${idx}`,
        score: 1.0,
        payload: {
          videoId: directVideoId,
          segmentId: seg.segmentId,
          url: `https://www.youtube.com/watch?v=${directVideoId}`,
          start: seg.start,
          end: seg.end,
          primaryTopic: seg.primaryTopic,
          summary: seg.summary,
          tags: seg.tags,
        },
      }));

      res.json(searchResults);
    } else {
      // General semantic topic search
      console.log(`Searching YouTube and segmenting videos for: "${text}" with tags [${tagsInput.join(", ")}]`);
      
      const prompt = `Find 3-4 real, active YouTube videos relevant to the query "${text}".
${tagsInput.length > 0 ? `Focus on content matching these concept tags: ${tagsInput.join(", ")}.` : ""}
For each video, divide its timeline into 3-5 high-quality logical segments containing starting and ending points, clear topics, deep informational summaries, and descriptive tags. Please fetch actual active videos.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: searchResponseSchema,
          systemInstruction: "You are Stormix, an expert search engine designed to extract, analyze, and segment real YouTube content. Always prioritize using real videos and URL details from Google Search Grounding.",
        },
      });

      const parsedVideos = JSON.parse(response.text || "[]");
      const searchResults: SearchResult[] = [];

      for (const video of parsedVideos) {
        const videoId = video.videoId || "dQw4w9WgXcQ";
        const url = video.url || `https://www.youtube.com/watch?v=${videoId}`;
        const videoTitle = video.videoTitle || "Relevant Video";
        const score = video.score || 0.85;

        const segments: VideoSegment[] = (video.segments || []).map((seg: any, idx: number) => ({
          segmentId: `${videoId}-seg-${idx}`,
          start: Number(seg.start) || 0,
          end: Number(seg.end) || 60,
          languageId: "en",
          primaryTopic: seg.primaryTopic || "Topic Overview",
          summary: seg.summary || "Summary of information.",
          tags: seg.tags || [],
        }));

        // Store inside memory cache
        memoryVideoCache.set(videoId, {
          videoId,
          videoTitle,
          segments,
        });

        // Add to search results list
        segments.forEach((seg, idx) => {
          searchResults.push({
            id: `${videoId}_${idx}`,
            score,
            payload: {
              videoId,
              segmentId: seg.segmentId,
              url,
              start: seg.start,
              end: seg.end,
              primaryTopic: seg.primaryTopic,
              summary: seg.summary,
              tags: seg.tags,
            },
          });
        });
      }

      // Sort by score or topic relevance
      searchResults.sort((a, b) => b.score - a.score);
      res.json(searchResults);
    }
  } catch (error: any) {
    console.error("Error running search / analysis:", error);
    res.status(500).json({ error: error.message || "An error occurred during video analysis." });
  }
});

// API Endpoint to fetch full video details / timeline
app.get("/api/v1/videos/:id", async (req, res) => {
  try {
    const videoId = req.params.id;

    if (!videoId) {
      res.status(400).json({ error: "Video ID is required" });
      return;
    }

    // Check memory cache
    if (memoryVideoCache.has(videoId)) {
      console.log(`Cache hit for video details: ${videoId}`);
      res.json(memoryVideoCache.get(videoId));
      return;
    }

    // Cache miss: dynamically ask Gemini to build video segments
    console.log(`Cache miss for video details: ${videoId}. Querying Gemini...`);
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Search for detailed timeline chapters, topics and descriptions for YouTube video "https://www.youtube.com/watch?v=${videoId}". Structure this video's contents into 6-10 precise sequential segment chapters with start/end timestamps.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: singleVideoResponseSchema,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    const segments: VideoSegment[] = (parsed.segments || []).map((seg: any, idx: number) => ({
      segmentId: `${videoId}-seg-${idx}`,
      start: Number(seg.start) || 0,
      end: Number(seg.end) || 120,
      languageId: "en",
      primaryTopic: seg.primaryTopic || "Overview Topic",
      summary: seg.summary || "Summary description.",
      tags: seg.tags || [],
    }));

    const videoInfo: VideoCache = {
      videoId,
      videoTitle: parsed.videoTitle || "Video Overview",
      segments,
    };

    memoryVideoCache.set(videoId, videoInfo);
    res.json(videoInfo);
  } catch (error: any) {
    console.error("Error retrieving video timeline:", error);
    res.status(500).json({ error: error.message || "An error occurred while fetching video timeline." });
  }
});

// Vite Middleware & static file serving configuration
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production from dist folder
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Stormix server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  });
}

setupViteOrStatic();
