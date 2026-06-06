export interface UserStats {
  totalPoints: number;
  accuracy: number; // Percentage (e.g. 68)
  globalRank: number; // Position (e.g. 42)
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}
