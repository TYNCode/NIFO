export interface StartupType {
  startup_id: number;
  startup_name: string;
  startup_url: string;
  startup_gsi: string | null;
  startup_analyst_rating: string | null;
  startup_customers: string | null;
  startup_usecases: string | null;
  startup_solutions: string | null;
  startup_industry: string | null;
  startup_technology: string | null;
  startup_overview: string | null;
  startup_description: string | null;
  startup_company_stage: string | null;
  startup_country: string | null;
  startup_founders_info: string | null;
  startup_emails: string | null;
  startup_partners: string | null;
}


export interface User {
  email: string;
  first_name: string;
}

export interface UserInfo {
  email:string;
  first_name:string;
  is_superuser:boolean;
  organization:string | null;
}


export interface Request {
  id: number;
  assigned_to: any;
  query_status: string;
  created_at: string;
  assigned_status: boolean;
  to_growthtechfirm: {
    startup_id: number;
    startup_name: string;
    startup_url: string;
    startup_analyst_rating: string;
    startup_gsi: any;
    startup_partners: any;
    startup_customers: any;
    startup_usecases: string;
    startup_solutions: string;
    startup_industry: string;
    startup_technology: string;
    startup_overview: string;
    startup_description: string;
    startup_company_stage: string;
    startup_country: string;
    startup_founders_info: string;
    startup_emails: string;
  };
  from_user: {
    email: string;
    id: number;
    first_name: string;
    organization_name: string;
  };
  user_query: {
    id: number;
    query: string;
    timestamp: string;
    user: number;
  };
}

export interface Message {
  id: number;
  role: string;
  content: string;
  created_time: string;
  session: number;
}

export interface Session {
  id: number;
  session_id: string;
  created_time: string;
  messages: Message[];
}

export interface ChatHistoryResponse {
  id: number;
  session_id: string;
  created_time: string;
  messages: Message[];
}

export interface FormData {
  first_name?: string;
  email: string;
  organization_name?: string;
  password: string;
}

export interface SpotlightContent {
  heading: string;
  body: string;
}

export interface Spotlight {
  id:number
  spotlight_title: string;
  spotlight_content: SpotlightContent[];
  spotlight_img: string;
  created_at: string;
}

