interface Notifications {
  likes: boolean;
  comments: boolean;
  newFollowers: boolean;
  directMessages: boolean;
}

interface StoryHighlight {
  id: number;
  title: string;
  coverImage: string;
  stories: number[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  bio?: string;
  website?: string;
  phone?: string;
  gender?: string;
  birthdate?: string; // ISO 날짜 문자열
  profileimage?: string;
  posts: number;
  followers: number;
  following: number;
  isVerified: boolean;
  createdAt: string;  // ISO 날짜 문자열
  updatedAt: string;  // ISO 날짜 문자열
  isPrivate: boolean;
  notifications: Notifications;
  language: string;

  lastLogin?: string;  // ISO 날짜 문자열
  statusMessage?: string;
  storiesSeen?: number[];
  savedPosts?: number[];
  blockedUsers?: number[];
  storyHighlights?: StoryHighlight[];

  twoFactorEnabled?: boolean;
  authProvider?: string;  // 예: 'email', 'google' 등
  
}


