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