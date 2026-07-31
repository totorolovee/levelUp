import {
  faceNameNames,
  faceNameProfiles,
  type FaceNameProfile,
  type LocalizedText,
} from './faceNamePeople';

export type FaceNameSessionPerson = FaceNameProfile & { name: LocalizedText };

export function shuffled<T>(items: T[]) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

export function createFaceNameSession(peopleCount: number): FaceNameSessionPerson[] {
  const names = {
    female: shuffled(faceNameNames.female),
    male: shuffled(faceNameNames.male),
  };
  const used = { female: 0, male: 0 };
  return shuffled(faceNameProfiles).slice(0, peopleCount).map((profile) => {
    const name = names[profile.gender][used[profile.gender]];
    used[profile.gender] += 1;
    return { ...profile, name };
  });
}
