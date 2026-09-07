import express from 'express';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { createServer as createViteServer } from 'vite';

const execFileAsync = promisify(execFile);
const app = express();
const PORT = 3000;

app.use(express.json());

interface PlatformStreamInfo {
  platform: 'kick' | 'twitch' | 'youtube' | 'tiktok';
  isLive: boolean;
  configured: boolean;
  channelName: string;
  streamUrl: string;
  title?: string;
  category?: string;
  viewers?: number;
  followers?: number;
  thumbnailUrl?: string;
  startedAt?: string;
  error?: string;
}

interface CommunityStats {
  kickFollowers: number;
  tiktokFollowers: number;
  totalFollowers: number;
  formattedTotal: string;
}

interface LiveStatusResult {
  isLive: boolean;
  activePlatform?: 'kick' | 'twitch' | 'youtube' | 'tiktok';
  platforms: {
    kick: PlatformStreamInfo;
    twitch: PlatformStreamInfo;
    youtube: PlatformStreamInfo;
    tiktok: PlatformStreamInfo;
  };
  communityStats?: CommunityStats;
  cachedAt: string;
  nextRefreshInSeconds: number;
}

// In-memory cache for 30 seconds
let cachedStatus: LiveStatusResult | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 30 * 1000;

// Twitch token cache
let twitchAppToken: { token: string; expiresAt: number } | null = null;

async function getTwitchToken(clientId: string, clientSecret: string): Promise<string | null> {
  const now = Date.now();
  if (twitchAppToken && twitchAppToken.expiresAt > now + 60000) {
    return twitchAppToken.token;
  }

  try {
    const res = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}&grant_type=client_credentials`,
      { method: 'POST' }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { access_token: string; expires_in: number };
    twitchAppToken = {
      token: data.access_token,
      expiresAt: now + (data.expires_in || 3600) * 1000,
    };
    return data.access_token;
  } catch (err) {
    console.error('Failed to get Twitch token:', err);
    return null;
  }
}

let cachedKickFollowers = 15828;
let cachedTikTokFollowers = 8456;
let lastTikTokFollowerFetch = 0;

async function fetchTikTokFollowers(handle = '7naka4'): Promise<number> {
  if (Date.now() - lastTikTokFollowerFetch < 60000 && cachedTikTokFollowers > 0) {
    return cachedTikTokFollowers;
  }
  try {
    const res = await fetch(`https://www.tiktok.com/@${handle}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const html = await res.text();
      const match = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/);
      if (match) {
        const parsed = JSON.parse(match[1]);
        const userDetail = parsed?.__DEFAULT_SCOPE__?.['webapp.user-detail']?.userInfo;
        if (userDetail?.stats?.followerCount) {
          cachedTikTokFollowers = Number(userDetail.stats.followerCount);
          lastTikTokFollowerFetch = Date.now();
          return cachedTikTokFollowers;
        }
      }
      const regexMatch = html.match(/"followerCount":\s*(\d+)/);
      if (regexMatch) {
        cachedTikTokFollowers = Number(regexMatch[1]);
        lastTikTokFollowerFetch = Date.now();
        return cachedTikTokFollowers;
      }
    }
  } catch (err: any) {
    console.warn('Failed to fetch TikTok followers:', err?.message || err);
  }
  return cachedTikTokFollowers;
}

async function checkKickLive(): Promise<PlatformStreamInfo> {
  const defaultInfo: PlatformStreamInfo = {
    platform: 'kick',
    isLive: false,
    configured: true,
    channelName: '7naka',
    streamUrl: 'https://kick.com/7naka',
    followers: cachedKickFollowers,
  };

  try {
    // We use curl with browser User-Agent because Kick uses Cloudflare bot protection
    // which blocks Node's default TLS handshake with a 403 status.
    const { stdout } = await execFileAsync(
      'curl',
      [
        '-s',
        '--max-time',
        '6',
        '-A',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'https://kick.com/api/v2/channels/7naka',
      ],
      { maxBuffer: 1024 * 1024 }
    );

    if (!stdout || stdout.trim().startsWith('<')) {
      return defaultInfo;
    }

    const data = JSON.parse(stdout) as any;
    if (data?.followers_count && !isNaN(Number(data.followers_count))) {
      cachedKickFollowers = Number(data.followers_count);
    }

    const livestream = data?.livestream;

    if (livestream && livestream.is_live) {
      return {
        platform: 'kick',
        isLive: true,
        configured: true,
        channelName: data?.user?.username || '7naka',
        streamUrl: 'https://kick.com/7naka',
        title: livestream.session_title || 'Live Broadcast',
        category: livestream.categories?.[0]?.name || livestream.category?.name || 'Gaming / Chatting',
        viewers: livestream.viewer_count ?? 0,
        followers: cachedKickFollowers,
        thumbnailUrl: livestream.thumbnail?.url,
        startedAt: livestream.created_at,
      };
    }

    return {
      ...defaultInfo,
      followers: cachedKickFollowers,
    };
  } catch (err: any) {
    return { ...defaultInfo, error: err.message || 'Kick check failed' };
  }
}

async function checkTwitchLive(): Promise<PlatformStreamInfo> {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  const defaultInfo: PlatformStreamInfo = {
    platform: 'twitch',
    isLive: false,
    configured: true,
    channelName: '7naka_',
    streamUrl: 'https://www.twitch.tv/7naka_',
  };

  // If Helix credentials are provided, try official Helix API
  if (clientId && clientSecret) {
    try {
      const token = await getTwitchToken(clientId, clientSecret);
      if (token) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const res = await fetch('https://api.twitch.tv/helix/streams?user_login=7naka_', {
          headers: {
            'Client-ID': clientId,
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (res.ok) {
          const data = (await res.json()) as any;
          const stream = data?.data?.[0];
          if (stream && stream.type === 'live') {
            return {
              platform: 'twitch',
              isLive: true,
              configured: true,
              channelName: '7naka_',
              streamUrl: 'https://www.twitch.tv/7naka_',
              title: stream.title || 'Live on Twitch',
              category: stream.game_name || 'Just Chatting',
              viewers: stream.viewer_count ?? 0,
              thumbnailUrl: stream.thumbnail_url?.replace('{width}', '640').replace('{height}', '360'),
              startedAt: stream.started_at,
            };
          }
        }
      }
    } catch {
      // Fall through to public Twitch GQL check
    }
  }

  // Public Twitch GQL check (instant, no auth key required)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch('https://gql.twitch.tv/gql', {
      method: 'POST',
      headers: {
        'Client-Id': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: 'query { user(login: "7naka_") { stream { id title viewersCount game { name } type } } }',
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = (await res.json()) as any;
      const stream = data?.data?.user?.stream;
      if (stream && stream.type === 'live') {
        return {
          platform: 'twitch',
          isLive: true,
          configured: true,
          channelName: '7naka_',
          streamUrl: 'https://www.twitch.tv/7naka_',
          title: stream.title || 'Live on Twitch',
          category: stream.game?.name || 'Just Chatting',
          viewers: stream.viewersCount ?? 0,
          thumbnailUrl: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_7naka_-640x360.jpg',
        };
      }
    }

    return defaultInfo;
  } catch (err: any) {
    return { ...defaultInfo, error: err.message || 'Twitch check failed' };
  }
}

async function checkYouTubeLive(): Promise<PlatformStreamInfo> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  const defaultInfo: PlatformStreamInfo = {
    platform: 'youtube',
    isLive: false,
    configured: true,
    channelName: '@7NAKA1',
    streamUrl: 'https://www.youtube.com/@7NAKA1/live',
  };

  if (apiKey) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UCio-waAizPoeUd_PmLXk5DA&eventType=live&type=video&key=${encodeURIComponent(apiKey)}`,
        { signal: controller.signal }
      );
      clearTimeout(timeout);

      if (res.ok) {
        const data = (await res.json()) as any;
        const liveItem = data?.items?.[0];

        if (liveItem) {
          return {
            platform: 'youtube',
            isLive: true,
            configured: true,
            channelName: '@7NAKA1',
            streamUrl: `https://www.youtube.com/watch?v=${liveItem.id?.videoId}`,
            title: liveItem.snippet?.title || 'Live on YouTube',
            category: 'YouTube Gaming',
            thumbnailUrl: liveItem.snippet?.thumbnails?.high?.url || liveItem.snippet?.thumbnails?.medium?.url,
            startedAt: liveItem.snippet?.publishedAt,
          };
        }
      }
    } catch {
      // Fall through to public HTML check
    }
  }

  // Public YouTube Channel Live check
  try {
    const { stdout } = await execFileAsync(
      'curl',
      [
        '-sL',
        '--max-time',
        '6',
        '-A',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'https://www.youtube.com/channel/UCio-waAizPoeUd_PmLXk5DA/live',
      ],
      { maxBuffer: 10 * 1024 * 1024 }
    );

    if (stdout && (stdout.includes('"text":"LIVE"') || stdout.includes('"isLive":true'))) {
      const videoIdMatch = stdout.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
      const titleMatch = stdout.match(/"title":\{"runs":\[\{"text":"([^"]+)"\}/) || stdout.match(/<title>([^<]+)<\/title>/);
      const videoId = videoIdMatch?.[1];

      return {
        platform: 'youtube',
        isLive: true,
        configured: true,
        channelName: '@7NAKA1',
        streamUrl: videoId ? `https://www.youtube.com/watch?v=${videoId}` : 'https://www.youtube.com/@7NAKA1/live',
        title: titleMatch?.[1] ? titleMatch[1].replace(' - YouTube', '').trim() : 'Live on YouTube',
        category: 'YouTube Gaming',
        thumbnailUrl: videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : undefined,
      };
    }

    return defaultInfo;
  } catch (err: any) {
    return { ...defaultInfo, error: err.message || 'YouTube check failed' };
  }
}

let currentTikTokViewers: number | undefined = undefined;
let tiktokConnection: any = null;
let isConnectingTikTok = false;

async function ensureTikTokViewerTracker(handle = '7naka4') {
  if (tiktokConnection || isConnectingTikTok) return;
  isConnectingTikTok = true;

  try {
    const { TikTokLiveConnection } = await import('tiktok-live-connector');
    const conn: any = new (TikTokLiveConnection as any)(handle, {});

    conn.on('roomUser', (msg: any) => {
      if (msg && msg.total) {
        const count = Number(msg.total);
        if (!isNaN(count) && count > 0) {
          currentTikTokViewers = count;
        }
      }
    });

    conn.on('member', (msg: any) => {
      if (msg && msg.memberCount) {
        const count = Number(msg.memberCount);
        if (!isNaN(count) && count > 0) {
          currentTikTokViewers = count;
        }
      }
    });

    conn.on('streamEnd', () => {
      currentTikTokViewers = undefined;
      stopTikTokViewerTracker();
    });

    conn.on('disconnected', () => {
      stopTikTokViewerTracker();
    });

    await conn.connect();
    tiktokConnection = conn;
  } catch (err: any) {
    console.warn('Failed to start TikTok viewer tracker:', err?.message || err);
    stopTikTokViewerTracker();
  } finally {
    isConnectingTikTok = false;
  }
}

function stopTikTokViewerTracker() {
  if (tiktokConnection) {
    try {
      tiktokConnection.disconnect();
    } catch {
      // ignore
    }
    tiktokConnection = null;
  }
  isConnectingTikTok = false;
}

async function checkTikTokLive(): Promise<PlatformStreamInfo> {
  const defaultInfo: PlatformStreamInfo = {
    platform: 'tiktok',
    isLive: false,
    configured: true,
    channelName: '@7naka4',
    streamUrl: 'https://www.tiktok.com/@7naka4/live',
  };

  const handles = ['7naka4', '7naka'];

  for (const handle of handles) {
    try {
      const apiUrl = `https://www.tiktok.com/api-live/user/room/?uniqueId=${handle}&sourceType=54&aid=1988`;
      const res = await fetch(apiUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': `https://www.tiktok.com/@${handle}`,
        },
        signal: AbortSignal.timeout(6000),
      });

      if (res.ok) {
        const json: any = await res.json();
        const user = json?.data?.user;
        const liveRoom = json?.data?.liveRoom;

        // TikTok API status rules:
        // status === 2 : Live stream is actively broadcasting
        // status === 4 : Stream ended / offline
        // status === 0 : Offline
        // IMPORTANT: user.roomId persists long after stream ends, so never rely on roomId alone!
        const userStatus = Number(user?.status);
        const roomStatus = Number(liveRoom?.status);

        const isExplicitlyLive = (userStatus === 2 || roomStatus === 2);
        const isOffline = (userStatus === 4 || roomStatus === 4 || (userStatus === 0 && roomStatus === 0));

        const isLive = isExplicitlyLive && !isOffline;

        if (isLive) {
          const uniqueId = user?.uniqueId || handle;

          // Ensure background real-time viewer stream is connected
          if (!currentTikTokViewers && !tiktokConnection) {
            await Promise.race([
              ensureTikTokViewerTracker(uniqueId),
              new Promise((r) => setTimeout(r, 2000)),
            ]);
          } else {
            ensureTikTokViewerTracker(uniqueId).catch(() => {});
          }

          let viewers = currentTikTokViewers;
          if (!viewers && liveRoom?.liveRoomStats?.userCount) {
            const parsed = Number(liveRoom.liveRoomStats.userCount);
            if (parsed > 0) viewers = parsed;
          }

          return {
            platform: 'tiktok',
            isLive: true,
            configured: true,
            channelName: `@${uniqueId}`,
            streamUrl: `https://www.tiktok.com/@${uniqueId}/live`,
            title: liveRoom?.title || (user?.nickname ? `${user.nickname} is LIVE on TikTok` : 'Live Stream on TikTok'),
            category: 'TikTok LIVE',
            viewers,
            thumbnailUrl: liveRoom?.coverUrl || user?.avatarLarger || user?.avatarMedium || undefined,
          };
        } else {
          stopTikTokViewerTracker();
          currentTikTokViewers = undefined;
        }
      }
    } catch (err: any) {
      console.warn(`Error checking TikTok live for @${handle}:`, err?.message || err);
    }
  }

  return defaultInfo;
}

// API Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Live Status endpoint
app.get('/api/live-status', async (req, res) => {
  const now = Date.now();
  const forceRefresh = req.query.force === 'true';

  if (!forceRefresh && cachedStatus && now - lastCacheTime < CACHE_TTL_MS) {
    return res.json({
      ...cachedStatus,
      nextRefreshInSeconds: Math.max(1, Math.round((CACHE_TTL_MS - (now - lastCacheTime)) / 1000)),
    });
  }

  try {
    const [kick, twitch, youtube, tiktok] = await Promise.all([
      checkKickLive(),
      checkTwitchLive(),
      checkYouTubeLive(),
      checkTikTokLive(),
    ]);

    let activePlatform: 'kick' | 'twitch' | 'youtube' | 'tiktok' | undefined;
    if (kick.isLive) activePlatform = 'kick';
    else if (twitch.isLive) activePlatform = 'twitch';
    else if (youtube.isLive) activePlatform = 'youtube';
    else if (tiktok.isLive) activePlatform = 'tiktok';

    const tiktokFollowers = await fetchTikTokFollowers('7naka4');
    const kickFollowers = cachedKickFollowers;
    const totalFollowers = kickFollowers + tiktokFollowers;

    const result: LiveStatusResult = {
      isLive: Boolean(activePlatform),
      activePlatform,
      platforms: {
        kick,
        twitch,
        youtube,
        tiktok: {
          ...tiktok,
          followers: tiktokFollowers,
        },
      },
      communityStats: {
        kickFollowers,
        tiktokFollowers,
        totalFollowers,
        formattedTotal: totalFollowers.toLocaleString(),
      },
      cachedAt: new Date().toISOString(),
      nextRefreshInSeconds: 30,
    };

    cachedStatus = result;
    lastCacheTime = now;

    res.json(result);
  } catch (error: any) {
    console.error('Error fetching live status:', error);
    res.status(500).json({
      isLive: false,
      error: 'Failed to aggregate stream status',
      platforms: {
        kick: { platform: 'kick', isLive: false, configured: true, channelName: '7naka', streamUrl: 'https://kick.com/7naka', followers: cachedKickFollowers },
        twitch: { platform: 'twitch', isLive: false, configured: true, channelName: '7naka_', streamUrl: 'https://www.twitch.tv/7naka_' },
        youtube: { platform: 'youtube', isLive: false, configured: true, channelName: '@7NAKA1', streamUrl: 'https://www.youtube.com/@7NAKA1/live' },
        tiktok: { platform: 'tiktok', isLive: false, configured: true, channelName: '@7naka4', streamUrl: 'https://www.tiktok.com/@7naka4/live', followers: cachedTikTokFollowers },
      },
      communityStats: {
        kickFollowers: cachedKickFollowers,
        tiktokFollowers: cachedTikTokFollowers,
        totalFollowers: cachedKickFollowers + cachedTikTokFollowers,
        formattedTotal: (cachedKickFollowers + cachedTikTokFollowers).toLocaleString(),
      },
      cachedAt: new Date().toISOString(),
      nextRefreshInSeconds: 10,
    });
  }
});

// Community Stats endpoint (followers from Kick & TikTok)
app.get('/api/community-stats', async (req, res) => {
  const tiktokFollowers = await fetchTikTokFollowers('7naka4');
  const kickFollowers = cachedKickFollowers;
  const totalFollowers = kickFollowers + tiktokFollowers;
  res.json({
    kickFollowers,
    tiktokFollowers,
    totalFollowers,
    formattedTotal: totalFollowers.toLocaleString(),
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`7NAKA Server running on http://0.0.0.0:${PORT}`);
    // Warm up TikTok live viewer tracker
    ensureTikTokViewerTracker('7naka4').catch(() => {});
  });
}

startServer();
