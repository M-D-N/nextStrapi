export type StrapiRichTextBlock = {
  type: string;
  children: { type: string; text: string }[];
};
export type ArticleSeo = {
  metaTitle?: string | null;
  metaDescription?: string | null;
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
  seo?: ArticleSeo | null;
  cover?: StrapiMedia | null; // ← вот это добавили
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

export type StrapiMediaFormat = {
  url: string;
  width: number;
  height: number;
};

export type StrapiMedia = {
  url: string;
  width: number;
  height: number;
  alternativeText?: string | null;
  formats?: {
    thumbnail?: StrapiMediaFormat;
    small?: StrapiMediaFormat;
    medium?: StrapiMediaFormat;
    large?: StrapiMediaFormat;
  };
};


export const STRAPI_URL =
  process.env.STRAPI_URL ?? "http://localhost:1337";

async function strapiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${STRAPI_URL}${path}`, {
    cache: "no-store",
    ...init,
  });

  if (!res.ok) {
    console.error(`Strapi error: ${res.status} ${res.statusText} for ${path}`);
    throw new Error("Failed to fetch from Strapi");
  }

  const json = await res.json();
  return json.data as T;
}

export async function getArticles(): Promise<StrapiArticle[]> {
  return strapiFetch<StrapiArticle[]>("/api/articles?populate=*");
}

export async function getArticleBySlug(
  slug: string
): Promise<StrapiArticle | null> {
  const data = await strapiFetch<StrapiArticle[]>(
    `/api/articles?filters[slug][$eq]=${encodeURIComponent(
      slug
    )}&populate=*`
  );

  if (!data || data.length === 0) return null;
  return data[0];
}



export async function getServices(): Promise<StrapiService[]> {
  return strapiFetch<StrapiService[]>('/api/services');
}

