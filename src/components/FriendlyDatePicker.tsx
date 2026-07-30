import { useLanguage } from '../lib/language';

type Props = {
  ariaLabel: string;
  onChange: (value: string) => void;
  value: string;
};

export function FriendlyDatePicker({ ariaLabel, onChange, value }: Props) {
  const { language } = useLanguage();
  const isRussian = language === 'ru';

  return (
    <div className="friendly-date-picker">
      <span aria-hidden="true">
        {value
          ? `${isRussian ? 'До' : 'Due'} ${new Intl.DateTimeFormat(
            isRussian ? 'ru-RU' : 'en-US',
            { day: 'numeric', month: 'long', year: 'numeric' },
          ).format(new Date(`${value}T00:00:00`))}`
          : (isRussian ? 'Выбрать дедлайн' : 'Choose deadline')}
      </span>
      <input
        aria-label={ariaLabel}
        min={new Date().toISOString().slice(0, 10)}
        onChange={(event) => onChange(event.target.value)}
        type="date"
        value={value}
      />
    </div>
  );
}
