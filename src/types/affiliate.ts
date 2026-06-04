export interface AffiliateItem {
  id: string;
  title: string;
  url: string;
  type: 'book' | 'course';
  price?: string;
  publisher?: string;
  description?: string;
  examIds: string[];
  imageUrl?: string;
}
