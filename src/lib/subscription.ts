import { supabase } from './supabase';

export type PlusStatus = {
  active: boolean;
  status: 'active' | 'trialing' | 'inactive';
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
};

async function invokeBilling<T>(action: 'status' | 'checkout' | 'portal') {
  const { data, error } = await supabase.functions.invoke('billing', {
    body: { action },
  });
  if (error) throw error;
  return data as T;
}

export function loadPlusStatus() {
  return invokeBilling<PlusStatus>('status');
}

export async function createPlusCheckout() {
  const result = await invokeBilling<{ url: string }>('checkout');
  return result.url;
}

export async function createPlusPortal() {
  const result = await invokeBilling<{ url: string }>('portal');
  return result.url;
}
