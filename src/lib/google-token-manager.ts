import { supabase } from '@/lib/supabase'; // Adjust to your database setup
import { GoogleOAuthManager } from './google-oauth';

export class GoogleTokenManager {
  static async getValidToken(userId: string, clientId: string): Promise<string | null> {
    try {
      const { data: tokenRecord, error: fetchError } = await supabase
        .from('googleTokens')
        .select('*')
        .eq('userId', userId)
        .eq('clientId', clientId)
        .single();

      if (fetchError || !tokenRecord) {
        return null;
      }

      // Check if token is expired
      const now = new Date();
      if (tokenRecord.expiresAt <= now) {
        // Try to refresh the token
        try {
          const newCredentials = await GoogleOAuthManager.refreshAccessToken(
            tokenRecord.refreshToken
          );

          // Update the database with new tokens
          const { error: updateError } = await supabase
            .from('googleTokens')
            .update({
              accessToken: newCredentials.access_token!,
              expiresAt: new Date(newCredentials.expiry_date || Date.now() + 3600000),
              updatedAt: new Date()
            })
            .eq('userId', userId)
            .eq('clientId', clientId);

          if (updateError) {
            throw updateError;
          }

          return newCredentials.access_token!;
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError);
          // Delete invalid tokens
          await this.deleteTokens(userId, clientId);
          return null;
        }
      }

      return tokenRecord.accessToken;
    } catch (error) {
      console.error('Error getting valid token:', error);
      return null;
    }
  }

  static async deleteTokens(userId: string, clientId: string): Promise<void> {
    try {
      const { error: deleteError } = await supabase
        .from('googleTokens')
        .delete()
        .eq('userId', userId)
        .eq('clientId', clientId);

      if (deleteError) {
        throw deleteError;
      }

      // Update business record
      const { error: updateError } = await supabase
        .from('business')
        .update({ 
          gmb_connected: false,
          gmb_connected_at: null
        })
        .eq('id', clientId);

      if (updateError) {
        throw updateError;
      }
    } catch (error) {
      console.error('Error deleting tokens:', error);
    }
  }

  static async hasValidConnection(userId: string, clientId: string): Promise<boolean> {
    const token = await this.getValidToken(userId, clientId);
    return token !== null;
  }
}
