import { useEffect, useState } from 'react';
import { useLanguage } from '../lib/language';
import {
  createPlusCheckout,
  createPlusPortal,
  loadPlusStatus,
  type PlusStatus,
} from '../lib/subscription';

type ViewState =
  | { kind: 'loading' }
  | { kind: 'ready'; subscription: PlusStatus }
  | { kind: 'error'; message: string };

export function PlusSubscriptionCard() {
  const { language } = useLanguage();
  const isRussian = language === 'ru';
  const [state, setState] = useState<ViewState>({ kind: 'loading' });
  const [isRedirecting, setIsRedirecting] = useState(false);
  const checkoutSucceeded = new URLSearchParams(window.location.search).get('checkout') === 'success';

  useEffect(() => {
    let isActive = true;
    loadPlusStatus()
      .then((subscription) => {
        if (isActive) setState({ kind: 'ready', subscription });
      })
      .catch(() => {
        if (isActive) {
          setState({
            kind: 'error',
            message: isRussian ? 'Подписка пока не настроена.' : 'Subscription is not configured yet.',
          });
        }
      });
    return () => { isActive = false; };
  }, [isRussian]);

  const openPolar = async (mode: 'checkout' | 'portal') => {
    setIsRedirecting(true);
    try {
      const url = mode === 'checkout' ? await createPlusCheckout() : await createPlusPortal();
      window.location.assign(url);
    } catch {
      setState({
        kind: 'error',
        message: isRussian ? 'Не удалось открыть Polar. Попробуй позже.' : 'Could not open Polar. Try again later.',
      });
      setIsRedirecting(false);
    }
  };

  const subscription = state.kind === 'ready' ? state.subscription : null;
  const renewalDate = subscription?.currentPeriodEnd
    ? new Intl.DateTimeFormat(isRussian ? 'ru-RU' : 'en-US', {
      day: 'numeric', month: 'long', year: 'numeric',
    }).format(new Date(subscription.currentPeriodEnd))
    : null;

  return (
    <section className={`plus-card${subscription?.active ? ' active' : ''}`}>
      <div className="plus-card-copy">
        <span className="plus-badge">PLUS</span>
        <div>
          <h2>{isRussian ? 'Подписка Plus' : 'Plus subscription'}</h2>
          <p>{isRussian ? 'Безопасная ежемесячная оплата через Polar.' : 'Secure monthly billing through Polar.'}</p>
        </div>
      </div>
      <div className="plus-price"><strong>₸1,999.99</strong><span>/{isRussian ? 'месяц' : 'month'}</span></div>
      {checkoutSucceeded && subscription?.active && (
        <p className="plus-success">{isRussian ? 'Plus успешно подключён!' : 'Plus is now active!'}</p>
      )}
      {state.kind === 'loading' && <p className="plus-status">{isRussian ? 'Проверяю подписку…' : 'Checking subscription…'}</p>}
      {state.kind === 'error' && <p className="plus-error">{state.message}</p>}
      {subscription?.active && (
        <p className="plus-status">
          {subscription.cancelAtPeriodEnd
            ? isRussian ? `Доступ до ${renewalDate ?? 'конца периода'}` : `Access until ${renewalDate ?? 'period end'}`
            : isRussian ? `Активна${renewalDate ? ` · продление ${renewalDate}` : ''}` : `Active${renewalDate ? ` · renews ${renewalDate}` : ''}`}
        </p>
      )}
      {state.kind === 'ready' && (
        <button disabled={isRedirecting} onClick={() => openPolar(subscription?.active ? 'portal' : 'checkout')} type="button">
          {isRedirecting ? '…' : subscription?.active
            ? isRussian ? 'Управлять подпиской' : 'Manage subscription'
            : isRussian ? 'Подключить Plus' : 'Get Plus'}
        </button>
      )}
    </section>
  );
}
