import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Seo from '../components/Seo';
import SocialShareButtons from '../components/SocialShareButtons';
import Breadcrumbs from '../components/Breadcrumbs';
import JournalBookCTA from '../components/JournalBookCTA';
import EmailStrip from '../components/EmailStrip';
import { fetchBlogPosts, fetchBooks } from '../lib/queries';
import { useSupabaseData } from '../lib/useSupabaseData';
import { canonicalUrl as buildUrl } from '../lib/url';
import { parsePostContent, renderInlineLinks } from '../lib/postContent';

export default function BlogPostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: posts, loading, error } = useSupabaseData(fetchBlogPosts, []);
  const { data: books } = useSupabaseData(fetchBooks, []);

  if (loading) return <div className="py-32 text-center text-muted">Loading…</div>;
  if (error) return <div className="py-32 text-center text-rose">Couldn't load this post: {error}</div>;

  const post = posts?.find((p) => p.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  const canonicalUrl = buildUrl(`/blog/${post.slug}`);
  const blocks = parsePostContent(post.content ?? post.excerpt);
  // Same category, most recent first, excluding this post — a real signal
  // already in the data (category), not a separate curated field, so this
  // can never point at a stale or invented "related" post.
  const relatedArticles = (posts ?? [])
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  return (
    <>
      <Seo
        title={`${post.title} | Gaurav Mishra`}
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
              ...(post.updatedDate ? { dateModified: post.updatedDate } : {}),
              articleSection: post.category,
              url: canonicalUrl,
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: buildUrl('/') },
                { '@type': 'ListItem', position: 2, name: 'Blog', item: buildUrl('/blog') },
                { '@type': 'ListItem', position: 3, name: post.title, item: canonicalUrl },
              ],
            },
          ],
        }}
      />

      <section className="bg-ink bg-grain text-ivory">
        <div className="hairline-solid w-full opacity-30" />
        <div className="mx-auto max-w-3xl px-6 pt-10 pb-2">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: post.title },
            ]}
            className="text-gold-lt/80"
          />
        </div>
        <div className="mx-auto max-w-3xl px-6 py-14">
          <p className="eyebrow text-gold-lt mb-4">{post.category}</p>
          <h1 className="font-display text-3xl md:text-5xl mb-4">{post.title}</h1>
          <p className="text-ivory/70 text-sm">
            By Gaurav Mishra · {post.date} · {post.readTime} read
            {post.updatedDate && ` · Updated ${post.updatedDate}`}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-prose px-6 py-16">
        <div className="prose-literary">
          {blocks.map((b, i) =>
            b.type === 'heading'
              ? <h2 key={i}>{b.text}</h2>
              : <p key={i}>{renderInlineLinks(b.text)}</p>,
          )}
        </div>

        {post.relatedLink && books && <JournalBookCTA relatedLink={post.relatedLink} books={books} />}

        <div className="mt-12 flex items-center justify-between flex-wrap gap-4">
          <SocialShareButtons path={`/blog/${post.slug}`} title={post.title} />
          <Link to="/blog" className="inline-flex items-center gap-1.5 label-caps text-gold-text hover:text-ink transition-colors">
            Back to All Posts <ArrowRight size={16} />
          </Link>
        </div>

        {relatedArticles.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gold/20">
            <p className="label-caps text-gold-text text-2xs mb-5">More in {post.category}</p>
            <ul className="space-y-3">
              {relatedArticles.map((p) => (
                <li key={p.slug}>
                  <Link to={`/blog/${p.slug}`} className="text-ink hover:text-gold-text transition-colors underline underline-offset-2">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <EmailStrip id="article-email" source="article" />
    </>
  );
}
