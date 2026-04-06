export type ResolvedVideoSource =
  | { kind: "empty"; src: ""; originalUrl: "" }
  | { kind: "iframe"; src: string; originalUrl: string }
  | { kind: "file"; src: string; originalUrl: string };

const FILE_PATTERN = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i;
const URL_WITH_PROTOCOL_PATTERN = /^[a-z][a-z0-9+.-]*:\/\//i;
const URL_LIKE_DOMAIN_PATTERN =
  /^(?:www\.)?(?:youtu\.be|youtube\.com|m\.youtube\.com|music\.youtube\.com|youtube-nocookie\.com|vimeo\.com|player\.vimeo\.com|bilibili\.com|player\.bilibili\.com)\b/i;

function normalizeExternalUrl(input: string): string {
  const trimmed = input.trim();

  if (!trimmed) {
    return "";
  }

  if (URL_WITH_PROTOCOL_PATTERN.test(trimmed)) {
    return trimmed;
  }

  if (URL_LIKE_DOMAIN_PATTERN.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return trimmed;
}

function appendAutoplay(url: string, enabled: boolean): string {
  if (!enabled) {
    return url;
  }

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}autoplay=1`;
}

function parseTimeToSeconds(value: string | null): number | null {
  if (!value) {
    return null;
  }

  if (/^\d+$/.test(value)) {
    return Number(value);
  }

  const matches = value.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/i);

  if (!matches) {
    return null;
  }

  const hours = Number(matches[1] || 0);
  const minutes = Number(matches[2] || 0);
  const seconds = Number(matches[3] || 0);
  const total = hours * 3600 + minutes * 60 + seconds;

  return total > 0 ? total : null;
}

function extractYouTubeIdFromPath(pathname: string, marker: string): string | null {
  if (!pathname.startsWith(marker)) {
    return null;
  }

  const id = pathname
    .slice(marker.length)
    .split("/")
    .filter(Boolean)[0];

  return id || null;
}

function buildYouTubeEmbedUrl(videoId: string, autoplay: boolean, startAt?: number | null): string {
  const embed = new URL(`https://www.youtube-nocookie.com/embed/${videoId}`);

  embed.searchParams.set("rel", "0");
  embed.searchParams.set("modestbranding", "1");
  embed.searchParams.set("playsinline", "1");

  if (autoplay) {
    embed.searchParams.set("autoplay", "1");
  }

  if (startAt && startAt > 0) {
    embed.searchParams.set("start", String(startAt));
  }

  return embed.toString();
}

function buildYouTubeEmbed(url: URL, autoplay: boolean): string | null {
  const host = url.hostname.replace(/^www\./, "");
  const startAt =
    parseTimeToSeconds(url.searchParams.get("start")) ||
    parseTimeToSeconds(url.searchParams.get("t")) ||
    parseTimeToSeconds(url.searchParams.get("time_continue"));

  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id ? buildYouTubeEmbedUrl(id, autoplay, startAt) : null;
  }

  if (
    host === "youtube.com" ||
    host === "m.youtube.com" ||
    host === "music.youtube.com" ||
    host === "youtube-nocookie.com"
  ) {
    if (url.pathname.startsWith("/watch")) {
      const id = url.searchParams.get("v") || url.searchParams.get("vi");
      return id ? buildYouTubeEmbedUrl(id, autoplay, startAt) : null;
    }

    const pathId =
      extractYouTubeIdFromPath(url.pathname, "/shorts/") ||
      extractYouTubeIdFromPath(url.pathname, "/embed/") ||
      extractYouTubeIdFromPath(url.pathname, "/live/") ||
      extractYouTubeIdFromPath(url.pathname, "/v/");

    if (pathId) {
      return buildYouTubeEmbedUrl(pathId, autoplay, startAt);
    }
  }

  return null;
}

function buildVimeoEmbed(url: URL, autoplay: boolean): string | null {
  const host = url.hostname.replace(/^www\./, "");

  if (host === "vimeo.com") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id ? appendAutoplay(`https://player.vimeo.com/video/${id}`, autoplay) : null;
  }

  if (host === "player.vimeo.com") {
    return appendAutoplay(url.toString(), autoplay);
  }

  return null;
}

function buildBilibiliEmbed(url: URL, autoplay: boolean): string | null {
  const host = url.hostname.replace(/^www\./, "");

  if (host === "bilibili.com" && url.pathname.startsWith("/video/")) {
    const bvid = url.pathname.split("/").filter(Boolean)[1];
    return bvid
      ? appendAutoplay(`https://player.bilibili.com/player.html?bvid=${bvid}&page=1`, autoplay)
      : null;
  }

  if (host === "player.bilibili.com") {
    return appendAutoplay(url.toString(), autoplay);
  }

  return null;
}

export function resolveVideoSource(url: string, autoplay = false): ResolvedVideoSource {
  const trimmed = normalizeExternalUrl(url);

  if (!trimmed) {
    return {
      kind: "empty",
      src: "",
      originalUrl: ""
    };
  }

  if (FILE_PATTERN.test(trimmed)) {
    return {
      kind: "file",
      src: trimmed,
      originalUrl: trimmed
    };
  }

  try {
    const parsed = new URL(trimmed);
    const youtube = buildYouTubeEmbed(parsed, autoplay);
    const vimeo = buildVimeoEmbed(parsed, autoplay);
    const bilibili = buildBilibiliEmbed(parsed, autoplay);

    return {
      kind: "iframe",
      src: youtube || vimeo || bilibili || appendAutoplay(parsed.toString(), autoplay),
      originalUrl: parsed.toString()
    };
  } catch {
    return {
      kind: "iframe",
      src: trimmed,
      originalUrl: trimmed
    };
  }
}
