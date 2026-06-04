export type ExamCategory = 'national' | 'local' | 'technical' | 'security';

export type EducationRequirement = 'university' | 'junior-college' | 'high-school';

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export interface ExamSubject {
  name: string;
  type: 'written' | 'essay' | 'interview' | 'physical' | 'practical';
  description: string;
  questionCount?: number;
  duration?: number;
  weight?: string;
}

export interface ExamStats {
  year: number;
  applicantCount: number;
  passCount: number;
  competitionRatio: number;
  hireCount?: number;
}

export interface Exam {
  id: string;
  slug: string;
  category: ExamCategory;
  subcategory?: string;
  name: string;
  shortName: string;
  overview: {
    description: string;
    difficulty: DifficultyLevel;
    ageLimit: {
      min?: number;
      max: number;
      note?: string;
    };
    education: EducationRequirement;
    educationNote?: string;
    salaryRange?: {
      min: number;
      max: number;
    };
    workLocation?: string;
    tags: string[];
  };
  subjects: ExamSubject[];
  stats: ExamStats[];
  relatedExamIds?: string[];
  officialUrl: string;
  lastUpdated: string;
}

export interface ExamCategoryMeta {
  id: ExamCategory;
  label: string;
  description: string;
  color: string;
  examIds: string[];
}
