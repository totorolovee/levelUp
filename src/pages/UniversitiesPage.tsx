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
  universityRegions,
  type StudentProfile,
  type University,
  type UniversityDirection,
  type UniversityRegion,
} from '../lib/universities';
import {
  universitySpecialties,
  type UniversitySpecialty,
} from '../lib/universitySpecialties';

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
const initialRegions = filterRegions(initialSpecialty, initialDirection);

export function UniversitiesPage() {
  const [direction, setDirection] = useState<UniversityDirection>(initialDirection);
  const [specialty, setSpecialty] = useState<UniversitySpecialty>(initialSpecialty);
  const [region, setRegion] = useState<UniversityRegion>(initialRegions[0]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<University>(region.universities[0]);
  const [profile, setProfile] = useState<StudentProfile>(initialProfile);
  const filtered = useMemo(() => {
    const search = query.trim().toLocaleLowerCase('ru');
    if (!search) return region.universities;
    return region.universities.filter((university) =>
      `${university.name} ${university.shortName} ${university.location}`
        .toLocaleLowerCase('ru')
        .includes(search),
    );
  }, [query, region, specialty]);

  const selectRegion = (nextRegion: UniversityRegion) => {
    setRegion(nextRegion);
    setQuery('');
    setSelected(nextRegion.universities[0]);
  };

  const selectDirection = (nextDirection: UniversityDirection) => {
    const nextSpecialty = universitySpecialties.find(
      ({ directionId }) => directionId === nextDirection.id,
    ) ?? universitySpecialties[0];
    const nextRegions = filterRegions(nextSpecialty, nextDirection);
    setDirection(nextDirection);
    setSpecialty(nextSpecialty);
    setRegion(nextRegions[0]);
    setQuery('');
    setSelected(nextRegions[0].universities[0]);
  };

  const selectSpecialty = (nextSpecialty: UniversitySpecialty) => {
    const nextRegions = filterRegions(nextSpecialty, direction);
    setSpecialty(nextSpecialty);
    setRegion(nextRegions[0]);
    setQuery('');
    setSelected(nextRegions[0].universities[0]);
  };

  const specialtiesForDirection = useMemo(
    () => universitySpecialties.filter(({ directionId }) => directionId === direction.id),
    [direction],
  );
  const regionsForSpecialty = useMemo(
    () => filterRegions(specialty, direction),
    [direction, specialty],
  );

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
      <DirectionPicker
        directions={universityDirections}
        onSelect={selectDirection}
        selectedId={direction.id}
      />
      <SpecialtyPicker
        onSelect={selectSpecialty}
        selectedId={specialty.id}
        specialties={specialtiesForDirection}
      />
      <RegionPicker onSelect={selectRegion} regions={regionsForSpecialty} selectedId={region.id} />
      <div className="university-layout">
        <UniversitySearch
          onQueryChange={setQuery}
          onSelect={setSelected}
          query={query}
          selectedId={selected.id}
          universities={filtered}
        />
        <UniversityDetails specialty={specialty.name} university={selected} />
      </div>
      <div className="readiness-layout">
        <StudentProfileForm onChange={setProfile} profile={profile} />
        <ReadinessPanel profile={profile} specialty={specialty.name} university={selected} />
      </div>
      <p className="admission-disclaimer">
        Это навигатор для подготовки, а не гарантия поступления. Перед подачей всегда проверяй официальный сайт.
      </p>
    </main>
  );
}

function filterRegions(
  specialty: UniversitySpecialty,
  direction: UniversityDirection,
): UniversityRegion[] {
  const specialtyIds = new Set(specialty.universityIds);
  const directionIds = new Set(direction.universityIds);
  return universityRegions
    .map((region) => ({
      ...region,
      universities: region.universities.filter(
        (university) =>
          specialtyIds.has(university.id) && directionIds.has(university.id),
      ),
    }))
    .filter((region) => region.universities.length > 0);
}
