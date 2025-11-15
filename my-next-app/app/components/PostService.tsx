// app/components/PostCard.tsx
// import Link from "next/link";
import type { StrapiService, StrapiRichTextBlock } from "@/lib/strapi";
import "./PostServices.css";

function extractPreview(blocks: StrapiRichTextBlock[]): string {
  const first = blocks?.[0]?.children?.[0]?.text ?? "";
  return first.length > 25 ? first.slice(0, 25) + "..." : first;
}

export default function PostService({ service }: { service: StrapiService }) {
    const firstText = extractPreview(service.description);
    return (
        <li className="services__card">
            <h2 className="services__card-title">{service.title}</h2>
            <p className="services__card-txt">{firstText}</p>
            <span className="services__card-price">{service.price}</span>
        </li>
    );
}
