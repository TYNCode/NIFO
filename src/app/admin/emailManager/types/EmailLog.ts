export interface EmailLog {
  id: number;
  recipient_name: string;
  recipient_email: string;
  context: {
    name: string;
    email: string;
    link?: string;
  };
  template_used: string;
  status: "sent" | "failed";
  error_message?: string;
  sent_at: string;
} 