import { getArticles, getServices } from '@/lib/strapi';
import PostCard from "@/app/components/PostCard";
import PostService from './components/PostService';
import "./globals.css";
import Link from 'next/link';

export default async function Home() {
  const [articles, services] = await Promise.all([
    getArticles(),
    getServices(),
  ]);
  return (
    <main style={{ padding: 40 }}>
      <Link href="/blog">Блог</Link>
      <h1>Next.js + Strapi: статьи</h1>
      {articles.length === 0 && <p>Пока нет статей...</p>}
      <ul className='post-wrapper'>
        {articles.map((article) => (
          <PostCard key={article.id} article={article} />
        ))}
      </ul>
      

      <h1>Next.js + Strapi: услуги</h1>
      {services.length === 0 && <p>Пока нет услуг...</p>}
      <ul className='post-wrapper'>
        {services.map((service) => (
          <PostService key={service.id} service={service} />
        ))}
      </ul>
    </main>
  );
}
