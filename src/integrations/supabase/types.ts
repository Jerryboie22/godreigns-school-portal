export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      children_records: {
        Row: {
          admission_number: string | null
          attendance_percentage: number | null
          child_name: string
          class_level: string
          created_at: string
          current_gpa: number | null
          id: string
          outstanding_fees: number | null
          parent_id: string
          updated_at: string
        }
        Insert: {
          admission_number?: string | null
          attendance_percentage?: number | null
          child_name: string
          class_level: string
          created_at?: string
          current_gpa?: number | null
          id?: string
          outstanding_fees?: number | null
          parent_id: string
          updated_at?: string
        }
        Update: {
          admission_number?: string | null
          attendance_percentage?: number | null
          child_name?: string
          class_level?: string
          created_at?: string
          current_gpa?: number | null
          id?: string
          outstanding_fees?: number | null
          parent_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      enrolled_classes: {
        Row: {
          attendance_percentage: number | null
          class_name: string
          created_at: string
          grade: string | null
          id: string
          student_id: string
          subject: string
          teacher_id: string | null
          teacher_name: string | null
          updated_at: string
        }
        Insert: {
          attendance_percentage?: number | null
          class_name: string
          created_at?: string
          grade?: string | null
          id?: string
          student_id: string
          subject: string
          teacher_id?: string | null
          teacher_name?: string | null
          updated_at?: string
        }
        Update: {
          attendance_percentage?: number | null
          class_name?: string
          created_at?: string
          grade?: string | null
          id?: string
          student_id?: string
          subject?: string
          teacher_id?: string | null
          teacher_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      fees: {
        Row: {
          amount: number
          class_level: string
          created_at: string
          due_date: string | null
          fee_type: string
          id: string
          paid_date: string | null
          status: string | null
          student_id: string
          student_name: string
          updated_at: string
        }
        Insert: {
          amount: number
          class_level: string
          created_at?: string
          due_date?: string | null
          fee_type: string
          id?: string
          paid_date?: string | null
          status?: string | null
          student_id: string
          student_name: string
          updated_at?: string
        }
        Update: {
          amount?: number
          class_level?: string
          created_at?: string
          due_date?: string | null
          fee_type?: string
          id?: string
          paid_date?: string | null
          status?: string | null
          student_id?: string
          student_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string
          title: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          title?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          title?: string | null
        }
        Relationships: []
      }
      homepage_content: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
          is_visible: boolean | null
          link_text: string | null
          link_url: string | null
          order_index: number | null
          section_key: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_visible?: boolean | null
          link_text?: string | null
          link_url?: string | null
          order_index?: number | null
          section_key: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_visible?: boolean | null
          link_text?: string | null
          link_url?: string | null
          order_index?: number | null
          section_key?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      homepage_images: {
        Row: {
          alt_text: string
          created_at: string
          description: string | null
          id: string
          image_url: string
          is_active: boolean | null
          order_index: number | null
          section: string
          title: string
          updated_at: string
        }
        Insert: {
          alt_text: string
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          is_active?: boolean | null
          order_index?: number | null
          section: string
          title: string
          updated_at?: string
        }
        Update: {
          alt_text?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          order_index?: number | null
          section?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      lesson_schedules: {
        Row: {
          class_level: string
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          notes: string | null
          room: string | null
          staff_id: string
          start_time: string
          subject: string
          updated_at: string
        }
        Insert: {
          class_level: string
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          notes?: string | null
          room?: string | null
          staff_id: string
          start_time: string
          subject: string
          updated_at?: string
        }
        Update: {
          class_level?: string
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          notes?: string | null
          room?: string | null
          staff_id?: string
          start_time?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      portal_sections: {
        Row: {
          content_type: string
          created_at: string
          custom_content: Json | null
          description: string | null
          icon: string
          id: string
          is_visible: boolean
          order_index: number
          portal_type: string
          section_key: string
          title: string
          updated_at: string
        }
        Insert: {
          content_type?: string
          created_at?: string
          custom_content?: Json | null
          description?: string | null
          icon?: string
          id?: string
          is_visible?: boolean
          order_index?: number
          portal_type: string
          section_key: string
          title: string
          updated_at?: string
        }
        Update: {
          content_type?: string
          created_at?: string
          custom_content?: Json | null
          description?: string | null
          icon?: string
          id?: string
          is_visible?: boolean
          order_index?: number
          portal_type?: string
          section_key?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          author_id: string | null
          category: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured: boolean | null
          id: string
          image: string | null
          slug: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          image?: string | null
          slug?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          image?: string | null
          slug?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      schedule_notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          notification_type: string
          recipient_id: string
          schedule_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          notification_type?: string
          recipient_id: string
          schedule_id: string
          sender_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          notification_type?: string
          recipient_id?: string
          schedule_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_notifications_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "lesson_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      site_urls: {
        Row: {
          created_at: string
          current_url: string
          display_name: string
          id: string
          is_editable: boolean | null
          page_name: string
          page_type: string | null
          related_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_url: string
          display_name: string
          id?: string
          is_editable?: boolean | null
          page_name: string
          page_type?: string | null
          related_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_url?: string
          display_name?: string
          id?: string
          is_editable?: boolean | null
          page_name?: string
          page_type?: string | null
          related_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          class_level: string | null
          created_at: string
          full_name: string
          id: string
          parent_email: string | null
          parent_name: string | null
          parent_phone: string | null
          student_id: string | null
          updated_at: string
        }
        Insert: {
          class_level?: string | null
          created_at?: string
          full_name: string
          id?: string
          parent_email?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          student_id?: string | null
          updated_at?: string
        }
        Update: {
          class_level?: string | null
          created_at?: string
          full_name?: string
          id?: string
          parent_email?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          student_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      teachers: {
        Row: {
          bio: string | null
          created_at: string
          email: string | null
          id: string
          image_url: string | null
          name: string
          phone: string | null
          subject: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          image_url?: string | null
          name: string
          phone?: string | null
          subject?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          image_url?: string | null
          name?: string
          phone?: string | null
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      url_redirects: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          new_url: string
          old_url: string
          redirect_type: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          new_url: string
          old_url: string
          redirect_type?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          new_url?: string
          old_url?: string
          redirect_type?: number | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
