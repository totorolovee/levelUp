import { useEffect, useState, type ReactNode } from 'react';
import { Redirect } from 'wouter';
import { supabase } from '../lib/supabase';

export function AuthenticatedPage({ children }: { children: ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      setIsSignedIn(Boolean(data.session));
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsSignedIn(Boolean(session));
    });

    return () => data.subscription.unsubscribe();
  }, []);

  if (isSignedIn === null) {
    return <div className="route-loading" aria-label="Loading" />;
  }

  return isSignedIn ? children : <Redirect to="/login" />;
}
