export function formatRatio(ratio: number): string {
  return `${ratio.toFixed(1)}倍`;
}

export function formatApplicants(count: number): string {
  return `${count.toLocaleString('ja-JP')}人`;
}

export function formatSalary(amount: number): string {
  return `${amount.toLocaleString('ja-JP')}万円`;
}

export function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-');
  if (!day) return `${year}年${month}月`;
  return `${year}年${Number(month)}月${Number(day)}日`;
}

export function difficultyLabel(level: number): string {
  const labels = ['', '易しい', '普通', 'やや難', '難しい', '最難関'];
  return labels[level] ?? '';
}

export function educationLabel(edu: string): string {
  const labels: Record<string, string> = {
    university: '大卒程度',
    'junior-college': '短大卒程度',
    'high-school': '高卒程度',
  };
  return labels[edu] ?? edu;
}

export function categoryLabel(category: string): string {
  const labels: Record<string, string> = {
    national: '国家公務員',
    local: '地方公務員',
    technical: '技術系専門職',
    security: '公安・消防・自衛隊',
  };
  return labels[category] ?? category;
}

export function eventTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'application-start': '申込開始',
    'application-end': '申込締切',
    'exam-written': '一次試験',
    'exam-result': '合格発表',
    'exam-interview': '二次試験',
    'exam-final-result': '最終合格発表',
    appointment: '採用内定',
  };
  return labels[type] ?? type;
}

export function subjectTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    written: '筆記（多肢選択）',
    essay: '記述・論文',
    interview: '面接',
    physical: '体力検査',
    practical: '実技',
  };
  return labels[type] ?? type;
}
