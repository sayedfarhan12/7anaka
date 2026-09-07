export type PlatformType = 'kick' | 'twitch' | 'youtube' | 'tiktok' | 'instagram' | 'discord' | 'whatsapp';

export interface CommunityStats {
  kickFollowers: number;
  tiktokFollowers: number;
  totalFollowers: number;
  formattedTotal: string;
}

export interface PlatformStreamInfo {
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

export interface LiveStatusResponse {
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
  error?: string;
}

export interface SocialLink {
  id: PlatformType;
  name: string;
  username: string;
  url: string;
  description: string;
  brandColor: string;
  brandGradient: string;
  badge?: string;
}
