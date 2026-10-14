interface CommunityStats {
  kickFollowers: number;
  tiktokFollowers: number;
  totalFollowers: number;
  formattedTotal: string;
  timestamp: string;
}

export async function onRequestGet(): Promise<Response> {
  let kickFollowers = 20036;
  let tiktokFollowers = 9998;

  // 1. Fetch Kick followers
  try {
    const res = await (fetch as any)('https://kick.com/api/v2/channels/7naka', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
      cf: { cacheTtl: 30, cacheEverything: true },
    });
    if (res.ok) {
      const data = await res.json() as any;
      if (data?.followers_count !== undefined && !isNaN(Number(data.followers_count))) {
        kickFollowers = Number(data.followers_count);
      }
    }
  } catch (err) {
    // Keep fallback
  }

  // 2. Fetch TikTok followers
  try {
    const res = await (fetch as any)('https://www.tiktok.com/@7naka4', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      cf: { cacheTtl: 60, cacheEverything: true },
    });
    if (res.ok) {
      const html = await res.text();
      const match = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/);
      if (match) {
        try {
          const parsed = JSON.parse(match[1]);
          const userDetail = parsed?.__DEFAULT_SCOPE__?.['webapp.user-detail']?.userInfo;
          if (userDetail?.stats?.followerCount) {
            tiktokFollowers = Number(userDetail.stats.followerCount);
          }
        } catch {}
      }
      const regexMatch = html.match(/"followerCount":\s*(\d+)/);
      if (regexMatch) {
        tiktokFollowers = Number(regexMatch[1]);
      }
    }
  } catch (err) {
    // Keep fallback
  }

  const totalFollowers = kickFollowers + tiktokFollowers;

  const result: CommunityStats = {
    kickFollowers,
    tiktokFollowers,
    totalFollowers,
    formattedTotal: totalFollowers.toLocaleString(),
    timestamp: new Date().toISOString(),
  };

  return new Response(JSON.stringify(result), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=30, s-maxage=30',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
