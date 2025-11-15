import { getArticles } from "@/lib/strapi";
import PostCard from "@/app/components/PostCard";
import Link from "next/link";

export default async function BlogPage() {
  const articles = await getArticles();

  return (
    <main style={{ padding: "40px 20px", maxWidth: 900, margin: "0 auto" }}>
      <Link href="/">Главная</Link>
      <h1
        style={{
          fontSize: 40,
          fontWeight: 700,
          marginBottom: 30,
        }}
      >
        Все статьи
      </h1>

      {articles.length === 0 && (
        <p>Пока нет статей... Добавьте первую в Strapi.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {articles.map((article) => (
          <PostCard key={article.id} article={article} />
        ))}
      </div>
    </main>
  );
}
