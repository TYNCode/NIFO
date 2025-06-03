import { StartupType } from "../admin/startups/types/company";


export interface CompanyProfile {
  startup_id: number;
  startup_name: string;
  startup_description: string;
  startup_url: string;
  startup_country: string;
}

export interface ConversationType {
  question: string;
  response: {
    success: boolean;
    category: string;
    response: string;
    startups: Array<{
      name: string;
      description: string;
      database_info: StartupType;
    }>;
    steps?: Array<{
      step_number: number;
      step_description: string;
      startups: Array<{
        name: string;
        description: string;
        database_info: StartupType;
      }>;
    }>;
  };
}



export interface User {
  email: string;
  first_name: string;
}

export interface UserInfo {
  email:string;
  first_name:string;
  is_superuser:boolean;
  organization:number;
  is_primary_user : boolean
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


export interface Conversation {
  id?: number;
  role: string;
  message: string;
  created_time: string;
  session?: number;
}

export interface ChatHistoryResponse {
  id: number;
  session_id: string;
  created_time: string;
  conversations: Conversation[];
}


export interface FormData {
  first_name: string;
  email: string;
  organization_name:string;
  password: string;
  organization_id?: number;
}

export interface SpotlightContent {
  heading: string;
  body: string;
}




