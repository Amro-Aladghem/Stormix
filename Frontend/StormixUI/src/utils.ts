export function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const pad = (n: number) => n.toString().padStart(2, "0");
  if (hrs > 0) {
    return `${hrs}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}

export function getYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export function ytThumb(url: string): string | null {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
}

export function extractTags(text: string): string[] {
  const tags: string[] = [];
  const hashRegex = /#(\w+)/g;
  let match;
  while ((match = hashRegex.exec(text)) !== null) {
    if (!tags.includes(match[1].toLowerCase())) {
      tags.push(match[1].toLowerCase());
    }
  }
  const quoteRegex = /"([^"]+)"/g;
  while ((match = quoteRegex.exec(text)) !== null) {
    if (!tags.includes(match[1].toLowerCase())) {
      tags.push(match[1].toLowerCase());
    }
  }
  // Extract specific tech keywords as tags for visual highlights
  const common = ["mcp", "cursor", "claude", "react", "vite", "gemini", "agent", "coding", "vibe", "llm"];
  const lowercaseText = text.toLowerCase();
  common.forEach((word) => {
    if (lowercaseText.includes(word) && !tags.includes(word)) {
      tags.push(word);
    }
  });
  return tags;
}
