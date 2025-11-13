export interface NewUser {
  id: number;
  name: string;
  agency: {
    id: number;
    name: string;
  };
  role: {
    id: number;
    role: string;
  };
  picture: string | null;
}

export interface UsersByAgency {
  agency_id: number;
  agency_name: string;
  user_count: number;
}

export interface StatisticsResponse {
  total_users: number;
  new_users_this_month: NewUser[];
  active_users: number;
  inactive_users: number;
  users_by_agency: UsersByAgency[];
}

