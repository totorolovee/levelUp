import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  loadInvestmentDecisions,
  saveDecisionLesson,
  saveInvestmentDecision,
} from './investmentDecisions';
import { supabase } from './supabase';
import { unlockAchievement } from './achievements';

export type Decision = {
  id: string;
  symbol: string;
  company: string;
  quantity: number;
  price: number;
  reason: string;
  risk: string;
  invalidation: string;
  horizon: string;
  confidence: number;
  analysisApproved: boolean;
  analysisFeedback: string;
  lesson?: string;
  createdAt: Date;
};

type PortfolioContextValue = {
  balance: number;
  decisions: Decision[];
  status: 'loading' | 'guest' | 'ready';
  addDecision: (decision: Omit<Decision, 'id' | 'createdAt'>) => Promise<void>;
  reviewDecision: (id: string, lesson: string) => Promise<void>;
};

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(10_000);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [status, setStatus] = useState<PortfolioContextValue['status']>('loading');

  useEffect(() => {
    let isActive = true;
    const load = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        if (isActive) {
          setDecisions([]);
          setBalance(10_000);
          setStatus('guest');
        }
        return;
      }
      const saved = await loadInvestmentDecisions();
      if (!isActive) return;
      setDecisions(saved);
      setBalance(10_000 - saved.reduce(
        (spent, decision) => spent + decision.price * decision.quantity,
        0,
      ));
      setStatus('ready');
    };
    void load().catch(() => isActive && setStatus('guest'));
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      window.setTimeout(() => void load(), 0);
    });
    return () => {
      isActive = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const addDecision = async (decision: Omit<Decision, 'id' | 'createdAt'>) => {
    const saved = await saveInvestmentDecision(decision);
    void unlockAchievement('first_investment').catch(() => undefined);
    setBalance((current) => current - saved.price * saved.quantity);
    setDecisions((current) => [saved, ...current]);
  };

  const reviewDecision = async (id: string, lesson: string) => {
    await saveDecisionLesson(id, lesson);
    setDecisions((current) =>
      current.map((decision) =>
        decision.id === id ? { ...decision, lesson } : decision,
      ),
    );
  };

  return (
    <PortfolioContext.Provider value={{ balance, decisions, status, addDecision, reviewDecision }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used inside PortfolioProvider');
  }
  return context;
}
