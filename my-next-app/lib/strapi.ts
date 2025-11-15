export type StrapiRichTextBlock = {
  type: string;
  children: { type: string; text: string }[];
};

export type StrapiArticle = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  content: StrapiRichTextBlock[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type StrapiService = {
  id: number;
  documentId: string; // если есть в ответе
  title: string;
  description: StrapiRichTextBlock[];
  price: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

const STRAPI_URL = process.env.STRAPI_URL ?? 'http://localhost:1337';

async function strapiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${STRAPI_URL}${path}`, {
    cache: 'no-store',
    ...init,
  });

  if (!res.ok) {
    console.error(`Strapi error: ${res.status} ${res.statusText}`);
    throw new Error('Failed to fetch from Strapi');
  }

  const json = await res.json();
  return json.data as T;
}

export async function getArticles(): Promise<StrapiArticle[]> {
  return strapiFetch<StrapiArticle[]>('/api/articles');
}

export async function getServices(): Promise<StrapiService[]> {
  return strapiFetch<StrapiService[]>('/api/services');
}

export async function getArticleBySlug(
  slug: string
): Promise<StrapiArticle | null> {
  const data = await strapiFetch<StrapiArticle[]>(
    `/api/articles?filters[slug][$eq]=${encodeURIComponent(slug)}`
  );

  // Strapi всегда возвращает массив в "data"
  if (!data || data.length === 0) {
    return null;
  }

  return data[0];
}

