import React, { createContext, useContext, useEffect, useState, useCallback, PropsWithChildren } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase'; // Import the generated types
import { useTranslation } from 'react-i18next';
import { showErrorToast } from '../utils/toastUtils';

// Define the user profile structure using the generated types
export type UserProfile = Database['public']['Tables']['users']['Row'];

export interface AuthContextType {
  session: Session | null;
  user: UserProfile | null;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  isAdmin: boolean;
  companyId: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const { t } = useTranslation();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setCompanyId(null);
    setIsAdmin(false);
  };

  const fetchUserProfile = useCallback(async (session: Session | null) => {
    setLoading(true);
    if (session?.user) {
      try {
        const { data: profile, error } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.warn('Orphaned user session detected, signing out.', error);
          await signOut();
          return;
        }
        
        if (profile) {
          setUser(profile);
          setCompanyId(profile.company_id);
          console.log(`👤 User profile loaded. Company ID: ${profile.company_id}, Onboarding: ${profile.onboarding_status}`);
        } else {
          console.log(`👤 No profile found for user ${session.user.id}, might be a new user.`);
          // Create a minimal user object to prevent crashes, app logic will handle redirection.
          const minimalUser: UserProfile = {
            user_id: session.user.id,
            email: session.user.email || '',
            company_id: null,
            onboarding_status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_active: true,
            // Fill other non-nullable fields from 'users' table with default values if any
            first_name: null,
            last_name: null,
            phone_number: null,
            avatar_url: null,
            is_email_verified: false,
            last_login_at: null,
            preferred_language: 'en',
            preferred_theme: 'light',
            preferred_units: 'metric',
            preferred_currency: 'EUR',
            alternative_phone: null,
            date_of_birth: null,
            position: null,
            branch: null,
            manager: null,
            work_email: null,
            home_address: null,
            home_city: null,
            home_postal_code: null,
            home_country: null,
            work_address: null,
            work_city: null,
            work_postal_code: null,
            work_country: null,
            emergency_contact_name: null,
            emergency_contact_phone: null,
            emergency_contact_relationship: null,
            has_private_vehicle: false,
            private_vehicle_plate: null,
            private_vehicle_make: null,
            private_vehicle_model: null,
            driving_license_number: null,
            driving_license_category: null,
            driving_license_expiry: null,
            preferred_vehicle_id: null,
            biography: null,
            skills: null,
            languages: null,
            certifications: null,
            username: null,
            password_hash: null
          };
          setUser(minimalUser);
          setCompanyId(null);
        }
      } catch (e) {
        console.error("Error in fetchUserProfile:", e);
        await signOut();
      } finally {
        setLoading(false);
      }
    } else {
      setUser(null);
      setCompanyId(null);
      setLoading(false);
    }
  }, []);
  
  const refreshUserProfile = useCallback(async () => {
    const { data: { session: currentSession } } = await supabase.auth.refreshSession();
    await fetchUserProfile(currentSession);
  }, [fetchUserProfile]);

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      await fetchUserProfile(session);
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        fetchUserProfile(session);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [fetchUserProfile]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      showErrorToast(t('auth.login_failed'), error.message);
    }
    // The onAuthStateChange listener will handle setting the user and session
    setLoading(false);
    return { error };
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    setLoading(false);
    return { data: { user: data.user, session: data.session }, error };
  };

  const value = {
    session,
    user,
    loading,
    setLoading,
    signIn,
    signUp,
    signOut,
    refreshUserProfile,
    isAdmin,
    companyId,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 