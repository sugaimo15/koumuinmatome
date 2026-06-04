import Fuse from 'fuse.js';
import type { Exam } from '@/types/exam';

let fuse: Fuse<Exam> | null = null;

export function createSearchIndex(exams: Exam[]): Fuse<Exam> {
  fuse = new Fuse(exams, {
    keys: [
      { name: 'name', weight: 2 },
      { name: 'shortName', weight: 2 },
      { name: 'overview.description', weight: 1 },
      { name: 'overview.tags', weight: 1.5 },
      { name: 'subjects.name', weight: 1 },
    ],
    threshold: 0.4,
    includeScore: true,
  });
  return fuse;
}

export function searchExams(query: string, exams: Exam[]): Exam[] {
  if (!query.trim()) return exams;
  if (!fuse) createSearchIndex(exams);
  const results = fuse!.search(query);
  return results.map((r) => r.item);
}
