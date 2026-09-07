interface PlatformStreamInfo {
  platform: 'kick' | 'twitch' | 'youtube' | 'tiktok';
  isLive: boolean;
  configured: boolean;
  channelName: string;
  streamUrl: string;
  title?: string;
  category?: string;
  viewers?: number;
  thumbnailUrl?: string;
  startedAt?: string;
  followers?: number;
  error?: string;
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
  communityStats: {
    kickFollowers: number;
    tiktokFollowers: number;
    totalFollowers: number;
    formattedTotal: string;
  };
  cachedAt: string;
  nextRefreshInSeconds: number;
}

// Check Kick
async function checkKickLive(): Promise<{ info: PlatformStreamInfo; followers: number }> {
  const defaultInfo: PlatformStreamInfo = {
    platform: 'kick',
    isLive: false,
    configured: true,
    channelName: '7naka',
    streamUrl: 'https://kick.com/7naka',
    followers: 15937,
  };

  try {
    const res = await (fetch as any)('https://kick.com/api/v2/channels/7naka', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
      cf: { cacheTtl: 20, cacheEverything: true },
    });

    if (!res.ok) return { info: defaultInfo, followers: 15937 };

    const data: any = await res.json();
    const followers = Number(data?.followers_count) || 15937;
    const livestream = data?.livestream;

    if (livestream && livestream.is_live !== false) {
      return {
        followers,
        info: {
          platform: 'kick',
          isLive: true,
          configured: true,
          channelName: data?.user?.username || '7NAKA',
          streamUrl: 'https://kick.com/7naka',
          title: livestream.session_title || 'Live Stream',
          category: livestream.categories?.[0]?.name || 'Just Chatting',
          viewers: livestream.viewer_count ?? 0,
          followers,
          thumbnailUrl: livestream.thumbnail?.url,
          startedAt: livestream.created_at,
        },
      };
    }

    return {
      followers,
      info: {
        ...defaultInfo,
        followers,
      },
    };
  } catch (err: any) {
    return { info: defaultInfo, followers: 15937 };
  }
}

// Check Twitch
async function checkTwitchLive(): Promise<PlatformStreamInfo> {
  const defaultInfo: PlatformStreamInfo = {
    platform: 'twitch',
    isLive: false,
    configured: true,
    channelName: '7naka_',
    streamUrl: 'https://www.twitch.tv/7naka_',
  };

  try {
    const res = await (fetch as any)('https://gql.twitch.tv/gql', {
      method: 'POST',
      headers: {
        'Client-Id': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: 'query { user(login: "7naka_") { stream { id title viewersCount game { name } type } } }',
      }),
      cf: { cacheTtl: 20, cacheEverything: true },
    });

    if (res.ok) {
      const data: any = await res.json();
      const stream = data?.data?.user?.stream;
      if (stream && (stream.type === 'live' || stream.id)) {
        return {
          platform: 'twitch',
          isLive: true,
          configured: true,
          channelName: '7naka_',
          streamUrl: 'https://www.twitch.tv/7naka_',
          title: stream.title || 'Live on Twitch',
          category: stream.game?.name || 'Just Chatting',
          viewers: stream.viewersCount ?? 0,
        };
      }
    }
  } catch {
    // ignore
  }

  return defaultInfo;
}

// Check YouTube
async function checkYouTubeLive(): Promise<PlatformStreamInfo> {
  const defaultInfo: PlatformStreamInfo = {
    platform: 'youtube',
    isLive: false,
    configured: true,
    channelName: '@7NAKA1',
    streamUrl: 'https://www.youtube.com/@7NAKA1/live',
  };

  try {
    const res = await (fetch as any)('https://www.youtube.com/@7NAKA1/live', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      cf: { cacheTtl: 30, cacheEverything: true },
    });

    if (res.ok) {
      const html = await res.text();
      const isLive =
        html.includes('"isLive":true') ||
        (html.includes('"liveStreamability"') && !html.includes('"status":"LIVE_STREAM_OFFLINE"'));

      if (isLive) {
        const titleMatch = html.match(/<title>([^<]+)<\/title>/);
        let title = titleMatch ? titleMatch[1].replace(' - YouTube', '').trim() : 'Live on YouTube';
        return {
          platform: 'youtube',
          isLive: true,
          configured: true,
          channelName: '@7NAKA1',
          streamUrl: 'https://www.youtube.com/@7NAKA1/live',
          title,
          category: 'YouTube Live',
        };
      }
    }
  } catch {
    // ignore
  }

  return defaultInfo;
}

// Check TikTok
async function checkTikTokLive(): Promise<PlatformStreamInfo> {
  const defaultInfo: PlatformStreamInfo = {
    platform: 'tiktok',
    isLive: false,
    configured: true,
    channelName: '@7naka4',
    streamUrl: 'https://www.tiktok.com/@7naka4/live',
    followers: 8464,
  };

  const handles = ['7naka4', '7naka'];

  for (const handle of handles) {
    try {
      const apiUrl = `https://www.tiktok.com/api-live/user/room/?uniqueId=${handle}&sourceType=54&aid=1988`;
      const res = await (fetch as any)(apiUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': `https://www.tiktok.com/@${handle}`,
        },
        cf: { cacheTtl: 20, cacheEverything: true },
      });

      if (res.ok) {
        const json: any = await res.json();
        const user = json?.data?.user;
        const liveRoom = json?.data?.liveRoom;

        const userStatus = Number(user?.status);
        const roomStatus = Number(liveRoom?.status);

        const isExplicitlyLive = (userStatus === 2 || roomStatus === 2);
        const isOffline = (userStatus === 4 || roomStatus === 4 || (userStatus === 0 && roomStatus === 0));

        const isLive = isExplicitlyLive && !isOffline;

        if (isLive) {
          const uniqueId = user?.uniqueId || handle;
          let viewers: number | undefined;
          if (liveRoom?.liveRoomStats?.userCount) {
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
        }
      }
    } catch {
      // ignore
    }
  }

  return defaultInfo;
}

// Fetch TikTok Followers
async function fetchTikTokFollowers(handle: string): Promise<number> {
  try {
    const res = await (fetch as any)(`https://www.tiktok.com/@${handle}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      cf: { cacheTtl: 60, cacheEverything: true },
    });

    if (res.ok) {
      const html = await res.text();
      const match = html.match(/"followerCount":\s*(\d+)/);
      if (match && match[1]) {
        return parseInt(match[1], 10);
      }
    }
  } catch {
    // ignore
  }
  return 8464;
}

export async function onRequestGet() {
  try {
    const [{ info: kick, followers: kickFollowers }, twitch, youtube, tiktok, tiktokFollowers] =
      await Promise.all([
        checkKickLive(),
        checkTwitchLive(),
        checkYouTubeLive(),
        checkTikTokLive(),
        fetchTikTokFollowers('7naka4'),
      ]);

    let activePlatform: 'kick' | 'twitch' | 'youtube' | 'tiktok' | undefined;
    if (kick.isLive) activePlatform = 'kick';
    else if (twitch.isLive) activePlatform = 'twitch';
    else if (youtube.isLive) activePlatform = 'youtube';
    else if (tiktok.isLive) activePlatform = 'tiktok';

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

    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=25, s-maxage=25',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        isLive: false,
        error: err?.message || 'Server error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
