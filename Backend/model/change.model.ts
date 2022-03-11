export interface Change {
  actor_id: number;
  is_admin: boolean;
  table: string;
  action: string;
  timestamp: string;
}
