export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
        Relationships: []
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
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: 'project_updates_poster_user_id_fkey'
            columns: ['poster_user_id']
            isOneToOne: false
            referencedRelation: 'user_profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'project_updates_poster_user_id_fkey'
            columns: ['poster_user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'project_updates_project_fkey'
            columns: ['project']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
        ]
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
          chain_id: number
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
          chain_id: number
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
          chain_id?: number
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
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: 'user_bookmarks_project_fkey'
            columns: ['project']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_bookmarks_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'user_profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_bookmarks_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: 'user_subscriptions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'user_profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_subscriptions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: 'users_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: 'users_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
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
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
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
        Relationships: []
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
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'objects_bucketId_fkey'
            columns: ['bucket_id']
            isOneToOne: false
            referencedRelation: 'buckets'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
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

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
      PublicSchema['Views'])
  ? (PublicSchema['Tables'] &
      PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
  ? PublicSchema['Enums'][PublicEnumNameOrOptions]
  : never
