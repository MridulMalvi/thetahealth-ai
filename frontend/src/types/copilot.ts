export interface CopilotSourceCitation {
  source_type: "FIRESTORE_OPERATIONAL" | "BIGQUERY_HISTORICAL" | "VERTEX_FORECAST"
  entity_id: string
  label: string
  value_referenced: string
}

export interface CopilotActionLink {
  label: string
  path: string
  icon_name: string
}

export interface CopilotQueryRequest {
  query: string
  facility_id?: string
  role?: string
}

export interface CopilotQueryResponse {
  query: string
  answer: string
  confidence_score: number
  citations: CopilotSourceCitation[]
  suggested_followups: string[]
  action_links: CopilotActionLink[]
  answered_at: string
  guardrails_passed: boolean
}

export interface ChatMessage {
  id: string
  sender: "user" | "copilot"
  text: string
  timestamp: string
  responsePayload?: CopilotQueryResponse
  isTyping?: boolean
}
