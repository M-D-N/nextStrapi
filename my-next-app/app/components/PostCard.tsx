// app/components/PostCard.tsx
import Image from "next/image";
import Link from "next/link";
import {
  STRAPI_URL,
  StrapiArticle,
  StrapiRichTextBlock,
} from "@/lib/strapi";
import "./PostCard.css";

function extractPreview(blocks: StrapiRichTextBlock[]): string {
  const first = blocks?.[0]?.children?.[0]?.text ?? "";
  return first.length > 120 ? first.slice(0, 120) + "..." : first;
}

export default function PostCard({ article }: { article: StrapiArticle }) {
  const preview = extractPreview(article.content);

  const coverImage = getCoverImage(article.cover);
  const cover = article.cover;
  // выбираем удобный формат, но дальше всё равно проверим url
  const imageCandidate =
    cover?.formats?.medium ||
    cover?.formats?.small ||
    cover ||
    null;

  const imageUrl =
    imageCandidate && imageCandidate.url
      ? STRAPI_URL + imageCandidate.url
      : null;

  

  return (
    <div className="post-card">
      {imageUrl && (
        <div className="post-card-image">
          <Image
            src={STRAPI_URL + coverImage.url}
            alt={cover?.alternativeText || article.title}
            width={image.width || 800}
            height={image.height || 400}
          />
        </div>
      )}

      <div className="post-card-body">
        <h2 className="post-title">
          <Link href={`/blog/${article.slug}`}>{article.title}</Link>
        </h2>
        <p className="post-desc">{preview}</p>
        <Link href={`/blog/${article.slug}`} className="post-readmore">
          Читать далее →
        </Link>
      </div>
    </div>
  );
}
