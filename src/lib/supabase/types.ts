export type NodeType = 'room' | 'furniture' | 'container' | 'item'
export type HistoryAction = 'created' | 'moved' | 'disposed' | 'renamed' | 'restored'

export interface NodeMetadata {
  expiry_date?: string   // ISO date string
  quantity?: number
  unit?: string
  serial_number?: string
  warranty_until?: string
  [key: string]: unknown
}

export interface NodePosition {
  x: number
  y: number
  w: number
  h: number
}

export type Database = {
  public: {
    Tables: {
      households: {
        Row: { id: string; name: string; created_at: string }
        Insert: { id?: string; name: string; created_at?: string }
        Update: { name?: string }
      }
      household_members: {
        Row: { household_id: string; user_id: string; joined_at: string }
        Insert: { household_id: string; user_id: string; joined_at?: string }
        Update: never
      }
      household_invites: {
        Row: {
          id: string; household_id: string; token: string
          created_by: string | null; expires_at: string
          used_at: string | null; created_at: string
        }
        Insert: {
          id?: string; household_id: string; token?: string
          created_by?: string | null; expires_at?: string
        }
        Update: { used_at?: string }
      }
      nodes: {
        Row: {
          id: string; household_id: string; parent_id: string | null
          name: string; type: NodeType; description: string | null
          photo_url: string | null; qr_uuid: string | null
          position: NodePosition | null; metadata: NodeMetadata | null
          archived: boolean; archived_at: string | null
          created_by: string | null; created_at: string; updated_at: string
        }
        Insert: {
          id?: string; household_id: string; parent_id?: string | null
          name: string; type: NodeType; description?: string | null
          photo_url?: string | null; qr_uuid?: string | null
          position?: NodePosition | null; metadata?: NodeMetadata | null
          archived?: boolean; archived_at?: string | null
          created_by?: string | null
        }
        Update: {
          parent_id?: string | null; name?: string; type?: NodeType
          description?: string | null; photo_url?: string | null
          qr_uuid?: string | null; position?: NodePosition | null
          metadata?: NodeMetadata | null; archived?: boolean
          archived_at?: string | null
        }
      }
      node_history: {
        Row: {
          id: string; node_id: string; action: HistoryAction
          from_parent_id: string | null; to_parent_id: string | null
          metadata: Record<string, unknown> | null
          performed_by: string | null; created_at: string
        }
        Insert: {
          id?: string; node_id: string; action: HistoryAction
          from_parent_id?: string | null; to_parent_id?: string | null
          metadata?: Record<string, unknown> | null; performed_by?: string | null
        }
        Update: never
      }
      push_subscriptions: {
        Row: { id: string; user_id: string; subscription: object; created_at: string }
        Insert: { id?: string; user_id: string; subscription: object }
        Update: never
      }
      ai_recognition_usage: {
        Row: { user_id: string; date: string; count: number }
        Insert: { user_id: string; date?: string; count?: number }
        Update: { count?: number }
      }
    }
  }
}
