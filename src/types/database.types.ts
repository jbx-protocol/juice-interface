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
      contributors: {
        Row: {
          avatar_url: string | null
          id: string
          is_discord_avatar: boolean | null
          name: string
          title: string | null
        }
        Insert: {
          avatar_url?: string | null
          id: string
          is_discord_avatar?: boolean | null
          name: string
          title?: string | null
        }
        Update: {
          avatar_url?: string | null
          id?: string
          is_discord_avatar?: boolean | null
          name?: string
          title?: string | null
        }
      }
      developer_wallets: {
        Row: {
          created_at: string
          wallet: string
        }
        Insert: {
          created_at?: string
          wallet: string
        }
        Update: {
          created_at?: string
          wallet?: string
        }
      }
      project_updates: {
        Row: {
          created_at: string | null
          id: string
          image_url: string | null
          message: string
          poster_user_id: string
          project: string
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          message: string
          poster_user_id: string
          project: string
          title: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          message?: string
          poster_user_id?: string
          project?: string
          title?: string
        }
      }
      projects: {
        Row: {
          _has_unresolved_metadata: boolean | null
          _metadata_retries_left: number | null
          _updated_at: number
          archived: boolean | null
          contributors_count: number
          created_at: number
          created_within_trending_window: boolean
          creator: string
          current_balance: string
          deployer: string | null
          description: string | null
          handle: string | null
          id: string
          logo_uri: string | null
          metadata_uri: string | null
          name: string | null
          nfts_minted_count: number
          owner: string
          payments_count: number
          project_id: number
          pv: string
          redeem_count: number
          redeem_volume: string
          redeem_voume_usd: string
          tags: string[] | null
          terminal: string | null
          trending_payments_count: number
          trending_score: string
          trending_volume: string
          volume: string
          volume_usd: string
        }
        Insert: {
          _has_unresolved_metadata?: boolean | null
          _metadata_retries_left?: number | null
          _updated_at: number
          archived?: boolean | null
          contributors_count: number
          created_at: number
          created_within_trending_window: boolean
          creator: string
          current_balance: string
          deployer?: string | null
          description?: string | null
          handle?: string | null
          id: string
          logo_uri?: string | null
          metadata_uri?: string | null
          name?: string | null
          nfts_minted_count: number
          owner: string
          payments_count: number
          project_id: number
          pv: string
          redeem_count: number
          redeem_volume: string
          redeem_voume_usd: string
          tags?: string[] | null
          terminal?: string | null
          trending_payments_count: number
          trending_score: string
          trending_volume: string
          volume: string
          volume_usd: string
        }
        Update: {
          _has_unresolved_metadata?: boolean | null
          _metadata_retries_left?: number | null
          _updated_at?: number
          archived?: boolean | null
          contributors_count?: number
          created_at?: number
          created_within_trending_window?: boolean
          creator?: string
          current_balance?: string
          deployer?: string | null
          description?: string | null
          handle?: string | null
          id?: string
          logo_uri?: string | null
          metadata_uri?: string | null
          name?: string | null
          nfts_minted_count?: number
          owner?: string
          payments_count?: number
          project_id?: number
          pv?: string
          redeem_count?: number
          redeem_volume?: string
          redeem_voume_usd?: string
          tags?: string[] | null
          terminal?: string | null
          trending_payments_count?: number
          trending_score?: string
          trending_volume?: string
          volume?: string
          volume_usd?: string
        }
      }
      user_bookmarks: {
        Row: {
          created_at: string
          project: string
          user_id: string
        }
        Insert: {
          created_at?: string
          project: string
          user_id: string
        }
        Update: {
          created_at?: string
          project?: string
          user_id?: string
        }
      }
      user_subscriptions: {
        Row: {
          notification_id: string
          project_id: number
          user_id: string
        }
        Insert: {
          notification_id: string
          project_id: number
          user_id: string
        }
        Update: {
          notification_id?: string
          project_id?: number
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
