export interface Spotlight {
  id: number;
  spotlight_title: string;
  spotlight_subtitle: string;
  spotlight_category: string;
  spotlight_week: string;
  logo_url: string;
  problem_address: string;
  technology_leveraged: {
    body: string;
    heading: string;
  }[];
  use_case: string;
  impact: string;
  is_selected: boolean;
  is_tyn_verified: boolean;
  gartner_tag: "cool_vendor" | "magic_quadrant" | "hype_cycle" | "other" | null;
  sort_order: number;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  spotlight_startup: number;
}
