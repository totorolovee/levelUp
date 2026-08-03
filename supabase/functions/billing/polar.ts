const accessToken = Deno.env.get('POLAR_ACCESS_TOKEN');
const productId = Deno.env.get('POLAR_PRODUCT_ID');
const apiBase = Deno.env.get('POLAR_SERVER') === 'sandbox'
  ? 'https://sandbox-api.polar.sh'
  : 'https://api.polar.sh';

type PolarSubscription = {
  product_id?: unknown;
  status?: unknown;
  current_period_end?: unknown;
  cancel_at_period_end?: unknown;
};

type CustomerState = {
  active_subscriptions?: unknown;
};

export type PlusStatus = {
  active: boolean;
  status: 'active' | 'trialing' | 'inactive';
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
};

export class PolarApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function hasPolarConfig() {
  return Boolean(accessToken && productId);
}

async function polarRequest<T>(path: string, init?: RequestInit): Promise<T> {
  if (!accessToken) throw new PolarApiError(503, 'Polar access token is missing');
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
  if (!response.ok) {
    const detail = await response.text();
    console.error('Polar API request failed', response.status, detail.slice(0, 500));
    throw new PolarApiError(response.status, 'Polar API request failed');
  }
  return response.json() as Promise<T>;
}

export async function loadPlusStatus(userId: string): Promise<PlusStatus> {
  if (!productId) throw new PolarApiError(503, 'Polar product is missing');
  let state: CustomerState;
  try {
    state = await polarRequest<CustomerState>(
      `/v1/customers/external/${encodeURIComponent(userId)}/state`,
    );
  } catch (error) {
    if (error instanceof PolarApiError && error.status === 404) {
      return { active: false, status: 'inactive', currentPeriodEnd: null, cancelAtPeriodEnd: false };
    }
    throw error;
  }

  const subscriptions = Array.isArray(state.active_subscriptions)
    ? state.active_subscriptions as PolarSubscription[]
    : [];
  const subscription = subscriptions.find((item) => item.product_id === productId);
  if (!subscription) {
    return { active: false, status: 'inactive', currentPeriodEnd: null, cancelAtPeriodEnd: false };
  }
  return {
    active: true,
    status: subscription.status === 'trialing' ? 'trialing' : 'active',
    currentPeriodEnd: typeof subscription.current_period_end === 'string'
      ? subscription.current_period_end
      : null,
    cancelAtPeriodEnd: subscription.cancel_at_period_end === true,
  };
}

export async function createCheckout(userId: string, email: string, origin: string) {
  if (!productId) throw new PolarApiError(503, 'Polar product is missing');
  const checkout = await polarRequest<{ url?: unknown }>('/v1/checkouts/', {
    method: 'POST',
    body: JSON.stringify({
      products: [productId],
      external_customer_id: userId,
      customer_email: email,
      success_url: `${origin}/profile?checkout=success`,
      return_url: `${origin}/profile`,
    }),
  });
  if (typeof checkout.url !== 'string') throw new PolarApiError(502, 'Checkout URL is missing');
  return checkout.url;
}

export async function createPortal(userId: string, origin: string) {
  const session = await polarRequest<{ customer_portal_url?: unknown }>('/v1/customer-sessions/', {
    method: 'POST',
    body: JSON.stringify({ external_customer_id: userId, return_url: `${origin}/profile` }),
  });
  if (typeof session.customer_portal_url !== 'string') {
    throw new PolarApiError(502, 'Customer portal URL is missing');
  }
  return session.customer_portal_url;
}
