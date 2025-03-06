export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      pdi_data: {
        Row: {
          id: string
          overview: string
          main_objective: string
          section_order: Json[]
          custom_sections: Json
          updated_at: string
        }
        Insert: {
          id: string
          overview: string
          main_objective: string
          section_order: Json[]
          custom_sections: Json
          updated_at?: string
        }
        Update: {
          id?: string
          overview?: string
          main_objective?: string
          section_order?: Json[]
          custom_sections?: Json
          updated_at?: string
        }
      }
      pdi_activities: {
        Row: {
          id: string
          activity: string
          description: string
          expected_result: string
          deadline: string | null
          observation: string | null
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          activity: string
          description: string
          expected_result: string
          deadline?: string | null
          observation?: string | null
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          activity?: string
          description?: string
          expected_result?: string
          deadline?: string | null
          observation?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}