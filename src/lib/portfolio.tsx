import { createContext, useContext, useState, type ReactNode } from 'react';

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
  addDecision: (decision: Omit<Decision, 'id' | 'createdAt'>) => void;
  reviewDecision: (id: string, lesson: string) => void;
};

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(10_000);
  const [decisions, setDecisions] = useState<Decision[]>([]);

  const addDecision = (decision: Omit<Decision, 'id' | 'createdAt'>) => {
    setBalance((current) => current - decision.price * decision.quantity);
    setDecisions((current) => [
      {
        ...decision,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      },
      ...current,
    ]);
  };

  const reviewDecision = (id: string, lesson: string) => {
    setDecisions((current) =>
      current.map((decision) =>
        decision.id === id ? { ...decision, lesson } : decision,
      ),
    );
  };

  return (
    <PortfolioContext.Provider value={{ balance, decisions, addDecision, reviewDecision }}>
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
