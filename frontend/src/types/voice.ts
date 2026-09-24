export interface ExtractedEntity {
  field_name: string
  value: any
  confidence: number
  source_snippet?: string
}

export interface ParsedReportResponse {
  intent: string
  overall_confidence: number
  entities: Record<string, ExtractedEntity>
  needs_clarification: boolean
  clarification_question?: string
  clarification_options?: string[]
  suggested_action: string
  raw_transcript: string
  parsed_at: string
}

export interface VoiceCommitResult {
  status: string
  transaction_id: string
  message: string
  facility_id: string
  committed_at: string
  updated_state_summary: Record<string, any>
}
