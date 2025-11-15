// app/components/PostCard.tsx
import Link from "next/link";
import type { StrapiArticle, StrapiRichTextBlock } from "@/lib/strapi";
import "./PostCard.css";

function extractPreview(blocks: StrapiRichTextBlock[]): string {
  const first = blocks?.[0]?.children?.[0]?.text ?? "";
  return first.length > 25 ? first.slice(0, 25) + "..." : first;
}

export default function PostCard({ article }: { article: StrapiArticle }) {
  return (
    <div className="post-card">
        <h2 className="post-title">
            <Link href={`/blog/${article.slug}`}>
            {article.title}
            </Link>
        </h2>

        <p className="post-desc">{extractPreview(article.content)}</p>

        <Link href={`/blog/${article.slug}`} className="post-readmore">
            Читать далее →
        </Link>
    </div>
  );
}
