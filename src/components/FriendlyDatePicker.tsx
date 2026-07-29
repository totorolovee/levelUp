import { useRef } from 'react';
import { useLanguage } from '../lib/language';

type Props = {
  ariaLabel: string;
  onChange: (value: string) => void;
  value: string;
};

export function FriendlyDatePicker({ ariaLabel, onChange, value }: Props) {
  const { language } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const isRussian = language === 'ru';

  const open = () => {
    const input = inputRef.current;
    if (!input) return;
    if (typeof input.showPicker === 'function') input.showPicker();
    else input.click();
  };

  return (
    <div className="friendly-date-picker">
      <button onClick={open} type="button">
        {value
          ? `${isRussian ? 'До' : 'Due'} ${new Intl.DateTimeFormat(
            isRussian ? 'ru-RU' : 'en-US',
            { day: 'numeric', month: 'long', year: 'numeric' },
          ).format(new Date(`${value}T00:00:00`))}`
          : (isRussian ? 'Выбрать дедлайн' : 'Choose deadline')}
      </button>
      <input
        aria-label={ariaLabel}
        min={new Date().toISOString().slice(0, 10)}
        onChange={(event) => onChange(event.target.value)}
        ref={inputRef}
        tabIndex={-1}
        type="date"
        value={value}
      />
    </div>
  );
}
