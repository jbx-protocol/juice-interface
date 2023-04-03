export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  juice_auth: {
    Tables: {
      signing_requests: {
        Row: {
          challenge_message: string
          created_at: string
          expires_at: string
          nonce: string
          updated_at: string
          wallet_id: string
        }
        Insert: {
          challenge_message: string
          created_at?: string
          expires_at?: string
          nonce: string
          updated_at?: string
          wallet_id: string
        }
        Update: {
          challenge_message?: string
          created_at?: string
          expires_at?: string
          nonce?: string
          updated_at?: string
          wallet_id?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      projects: {
        Row: {
          id: number
        }
        Insert: {
          id: number
        }
        Update: {
          id?: number
        }
      }
      user_subscriptions: {
        Row: {
          notification_id: string
          project_id: number | null
          user_id: string
        }
        Insert: {
          notification_id: string
          project_id?: number | null
          user_id: string
        }
        Update: {
          notification_id?: string
          project_id?: number | null
          user_id?: string
        }
      }
      users: {
        Row: {
          bio: string | null
          created_at: string
          email: string | null
          email_verified: boolean
          id: string
          twitter: string | null
          updated_at: string
          wallet: string
          website: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          email?: string | null
          email_verified?: boolean
          id: string
          twitter?: string | null
          updated_at?: string
          wallet: string
          website?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          email?: string | null
          email_verified?: boolean
          id?: string
          twitter?: string | null
          updated_at?: string
          wallet?: string
          website?: string | null
        }
      }
    }
    Views: {
      user_profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          id: string | null
          twitter: string | null
          wallet: string | null
          website: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          id?: string | null
          twitter?: string | null
          wallet?: string | null
          website?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          id?: string | null
          twitter?: string | null
          wallet?: string | null
          website?: string | null
        }
      }
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
  storage: {
    Tables: {
      buckets: {
        Row: {
          created_at: string | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
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
