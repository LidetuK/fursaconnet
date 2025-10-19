export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      conversations: {
        Row: {
          created_at: string
          expert_id: string
          id: string
          sme_id: string
          status: string | null
          subject: string
          task_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          expert_id: string
          id?: string
          sme_id: string
          status?: string | null
          subject: string
          task_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          expert_id?: string
          id?: string
          sme_id?: string
          status?: string | null
          subject?: string
          task_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_settings: {
        Row: {
          active_section: string | null
          created_at: string | null
          id: string
          package_type: string
          preferences: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active_section?: string | null
          created_at?: string | null
          id?: string
          package_type: string
          preferences?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active_section?: string | null
          created_at?: string | null
          id?: string
          package_type?: string
          preferences?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      digital_expert_profiles: {
        Row: {
          availability_status: string | null
          bio: string | null
          created_at: string
          experience_years: number | null
          hourly_rate: number | null
          id: string
          profile_picture_url: string | null
          skills: string[] | null
          specialization: string
          updated_at: string
          user_id: string
        }
        Insert: {
          availability_status?: string | null
          bio?: string | null
          created_at?: string
          experience_years?: number | null
          hourly_rate?: number | null
          id?: string
          profile_picture_url?: string | null
          skills?: string[] | null
          specialization: string
          updated_at?: string
          user_id: string
        }
        Update: {
          availability_status?: string | null
          bio?: string | null
          created_at?: string
          experience_years?: number | null
          hourly_rate?: number | null
          id?: string
          profile_picture_url?: string | null
          skills?: string[] | null
          specialization?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          message_type: string | null
          metadata: Json | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          message_type?: string | null
          metadata?: Json | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          message_type?: string | null
          metadata?: Json | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          ayrshare_profile_key: string | null
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          user_type: Database["public"]["Enums"]["user_type"] | null
        }
        Insert: {
          avatar_url?: string | null
          ayrshare_profile_key?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"] | null
        }
        Update: {
          avatar_url?: string | null
          ayrshare_profile_key?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"] | null
        }
        Relationships: []
      }
      reminders: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_completed: boolean | null
          reminder_date: string
          task_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_completed?: boolean | null
          reminder_date: string
          task_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_completed?: boolean | null
          reminder_date?: string
          task_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      social_accounts: {
        Row: {
          access_token: string | null
          access_token_secret: string | null
          created_at: string | null
          id: string
          platform: string
          platform_user_id: string | null
          screen_name: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          access_token_secret?: string | null
          created_at?: string | null
          id?: string
          platform: string
          platform_user_id?: string | null
          screen_name?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          access_token_secret?: string | null
          created_at?: string | null
          id?: string
          platform?: string
          platform_user_id?: string | null
          screen_name?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          package_type: string
          status: string
          stripe_customer_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          package_type: string
          status: string
          stripe_customer_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          package_type?: string
          status?: string
          stripe_customer_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      task_reports: {
        Row: {
          challenges_faced: string | null
          created_at: string
          expert_id: string
          hours_worked: number
          id: string
          next_steps: string | null
          progress_percentage: number | null
          report_date: string
          task_id: string
          work_description: string
        }
        Insert: {
          challenges_faced?: string | null
          created_at?: string
          expert_id: string
          hours_worked: number
          id?: string
          next_steps?: string | null
          progress_percentage?: number | null
          report_date?: string
          task_id: string
          work_description: string
        }
        Update: {
          challenges_faced?: string | null
          created_at?: string
          expert_id?: string
          hours_worked?: number
          id?: string
          next_steps?: string | null
          progress_percentage?: number | null
          report_date?: string
          task_id?: string
          work_description?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_reports_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          actual_hours: number | null
          assigned_by: string
          assigned_to: string
          attachments: Json | null
          client_id: string | null
          created_at: string
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          id: string
          notes: string | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          status: Database["public"]["Enums"]["task_status"] | null
          title: string
          updated_at: string
        }
        Insert: {
          actual_hours?: number | null
          assigned_by: string
          assigned_to: string
          attachments?: Json | null
          client_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          notes?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title: string
          updated_at?: string
        }
        Update: {
          actual_hours?: number | null
          assigned_by?: string
          assigned_to?: string
          attachments?: Json | null
          client_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          notes?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          access_token: string | null
          created_at: string | null
          email: string | null
          google_id: string | null
          id: string
          name: string | null
          picture: string | null
          refresh_token: string | null
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          email?: string | null
          google_id?: string | null
          id?: string
          name?: string | null
          picture?: string | null
          refresh_token?: string | null
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          email?: string | null
          google_id?: string | null
          id?: string
          name?: string | null
          picture?: string | null
          refresh_token?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_available_experts: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          full_name: string
          specialization: string
          bio: string
          avatar_url: string
          experience_years: number
          hourly_rate: number
          availability_status: string
          skills: string[]
          profile_picture_url: string
        }[]
      }
    }
    Enums: {
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status: "pending" | "in_progress" | "completed" | "overdue"
      user_type: "client" | "digital_expert" | "sme" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      task_priority: ["low", "medium", "high", "urgent"],
      task_status: ["pending", "in_progress", "completed", "overdue"],
      user_type: ["client", "digital_expert", "sme", "admin"],
    },
  },
} as const
