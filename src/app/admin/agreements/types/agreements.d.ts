export interface Agreement {
  id: number;
  startup: number;
  startup_name: string;
  startup_logo: string;

  agreement_type: 'NDA' | 'RA';
  status: 'draft' | 'discussion' | 'pending_sp' | 'signed';

  start_date: string | null;
  end_date: string | null;
  completed_on: string | null;
  sent_on: string | null;
  received_on: string | null;
  sent_for_signature: string | null;

  clause_summary: string;
  renewal_number: number;
  notes: string;

  created_at: string;
  updated_at: string;
}

export interface GroupedAgreement {
  startup_id: number;
  startup_name: string;
  startup_logo: string;
  nda: {
    id: number;
    status: "draft" | "discussion" | "pending_sp" | "signed";
    start_date: string;
    end_date: string;
  } | null;
  ra: {
    id: number;
    status: "draft" | "discussion" | "pending_sp" | "signed";
    start_date: string;
    end_date: string;
  } | null;
  is_verified: boolean | null;
}

export interface AgreementEditContext {
  agreementId: number | null;
  startupId: number;
  type: 'NDA' | 'RA';
}