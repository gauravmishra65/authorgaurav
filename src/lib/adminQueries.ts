import { supabase } from './supabase';

export interface AdminBookRow {
  id: string;
  slug: string;
  title: string;
  title_html: string | null;
  author: string;
  tagline: string;
  synopsis: string;
  genre: 'Fiction' | 'Memoir' | 'Devotional';
  language: 'English' | 'Hindi';
  status: 'published' | 'upcoming';
  gradient: string;
  text_on_dark: boolean;
  image_src: string | null;
  image_width: number | null;
  image_height: number | null;
  book_website: string | null;
  buy_links: { label: string; href: string }[];
  sort_order: number;
  release_date: string | null;
  kindle_url: string | null;
  paperback_url: string | null;
  featured: boolean;
}

export async function fetchAdminBooks(): Promise<AdminBookRow[]> {
  const { data, error } = await supabase.from('authorgaurav_books').select('*').order('sort_order');
  if (error) throw error;
  return data as AdminBookRow[];
}

export async function saveBook(book: Partial<AdminBookRow>): Promise<void> {
  const { error } = book.id
    ? await supabase.from('authorgaurav_books').update(book).eq('id', book.id)
    : await supabase.from('authorgaurav_books').insert(book);
  if (error) throw error;
}

export async function deleteBook(id: string): Promise<void> {
  const { error } = await supabase.from('authorgaurav_books').delete().eq('id', id);
  if (error) throw error;
}

export interface AdminTestimonialRow {
  id: string;
  book_id: string | null;
  quote: string;
  name: string;
  source: string | null;
  featured: boolean;
  sort_order: number;
  author_reply: string | null;
}

export async function fetchAdminTestimonials(): Promise<AdminTestimonialRow[]> {
  const { data, error } = await supabase.from('authorgaurav_testimonials').select('*').order('sort_order');
  if (error) throw error;
  return data as AdminTestimonialRow[];
}

export async function saveTestimonial(row: Partial<AdminTestimonialRow>): Promise<void> {
  const { error } = row.id
    ? await supabase.from('authorgaurav_testimonials').update(row).eq('id', row.id)
    : await supabase.from('authorgaurav_testimonials').insert(row);
  if (error) throw error;
}

export async function deleteTestimonial(id: string): Promise<void> {
  const { error } = await supabase.from('authorgaurav_testimonials').delete().eq('id', id);
  if (error) throw error;
}

export interface AdminTestimonialSubmissionRow {
  id: string;
  book_id: string | null;
  name: string;
  email: string;
  quote: string;
  status: 'pending' | 'approved' | 'rejected';
  author_reply: string | null;
  created_at: string;
}

export async function fetchTestimonialSubmissions(): Promise<AdminTestimonialSubmissionRow[]> {
  const { data, error } = await supabase
    .from('authorgaurav_testimonial_submissions')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as AdminTestimonialSubmissionRow[];
}

/** Promotes a pending submission into the public "What Readers Say" table, carrying the author's reply along. */
export async function approveTestimonialSubmission(submission: AdminTestimonialSubmissionRow, replyText: string): Promise<void> {
  const reply = replyText.trim() || null;

  const { error: insertError } = await supabase.from('authorgaurav_testimonials').insert({
    book_id: submission.book_id,
    quote: submission.quote,
    name: submission.name,
    source: 'Verified Reader',
    featured: false,
    sort_order: 0,
    author_reply: reply,
  });
  if (insertError) throw insertError;

  const { error: updateError } = await supabase
    .from('authorgaurav_testimonial_submissions')
    .update({ status: 'approved', author_reply: reply })
    .eq('id', submission.id);
  if (updateError) throw updateError;
}

export async function rejectTestimonialSubmission(id: string, replyText: string): Promise<void> {
  const { error } = await supabase
    .from('authorgaurav_testimonial_submissions')
    .update({ status: 'rejected', author_reply: replyText.trim() || null })
    .eq('id', id);
  if (error) throw error;
}

export interface AdminBlogPostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: 'Writing Craft' | 'Behind the Books' | 'Spiritual Reflections' | 'Book Updates';
  gradient: string;
  read_time: string;
  published_at: string;
}

export async function fetchAdminBlogPosts(): Promise<AdminBlogPostRow[]> {
  const { data, error } = await supabase.from('authorgaurav_blog_posts').select('*').order('published_at', { ascending: false });
  if (error) throw error;
  return data as AdminBlogPostRow[];
}

export async function saveBlogPost(row: Partial<AdminBlogPostRow>): Promise<void> {
  const { error } = row.id
    ? await supabase.from('authorgaurav_blog_posts').update(row).eq('id', row.id)
    : await supabase.from('authorgaurav_blog_posts').insert(row);
  if (error) throw error;
}

export async function deleteBlogPost(id: string): Promise<void> {
  const { error } = await supabase.from('authorgaurav_blog_posts').delete().eq('id', id);
  if (error) throw error;
}

export interface AdminNewsItemRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: 'Release' | 'Event' | 'Press' | 'Announcement';
  gradient: string;
  published_at: string;
}

export async function fetchAdminNewsItems(): Promise<AdminNewsItemRow[]> {
  const { data, error } = await supabase.from('authorgaurav_news_items').select('*').order('published_at', { ascending: false });
  if (error) throw error;
  return data as AdminNewsItemRow[];
}

export async function saveNewsItem(row: Partial<AdminNewsItemRow>): Promise<void> {
  const { error } = row.id
    ? await supabase.from('authorgaurav_news_items').update(row).eq('id', row.id)
    : await supabase.from('authorgaurav_news_items').insert(row);
  if (error) throw error;
}

export async function deleteNewsItem(id: string): Promise<void> {
  const { error } = await supabase.from('authorgaurav_news_items').delete().eq('id', id);
  if (error) throw error;
}

export interface AdminSubscriberRow {
  id: string;
  email: string;
  name: string | null;
  source: string | null;
  genre_preference: string | null;
  created_at: string;
}

export async function fetchSubscribers(): Promise<AdminSubscriberRow[]> {
  const { data, error } = await supabase.from('authorgaurav_newsletter_subscribers').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as AdminSubscriberRow[];
}

export interface AdminContactMessageRow {
  id: string;
  name: string;
  email: string;
  message: string;
  join_circle: boolean;
  status: string;
  created_at: string;
}

export async function fetchContactMessages(): Promise<AdminContactMessageRow[]> {
  const { data, error } = await supabase.from('authorgaurav_contact_messages').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as AdminContactMessageRow[];
}

export async function setContactMessageStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase.from('authorgaurav_contact_messages').update({ status }).eq('id', id);
  if (error) throw error;
}
