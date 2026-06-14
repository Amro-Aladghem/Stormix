# Stormix 🌪️

> Search what YouTube videos actually contain, not just their titles.

Stormix is an AI-powered search engine designed for developers.

Instead of searching only by video titles or descriptions, Stormix indexes the actual content of videos and helps you find the exact segment where a topic is discussed.
<p align="center">
  <img
    width="750"
    height="350"
    alt="Stormix Screenshot"
    src="https://github.com/user-attachments/assets/c12cadbf-018c-4305-9f12-017176dc6eb1"
  />
</p>

## Why Stormix?

Finding technical content on YouTube can be frustrating.

You search for:

- "Claude Skills"
- "Cursor Rules"
- "Codex CLI"
- "MCP Authentication"

...and end up watching a 40-minute video just to find a 2-minute explanation.

Stormix aims to solve that problem.

## Features

- 🔍 Semantic search over video content
- ⏱️ Jump directly to the relevant timestamp
- 🧠 AI-generated summaries for video segments
- ❓ Question-aware indexing
- 🏷️ Tag-enhanced ranking
- 🎯 Primary topic extraction
- 📺 Embedded YouTube playback
- ⚡ Fast developer-focused search experience

https://github.com/user-attachments/assets/4eaccf32-72f0-4934-abad-aa8bf4182281

## Current Focus

Stormix is currently optimized for topics such as:

- Claude
- Cursor
- Codex
- MCP
- AI Agents
- Vibe Coding

Support for additional topics will expand over time.

## Search Strategy

Each indexed segment contains structured metadata such as:

- Summary
- Primary Topic
- Questions Answered
- Tags
- Timestamp Range

Search ranking combines semantic similarity with additional ranking signals to improve relevance.

## Example

User query:

```
How do I create Claude Skills?
```

Stormix returns:

- Best matching video
- Exact timestamp
- Summary
- Related questions
- Direct YouTube playback from that moment

Instead of manually searching through an hour-long video.

## Tech Stack

- .NET
- PostgreSQL
- Qdrant
- Gemini
- React
- TypeScript

## Status

🚧 Early development (Beta)

The search pipeline and indexing strategy are actively evolving.

## Vision

Stormix is not trying to replace YouTube.

Its goal is to make educational developer content dramatically easier to search, navigate, and consume.

---

Built by Amro Aladghem.
