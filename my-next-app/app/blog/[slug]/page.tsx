import { notFound } from 'next/navigation';
import { getArticleBySlug, StrapiRichTextBlock } from '@/lib/strapi';
import "./post.css";
import type { Metadata } from "next";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Статья не найдена",
    };
  }

  const short =
    article.content?.[0]?.children?.[0]?.text?.slice(0, 150) ||
    "Описание статьи";

  return {
    title: `${article.title} — Блог`,
    description: short,
    openGraph: {
      title: article.title,
      description: short,
      type: "article",
    },
  };
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(dateString: string) {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
// простейший рендерер rich text (только параграфы)
function renderRichText(blocks: StrapiRichTextBlock[] | undefined) {
  if (!blocks || !Array.isArray(blocks)) return null;

  return blocks.map((block, index) => {
    if (block.type === 'paragraph') {
      const text =
        block.children?.map((child) => child.text).join(' ') ?? '';
      return (
        <p key={index} style={{ marginBottom: 16 }}>
          {text}
        </p>
      );
    }

    // остальные типы пока игнорим
    return null;
  });
}

export default async function ArticlePage({ params }: PageProps) {
  // ВАЖНО: ждем params
  const { slug } = await params;

  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound(); // отдаст 404 если статьи нет
  }

  return (
    <div className="post-wraper">
      <h1 className="post-heading">{article.title}</h1>

      <div className="post-meta">
        Опубликовано: {formatDate(article.publishedAt)}
      </div>

      <article className="post-content">
        {renderRichText(article.content)} 
      </article>

      <a href="/" className="back-btn">← Назад на главную</a>
    </div>
  );
}
