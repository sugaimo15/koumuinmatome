import type { ExamSubject, ExamStats, EducationRequirement, DifficultyLevel } from './exam';

export type MunicipalityType = 'prefecture' | 'city' | 'designated-city' | 'town' | 'village' | 'special-ward';

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
    ageLimit: { max: number; note?: string };
    education: EducationRequirement;
    salaryRange?: { min: number; max: number };
    workLocation?: string;
    tags: string[];
  };
  subjects: ExamSubject[];
  examSchedule?: {
    applicationStart?: string;
    applicationEnd?: string;
    firstExam?: string;
    firstResult?: string;
    secondExam?: string;
    finalResult?: string;
    note?: string;
  };
  salaryDetail?: {
    startingSalary?: number;
    note?: string;
  };
  jobTypes?: string[];
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
