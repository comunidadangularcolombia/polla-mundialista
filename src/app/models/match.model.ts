export type MatchStatus = 'scheduled' | 'live' | 'finished';

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  status: MatchStatus;
  scheduledAt: string; // ISO 8601 or display date string like "Hoy, 20:00"
  minute?: number; // Only for LIVE matches
  homeFlag?: string; // Flag abbreviation or code (e.g. "BR", "AR")
  awayFlag?: string;
}
