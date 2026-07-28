import { useMemo, useState } from 'react';
import { AppHeader } from '../components/AppHeader';
import { DirectionPicker } from '../components/DirectionPicker';
import { ReadinessPanel } from '../components/ReadinessPanel';
import { RegionPicker } from '../components/RegionPicker';
import { SpecialtyPicker } from '../components/SpecialtyPicker';
import { StudentProfileForm } from '../components/StudentProfileForm';
import { UniversityDetails } from '../components/UniversityDetails';
import { UniversitySearch } from '../components/UniversitySearch';
import {
  universityDirections,
  type StudentProfile,
  type University,
  type UniversityDirection,
  type UniversityRegion,
} from '../lib/universities';
import {
  filterRegionsForSpecialty,
  universitySpecialties,
  type UniversitySpecialty,
} from '../lib/universitySpecialties';
import { qsWorldRankings2027 } from '../lib/universityRankings';
import { useLanguage } from '../lib/language';
import { getSpecialtyTranslation } from '../lib/universityTranslations';

const initialProfile: StudentProfile = {
  ielts: '',
  hasSatOrAct: false,
  hasEssayDraft: false,
  hasRecommendations: false,
};
const initialDirection = universityDirections[0];
const initialSpecialty = universitySpecialties.find(
  ({ directionId }) => directionId === initialDirection.id,
) ?? universitySpecialties[0];
const initialRegions = filterRegionsForSpecialty(initialSpecialty, initialDirection);

export function UniversitiesPage() {
  const { language } = useLanguage();
  const [direction, setDirection] = useState<UniversityDirection>(initialDirection);
  const [specialty, setSpecialty] = useState<UniversitySpecialty>(initialSpecialty);
  const [selectedRegions, setSelectedRegions] = useState<UniversityRegion[]>([initialRegions[0]]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<University>(initialRegions[0].universities[0]);
  const [profile, setProfile] = useState<StudentProfile>(initialProfile);
  const selectedUniversities = useMemo(
    () => selectedRegions
      .flatMap((region) => region.universities)
      .sort(
        (first, second) =>
          Number(qsWorldRankings2027[first.id] ?? Number.POSITIVE_INFINITY)
          - Number(qsWorldRankings2027[second.id] ?? Number.POSITIVE_INFINITY),
      ),
    [selectedRegions],
  );
  const filtered = useMemo(() => {
    const search = query.trim().toLocaleLowerCase('ru');
    if (!search) return selectedUniversities;
    return selectedUniversities.filter((university) =>
      `${university.name} ${university.shortName} ${university.location}`
        .toLocaleLowerCase('ru')
        .includes(search),
    );
  }, [query, selectedUniversities]);

  const selectRegion = (nextRegion: UniversityRegion) => {
    const isSelected = selectedRegions.some(({ id }) => id === nextRegion.id);
    if (isSelected && selectedRegions.length === 1) return;
    const nextRegions = isSelected
      ? selectedRegions.filter(({ id }) => id !== nextRegion.id)
      : [...selectedRegions, nextRegion];
    const nextUniversities = nextRegions.flatMap(({ universities }) => universities);
    setSelectedRegions(nextRegions);
    setQuery('');
    if (!nextUniversities.some(({ id }) => id === selected.id)) {
      setSelected(nextUniversities[0]);
    }
  };

  const selectDirection = (nextDirection: UniversityDirection) => {
    const nextSpecialty = universitySpecialties.find(
      ({ directionId }) => directionId === nextDirection.id,
    ) ?? universitySpecialties[0];
    const nextRegions = filterRegionsForSpecialty(nextSpecialty, nextDirection);
    setDirection(nextDirection);
    setSpecialty(nextSpecialty);
    setSelectedRegions([nextRegions[0]]);
    setQuery('');
    setSelected(nextRegions[0].universities[0]);
  };

  const selectSpecialty = (nextSpecialty: UniversitySpecialty) => {
    const nextRegions = filterRegionsForSpecialty(nextSpecialty, direction);
    setSpecialty(nextSpecialty);
    setSelectedRegions([nextRegions[0]]);
    setQuery('');
    setSelected(nextRegions[0].universities[0]);
  };

  const specialtiesForDirection = useMemo(
    () => universitySpecialties.filter(({ directionId }) => directionId === direction.id),
    [direction],
  );
  const regionsForSpecialty = useMemo(
    () => filterRegionsForSpecialty(specialty, direction),
    [direction, specialty],
  );
  const specialtyDisplayName = getSpecialtyTranslation(specialty, language)?.name
    ?? specialty.name;

  return (
    <main className="shell">
      <AppHeader />
      <header className="page-intro university-intro">
        <div>
          <p className="eyebrow">Admission navigator</p>
          <h1>Поступление без хаоса</h1>
          <p>Выбери направление, специальность, регион и университет — затем сравни требования.</p>
        </div>
      </header>
      <DirectionPicker directions={universityDirections} onSelect={selectDirection} selectedId={direction.id} />
      <SpecialtyPicker
        onSelect={selectSpecialty}
        selectedId={specialty.id}
        specialties={specialtiesForDirection}
      />
      <RegionPicker
        onSelect={selectRegion}
        regions={regionsForSpecialty}
        selectedIds={selectedRegions.map(({ id }) => id)}
      />
      <div className="university-layout">
        <UniversitySearch
          onQueryChange={setQuery}
          onSelect={setSelected}
          query={query}
          selectedId={selected.id}
          universities={filtered}
        />
        <UniversityDetails specialty={specialtyDisplayName} university={selected} />
      </div>
      <div className="readiness-layout">
        <StudentProfileForm onChange={setProfile} profile={profile} />
        <ReadinessPanel profile={profile} specialty={specialtyDisplayName} university={selected} />
      </div>
      <p className="admission-disclaimer">
        Это навигатор для подготовки, а не гарантия поступления. Перед подачей всегда проверяй официальный сайт.
      </p>
    </main>
  );
}
