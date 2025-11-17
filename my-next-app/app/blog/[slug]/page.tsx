import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  getArticleBySlug,
  STRAPI_URL,
  StrapiRichTextBlock,
} from "@/lib/strapi";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// —— helpers ——

// универсальный хелпер для извлечения URL/размера обложки
function getCoverImage(cover: any): { url: string; width: number; height: number } | null {
  if (!cover) return null;

  // Вариант 1: плоский объект (Strapi v5)
  if (typeof cover.url === "string") {
    const fmt = cover.formats?.medium || cover.formats?.small || cover;
    return {
      url: fmt.url,
      width: fmt.width ?? cover.width ?? 1200,
      height: fmt.height ?? cover.height ?? 600,
    };
  }

  // Вариант 2: cover.data.attributes.* (классический Strapi вид)
  const data = cover.data;
  if (data) {
    const attrs = data.attributes ?? data;
    if (typeof attrs.url === "string") {
      const fmt = attrs.formats?.medium || attrs.formats?.small || attrs;
      return {
        url: fmt.url,
        width: fmt.width ?? attrs.width ?? 1200,
        height: fmt.height ?? attrs.height ?? 600,
      };
    }
  }

  return null;
}

// вытаскиваем весь текст из rich-text блоков Strapi
function extractPlainText(blocks?: StrapiRichTextBlock[]): string {
  if (!blocks || !Array.isArray(blocks)) return "";

  return blocks
    .flatMap((block) => block.children ?? [])
    .map((child) => child.text)
    .join(" ");
}

// форматируем дату публикации
function formatDate(dateString?: string) {
  if (!dateString) return "";
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

// рендер контента статьи (пока только параграфы)
function renderRichText(blocks?: StrapiRichTextBlock[]) {
  if (!blocks || !Array.isArray(blocks)) return null;

  return blocks.map((block, index) => {
    if (block.type === "paragraph") {
      const text =
        block.children?.map((child) => child.text).join(" ") ?? "";
      return (
        <p key={index} style={{ marginBottom: 16, lineHeight: 1.6 }}>
          {text}
        </p>
      );
    }

    return null;
  });
}

// —— SEO metadata —— //

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Статья не найдена",
      description: "Такой статьи не существует или она была удалена.",
    };
  }

  const fullText = extractPlainText(article.content);
  const contentFallback =
    fullText.length > 150 ? fullText.slice(0, 150).trim() + "..." : fullText;

  const metaTitle =
    // поддерживаем оба варианта поля: SEO и seo
    (article as any).SEO?.metaTitle ||
    (article as any).seo?.metaTitle ||
    article.title;

  const metaDescription =
    (article as any).SEO?.metaDescription ||
    (article as any).seo?.metaDescription ||
    contentFallback ||
    "Статья в блоге";

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: "article",
    },
  };
}

// —— сама страница статьи —— //

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const coverImage = getCoverImage((article as any).cover);

  return (
    <main style={{ padding: 40, maxWidth: 800, margin: "0 auto" }}>
      {coverImage && (
        <div
          style={{
            marginBottom: 24,
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          <Image
            src={STRAPI_URL + coverImage.url}
            alt={(article as any).cover?.alternativeText || article.title}
            width={coverImage.width}
            height={coverImage.height}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
      )}

      <h1 style={{ marginBottom: 12, fontSize: 32, fontWeight: 700 }}>
        {article.title}
      </h1>

      <p style={{ color: "#666", marginBottom: 24, fontSize: 14 }}>
        Опубликовано: {formatDate((article as any).publishedAt)}
      </p>

      <article>{renderRichText(article.content)}</article>

      <a
        href="/blog"
        style={{
          display: "inline-block",
          marginTop: 32,
          color: "#0070f3",
          textDecoration: "none",
        }}
      >
        ← Назад ко всем статьям
      </a>
    </main>
  );
}

