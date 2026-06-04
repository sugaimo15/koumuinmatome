import fs from 'fs';
import path from 'path';
import type { Exam, ExamCategory, ExamCategoryMeta } from '@/types/exam';

const DATA_DIR = path.join(process.cwd(), 'src/data/exams');
const CATEGORIES_FILE = path.join(process.cwd(), 'src/data/categories.json');

let _exams: Exam[] | null = null;

export function getAllExams(): Exam[] {
  if (_exams) return _exams;
  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.json'));
  _exams = files.map((file) => {
    const raw = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
    return JSON.parse(raw) as Exam;
  });
  return _exams;
}

export function getExamById(id: string): Exam | undefined {
  return getAllExams().find((e) => e.id === id);
}

export function getExamsByCategory(category: ExamCategory): Exam[] {
  return getAllExams().filter((e) => e.category === category);
}

export function getAllExamIds(): { category: string; examId: string }[] {
  return getAllExams().map((e) => ({ category: e.category, examId: e.id }));
}

export function getCategories(): ExamCategoryMeta[] {
  const raw = fs.readFileSync(CATEGORIES_FILE, 'utf-8');
  return JSON.parse(raw) as ExamCategoryMeta[];
}

export function filterExams(params: {
  category?: ExamCategory;
  difficulty?: number;
  education?: string;
  query?: string;
}): Exam[] {
  let exams = getAllExams();
  if (params.category) {
    exams = exams.filter((e) => e.category === params.category);
  }
  if (params.difficulty) {
    exams = exams.filter((e) => e.overview.difficulty === params.difficulty);
  }
  if (params.education) {
    exams = exams.filter((e) => e.overview.education === params.education);
  }
  return exams;
}
