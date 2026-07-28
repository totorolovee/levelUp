import type { StudentProfile } from '../lib/universities';

const ieltsScores = Array.from({ length: 19 }, (_, index) => (index / 2).toFixed(1));

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
        <select
          onChange={(event) => update('ielts', event.target.value)}
          value={profile.ielts}
        >
          <option value="">Выбери результат</option>
          {ieltsScores.map((score) => (
            <option key={score} value={score}>{score}</option>
          ))}
        </select>
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
