export interface Template {
  id: string;
  name: string;
  description: string;
  category: "invite" | "followup" | "engage";
  subject: string;
  preview: string;
  variables: string[];
} 