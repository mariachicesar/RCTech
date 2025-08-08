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
      asset: {
        Row: {
          created_at: string
          id: number
          image_id: number | null
          website_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          image_id?: number | null
          website_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          image_id?: number | null
          website_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "asset_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "image"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "website"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_post: {
        Row: {
          author_id: number | null
          content: string | null
          created_at: string | null
          id: number
          published_at: string | null
          slug: string | null
          title: string | null
          website_id: number | null
        }
        Insert: {
          author_id?: number | null
          content?: string | null
          created_at?: string | null
          id?: number
          published_at?: string | null
          slug?: string | null
          title?: string | null
          website_id?: number | null
        }
        Update: {
          author_id?: number | null
          content?: string | null
          created_at?: string | null
          id?: number
          published_at?: string | null
          slug?: string | null
          title?: string | null
          website_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "website"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_post_image: {
        Row: {
          blog_post_id: number | null
          created_at: string | null
          id: number
          image_id: number | null
          order: number | null
        }
        Insert: {
          blog_post_id?: number | null
          created_at?: string | null
          id?: number
          image_id?: number | null
          order?: number | null
        }
        Update: {
          blog_post_id?: number | null
          created_at?: string | null
          id?: number
          image_id?: number | null
          order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_image_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_post"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_image_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "image"
            referencedColumns: ["id"]
          },
        ]
      }
      business_listing: {
        Row: {
          address: string | null
          business_name: string | null
          created_at: string | null
          facebook: string | null
          gmb_Id: string | null
          id: number
          industry: string | null
          instagram: string | null
          listing_url: string | null
          other: string | null
          phone: string | null
          platform: string | null
          rating: number | null
          review_count: number | null
          website_id: number | null
          xUrl: string | null
        }
        Insert: {
          address?: string | null
          business_name?: string | null
          created_at?: string | null
          facebook?: string | null
          gmb_Id?: string | null
          id?: number
          industry?: string | null
          instagram?: string | null
          listing_url?: string | null
          other?: string | null
          phone?: string | null
          platform?: string | null
          rating?: number | null
          review_count?: number | null
          website_id?: number | null
          xUrl?: string | null
        }
        Update: {
          address?: string | null
          business_name?: string | null
          created_at?: string | null
          facebook?: string | null
          gmb_Id?: string | null
          id?: number
          industry?: string | null
          instagram?: string | null
          listing_url?: string | null
          other?: string | null
          phone?: string | null
          platform?: string | null
          rating?: number | null
          review_count?: number | null
          website_id?: number | null
          xUrl?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_listing_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "website"
            referencedColumns: ["id"]
          },
        ]
      }
      detail_slug: {
        Row: {
          auth_id: number | null
          content: string | null
          created_at: string
          id: number
          slug: string | null
          title: string | null
          updated_at: string | null
          website_id: number | null
        }
        Insert: {
          auth_id?: number | null
          content?: string | null
          created_at?: string
          id?: number
          slug?: string | null
          title?: string | null
          updated_at?: string | null
          website_id?: number | null
        }
        Update: {
          auth_id?: number | null
          content?: string | null
          created_at?: string
          id?: number
          slug?: string | null
          title?: string | null
          updated_at?: string | null
          website_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "detail_slug_auth_id_fkey"
            columns: ["auth_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "detail_slug_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "website"
            referencedColumns: ["id"]
          },
        ]
      }
      gmb_posts: {
        Row: {
          client_id: number | null
          created_at: string | null
          gmb_post_id: string
          id: string
          location_id: string
          post_data: Json
          status: string | null
          updated_at: string | null
        }
        Insert: {
          client_id?: number | null
          created_at?: string | null
          gmb_post_id: string
          id?: string
          location_id: string
          post_data: Json
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: number | null
          created_at?: string | null
          gmb_post_id?: string
          id?: string
          location_id?: string
          post_data?: Json
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gmb_posts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "business_listing"
            referencedColumns: ["id"]
          },
        ]
      }
      google_auth_tokens: {
        Row: {
          access_token: string
          client_id: number | null
          created_at: string | null
          expires_at: string | null
          id: string
          refresh_token: string | null
          updated_at: string | null
        }
        Insert: {
          access_token: string
          client_id?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          refresh_token?: string | null
          updated_at?: string | null
        }
        Update: {
          access_token?: string
          client_id?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          refresh_token?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "google_auth_tokens_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "business_listing"
            referencedColumns: ["id"]
          },
        ]
      }
      image: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string | null
          id: number
          url: string | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string | null
          id?: number
          url?: string | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string | null
          id?: number
          url?: string | null
        }
        Relationships: []
      }
      location_local: {
        Row: {
          cities: Json | null
          created_at: string
          id: number
          website_id: number | null
          zip: Json | null
        }
        Insert: {
          cities?: Json | null
          created_at?: string
          id?: number
          website_id?: number | null
          zip?: Json | null
        }
        Update: {
          cities?: Json | null
          created_at?: string
          id?: number
          website_id?: number | null
          zip?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "location_local_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "website"
            referencedColumns: ["id"]
          },
        ]
      }
      page: {
        Row: {
          content: string | null
          created_at: string | null
          id: number
          slug: string | null
          title: string | null
          type: string | null
          website_id: number | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: number
          slug?: string | null
          title?: string | null
          type?: string | null
          website_id?: number | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: number
          slug?: string | null
          title?: string | null
          type?: string | null
          website_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "page_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "website"
            referencedColumns: ["id"]
          },
        ]
      }
      page_image: {
        Row: {
          created_at: string | null
          id: number
          image_id: number | null
          page_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          image_id?: number | null
          page_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          image_id?: number | null
          page_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "page_image_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "image"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "page_image_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "page"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_metadata: {
        Row: {
          blog_post_id: number | null
          created_at: string | null
          id: number
          keywords: string | null
          meta_description: string | null
          meta_title: string | null
          page_id: number | null
        }
        Insert: {
          blog_post_id?: number | null
          created_at?: string | null
          id?: number
          keywords?: string | null
          meta_description?: string | null
          meta_title?: string | null
          page_id?: number | null
        }
        Update: {
          blog_post_id?: number | null
          created_at?: string | null
          id?: number
          keywords?: string | null
          meta_description?: string | null
          meta_title?: string | null
          page_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_metadata_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_post"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seo_metadata_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "page"
            referencedColumns: ["id"]
          },
        ]
      }
      service: {
        Row: {
          content: string | null
          created_at: string | null
          id: number
          slug: string | null
          title: string | null
          website_id: number | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: number
          slug?: string | null
          title?: string | null
          website_id?: number | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: number
          slug?: string | null
          title?: string | null
          website_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "website"
            referencedColumns: ["id"]
          },
        ]
      }
      service_image: {
        Row: {
          created_at: string | null
          id: number
          image_id: number | null
          order: number | null
          service_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          image_id?: number | null
          order?: number | null
          service_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          image_id?: number | null
          order?: number | null
          service_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_image_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "image"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_image_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "service"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_charge: {
        Row: {
          amount: number | null
          created_at: string | null
          currency: string | null
          id: number
          status: string | null
          stripe_charge_id: string | null
          stripe_customer_id: number | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          id?: number
          status?: string | null
          stripe_charge_id?: string | null
          stripe_customer_id?: number | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          id?: number
          status?: string | null
          stripe_charge_id?: string | null
          stripe_customer_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stripe_charge_stripe_customer_id_fkey"
            columns: ["stripe_customer_id"]
            isOneToOne: false
            referencedRelation: "stripe_customer"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_customer: {
        Row: {
          created_at: string | null
          id: number
          stripe_customer_id: string | null
          website_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          stripe_customer_id?: string | null
          website_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          stripe_customer_id?: string | null
          website_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stripe_customer_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "website"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_product: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string | null
          price: number | null
          stripe_product_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string | null
          price?: number | null
          stripe_product_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string | null
          price?: number | null
          stripe_product_id?: string | null
        }
        Relationships: []
      }
      stripe_subscription: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: number
          start_date: string | null
          status: string | null
          stripe_customer_id: number | null
          stripe_product_id: number | null
          stripe_subscription_id: string | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: number
          start_date?: string | null
          status?: string | null
          stripe_customer_id?: number | null
          stripe_product_id?: number | null
          stripe_subscription_id?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: number
          start_date?: string | null
          status?: string | null
          stripe_customer_id?: number | null
          stripe_product_id?: number | null
          stripe_subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stripe_subscription_stripe_customer_id_fkey"
            columns: ["stripe_customer_id"]
            isOneToOne: false
            referencedRelation: "stripe_customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stripe_subscription_stripe_product_id_fkey"
            columns: ["stripe_product_id"]
            isOneToOne: false
            referencedRelation: "stripe_product"
            referencedColumns: ["id"]
          },
        ]
      }
      user: {
        Row: {
          created_at: string | null
          email: string | null
          id: number
          name: string | null
          password: string | null
          phone: string | null
          role: string | null
          users_id: string | null
          website_id: number | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: number
          name?: string | null
          password?: string | null
          phone?: string | null
          role?: string | null
          users_id?: string | null
          website_id?: number | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: number
          name?: string | null
          password?: string | null
          phone?: string | null
          role?: string | null
          users_id?: string | null
          website_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "website"
            referencedColumns: ["id"]
          },
        ]
      }
      website: {
        Row: {
          created_at: string | null
          domain: string | null
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string | null
          domain?: string | null
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string | null
          id?: number
          name?: string | null
        }
        Relationships: []
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
