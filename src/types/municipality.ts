import type { ExamStats, DifficultyLevel } from './exam';

export type MunicipalityType = 'prefecture' | 'city' | 'designated-city' | 'town' | 'village' | 'special-ward';

export interface ExamTypeSchedule {
  applicationStart?: string;
  applicationEnd?: string;
  firstExam?: string;
  firstResult?: string;
  secondExam?: string;
  finalResult?: string;
  note?: string;
}

export interface ExamTypeEligibility {
  description: string;
  ageMax?: number;
  ageNote?: string;
  education?: string;
}

export interface MunicipalityExamType {
  name: string;
  schedule: ExamTypeSchedule;
  eligibility: ExamTypeEligibility;
}

export interface Municipality {
  id: string;
  slug: string;
  prefectureSlug: string;
  prefectureName: string;
  name: string;
  type: MunicipalityType;
  overview: {
    description: string;
    difficulty: DifficultyLevel;
    tags: string[];
  };
  examTypes: MunicipalityExamType[];
  stats: ExamStats[];
  officialUrl: string;
  lastUpdated: string;
}

export interface PrefectureIndex {
  slug: string;
  name: string;
  region: string;
  municipalities: {
    slug: string;
    name: string;
    type: MunicipalityType;
  }[];
}

export interface RegionIndex {
  name: string;
  prefectures: {
    slug: string;
    name: string;
  }[];
}
