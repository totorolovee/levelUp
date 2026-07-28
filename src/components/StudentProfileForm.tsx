import type { StudentProfile } from '../lib/universities';

type Props = {
  profile: StudentProfile;
  onChange: (profile: StudentProfile) => void;
};

export function StudentProfileForm({ profile, onChange }: Props) {
  const update = <Key extends keyof StudentProfile>(key: Key, value: StudentProfile[Key]) => {
    onChange({ ...profile, [key]: value });
  };

  return (
    <section className="student-profile">
      <p className="eyebrow">Твой профиль</p>
      <h2>Что уже готово?</h2>
      <label>
        Текущий IELTS
        <input
          inputMode="decimal"
          max="9"
          min="0"
          onChange={(event) => update('ielts', event.target.value)}
          placeholder="Например: 6.5"
          step="0.5"
          type="number"
          value={profile.ielts}
        />
      </label>
      <ProfileCheck
        checked={profile.hasSatOrAct}
        label="У меня есть результат SAT или ACT"
        onChange={(checked) => update('hasSatOrAct', checked)}
      />
      <ProfileCheck
        checked={profile.hasEssayDraft}
        label="Я начал писать вступительное эссе"
        onChange={(checked) => update('hasEssayDraft', checked)}
      />
      <ProfileCheck
        checked={profile.hasRecommendations}
        label="Я выбрал учителей для рекомендаций"
        onChange={(checked) => update('hasRecommendations', checked)}
      />
    </section>
  );
}

function ProfileCheck({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="profile-check">
      <input checked={checked} onChange={(event) => onChange(event.target.checked)} type="checkbox" />
      <span>{label}</span>
    </label>
  );
}
