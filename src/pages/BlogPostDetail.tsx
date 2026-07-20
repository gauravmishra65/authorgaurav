import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Seo from '../components/Seo';
import SocialShareButtons from '../components/SocialShareButtons';
import { fetchBlogPosts } from '../lib/queries';
import { useSupabaseData } from '../lib/useSupabaseData';

export default function BlogPostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: posts, loading, error } = useSupabaseData(fetchBlogPosts, []);

  if (loading) return <div className="py-32 text-center text-muted">Loading…</div>;
  if (error) return <div className="py-32 text-center text-rose">Couldn't load this post: {error}</div>;

  const post = posts?.find((p) => p.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  const canonicalUrl = `https://authorgaurav.com/blog/${post.slug}`;
  const paragraphs = (post.content ?? post.excerpt).split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <>
      <Seo
        title={`${post.title} — Gaurav Mishra`}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'BlogPosting',
              headline: post.title,
              description: post.excerpt,
              author: { '@type': 'Person', name: 'Gaurav Mishra' },
              datePublished: post.date,
              articleSection: post.category,
              url: canonicalUrl,
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://authorgaurav.com/' },
                { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://authorgaurav.com/blog' },
                { '@type': 'ListItem', position: 3, name: post.title, item: canonicalUrl },
              ],
            },
          ],
        }}
      />

      <section className="bg-ink bg-grain text-ivory">
        <div className="hairline-solid w-full opacity-30" />
        <div className="mx-auto max-w-3xl px-6 pt-10 pb-2">
          <Link to="/blog" className="inline-flex items-center gap-1.5 label-caps text-gold-lt/80 hover:text-gold-lt transition-colors">
            <ArrowLeft size={13} /> All Posts
          </Link>
        </div>
        <div className="mx-auto max-w-3xl px-6 py-14">
          <p className="eyebrow text-gold-lt mb-4">{post.category}</p>
          <h1 className="font-display text-3xl md:text-5xl mb-4">{post.title}</h1>
          <p className="text-ivory/70 text-sm">{post.date} · {post.readTime} read</p>
        </div>
      </section>

      <section className="mx-auto max-w-prose px-6 py-16">
        <div className="prose-literary">
          {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>

        <div className="mt-12 flex items-center justify-between flex-wrap gap-4">
          <SocialShareButtons path={`/blog/${post.slug}`} title={post.title} />
          <Link to="/blog" className="inline-flex items-center gap-1.5 label-caps text-gold hover:text-ink transition-colors">
            Back to All Posts <ArrowRight size={13} />
          </Link>
        </div>
      </section>
    </>
  );
}
