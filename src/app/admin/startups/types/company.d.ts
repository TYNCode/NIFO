export interface StartupType {
  startup_id: number;
  startup_name: string;
  startup_url: string;
  startup_logo?: string;
  startup_description: string;
  startup_analyst_rating?: string;
  startup_gsi?: string;
  startup_partners?: string;
  startup_customers?: string;
  startup_usecases?: string;
  startup_solutions?: string;
  startup_industry?: string;
  startup_technology?: string;
  startup_overview?: string;
  startup_company_stage?: string;
  startup_country?: string;
  startup_founders_info?: string;
  startup_emails?: string;
  user_registration?: boolean;
  is_verified?: boolean;
}

export interface StartupNameType {
  startup_id: number;
  startup_name: string;
}

export interface StartupEditContext {
  startupId: number;
  mode: "edit" | "create";
} 
