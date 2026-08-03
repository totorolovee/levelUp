import { useEffect, useState, type ReactNode } from 'react';
import { Redirect } from 'wouter';
import { loadCurrentSession } from '../lib/auth';
import { supabase } from '../lib/supabase';

export function AuthenticatedPage({ children }: { children: ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    let isActive = true;
    void loadCurrentSession()
      .then((session) => {
        if (isActive) setIsSignedIn(Boolean(session));
      })
      .catch(() => {
        if (isActive) setIsSignedIn(false);
      });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsSignedIn(Boolean(session));
    });

    return () => {
      isActive = false;
      data.subscription.unsubscribe();
    };
  }, []);

  if (isSignedIn === null) {
    return <div className="route-loading" aria-label="Loading" />;
  }

  return isSignedIn ? children : <Redirect to="/login" />;
}
