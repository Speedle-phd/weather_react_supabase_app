export type Json =
   | string
   | number
   | boolean
   | null
   | { [key: string]: Json | undefined }
   | Json[]

export type InsertData<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type DbResult<T> = T extends PromiseLike<infer U> ? U : never

export interface Database {
   public: {
      Tables: {
         weather_data: {
            Row: {
               id: string
               inserted_at: string
               isgps: boolean | null
               isset: boolean | null
               lat: number
               long: number
               updated_at: string
               user_id: string
            }
            Insert: {
               id?: string
               inserted_at?: string
               isgps?: boolean | null
               isset?: boolean | null
               lat: number
               long: number
               updated_at?: string
               user_id: string
            }
            Update: {
               id?: string
               inserted_at?: string
               isgps?: boolean | null
               isset?: boolean | null
               lat?: number
               long?: number
               updated_at?: string
               user_id?: string
            }
            Relationships: [
               {
                  foreignKeyName: 'weather_data_user_id_fkey'
                  columns: ['user_id']
                  referencedRelation: 'users'
                  referencedColumns: ['id']
               }
            ]
         }
      }
      Views: {
         [_ in never]: never
      }
      Functions: {
         delete_user: {
            Args: {
               id: string
            }
            Returns: undefined
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
