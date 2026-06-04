import fs from 'fs';
import path from 'path';
import type { Municipality, PrefectureIndex, RegionIndex } from '@/types/municipality';

const MUNICIPALITIES_DIR = path.join(process.cwd(), 'src/data/municipalities');

export function getPrefectureList(): RegionIndex[] {
  const file = path.join(MUNICIPALITIES_DIR, 'prefectures.json');
  return JSON.parse(fs.readFileSync(file, 'utf-8')) as RegionIndex[];
}

export function getPrefectureIndex(prefectureSlug: string): PrefectureIndex | null {
  const file = path.join(MUNICIPALITIES_DIR, prefectureSlug, 'index.json');
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf-8')) as PrefectureIndex;
}

export function getMunicipality(prefectureSlug: string, citySlug: string): Municipality | null {
  const file = path.join(MUNICIPALITIES_DIR, prefectureSlug, `${citySlug}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf-8')) as Municipality;
}

export function getAllMunicipalityParams(): { prefectureSlug: string; citySlug: string }[] {
  const regions = getPrefectureList();
  const params: { prefectureSlug: string; citySlug: string }[] = [];

  for (const region of regions) {
    for (const pref of region.prefectures) {
      const prefDir = path.join(MUNICIPALITIES_DIR, pref.slug);
      if (!fs.existsSync(prefDir)) continue;
      const index = getPrefectureIndex(pref.slug);
      if (!index) continue;
      for (const m of index.municipalities) {
        params.push({ prefectureSlug: pref.slug, citySlug: m.slug });
      }
    }
  }
  return params;
}

export function getAllPrefectureParams(): { prefectureSlug: string }[] {
  const regions = getPrefectureList();
  return regions.flatMap((r) =>
    r.prefectures
      .filter((p) => {
        const dir = path.join(MUNICIPALITIES_DIR, p.slug);
        return fs.existsSync(dir);
      })
      .map((p) => ({ prefectureSlug: p.slug }))
  );
}

export function municipalityTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    prefecture: '都道府県',
    city: '市',
    'designated-city': '政令指定都市',
    town: '町',
    village: '村',
    'special-ward': '特別区',
  };
  return labels[type] ?? type;
}
