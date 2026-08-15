import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';

// Every other public route is code-split per-page. Home stays eagerly
// bundled since it's the single most common landing page — everything else
// only downloads when a visitor actually navigates there, which is what
// keeps the initial JS payload small for e.g. someone landing straight on a
// legal page from a search result.
const Books = lazy(() => import('./pages/Books'));
const BookDetail = lazy(() => import('./pages/BookDetail'));
const About = lazy(() => import('./pages/About'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPostDetail = lazy(() => import('./pages/BlogPostDetail'));
const News = lazy(() => import('./pages/News'));
const Contact = lazy(() => import('./pages/Contact'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const StartHere = lazy(() => import('./pages/StartHere'));
const WriteTogetherHubPage = lazy(() => import('./pages/WriteTogetherHubPage'));
const Media = lazy(() => import('./pages/Media'));
const Readers = lazy(() => import('./pages/Readers'));
const Events = lazy(() => import('./pages/Events'));
const BookClubs = lazy(() => import('./pages/BookClubs'));
const WritingResources = lazy(() => import('./pages/WritingResources'));
const InterviewResources = lazy(() => import('./pages/InterviewResources'));
const WhereToBuy = lazy(() => import('./pages/WhereToBuy'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/Terms'));
const Accessibility = lazy(() => import('./pages/Accessibility'));

// Admin is code-split out of the public bundle — regular visitors never
// download the CRUD forms or the auth-gated layout.
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminBooks = lazy(() => import('./pages/admin/AdminBooks'));
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials'));
const AdminTestimonialSubmissions = lazy(() => import('./pages/admin/AdminTestimonialSubmissions'));
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog'));
const AdminBlogContent = lazy(() => import('./pages/admin/AdminBlogContent'));
const AdminNews = lazy(() => import('./pages/admin/AdminNews'));
const AdminEvents = lazy(() => import('./pages/admin/AdminEvents'));
const AdminReaderPhotos = lazy(() => import('./pages/admin/AdminReaderPhotos'));
const AdminBookCategories = lazy(() => import('./pages/admin/AdminBookCategories'));
const AdminSubscribers = lazy(() => import('./pages/admin/AdminSubscribers'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));

function AdminFallback() {
  return <div className="min-h-screen flex items-center justify-center bg-ink text-ivory">Loading…</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:slug" element={<BookDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPostDetail />} />
          <Route path="/news" element={<News />} />
          <Route path="/write-together-hub" element={<WriteTogetherHubPage />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/start-here" element={<StartHere />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/media" element={<Media />} />
          <Route path="/readers" element={<Readers />} />
          <Route path="/events" element={<Events />} />
          <Route path="/book-clubs" element={<BookClubs />} />
          <Route path="/writing-resources" element={<WritingResources />} />
          <Route path="/interview-resources" element={<InterviewResources />} />
          <Route path="/where-to-buy" element={<WhereToBuy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/accessibility" element={<Accessibility />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin" element={<Suspense fallback={<AdminFallback />}><AdminLayout /></Suspense>}>
          <Route index element={<Navigate to="/admin/books" replace />} />
          <Route path="books" element={<Suspense fallback={<AdminFallback />}><AdminBooks /></Suspense>} />
          <Route path="book-categories" element={<Suspense fallback={<AdminFallback />}><AdminBookCategories /></Suspense>} />
          <Route path="testimonials" element={<Suspense fallback={<AdminFallback />}><AdminTestimonials /></Suspense>} />
          <Route path="testimonial-submissions" element={<Suspense fallback={<AdminFallback />}><AdminTestimonialSubmissions /></Suspense>} />
          <Route path="blog" element={<Suspense fallback={<AdminFallback />}><AdminBlog /></Suspense>} />
          <Route path="blog/:id/content" element={<Suspense fallback={<AdminFallback />}><AdminBlogContent /></Suspense>} />
          <Route path="news" element={<Suspense fallback={<AdminFallback />}><AdminNews /></Suspense>} />
          <Route path="events" element={<Suspense fallback={<AdminFallback />}><AdminEvents /></Suspense>} />
          <Route path="reader-photos" element={<Suspense fallback={<AdminFallback />}><AdminReaderPhotos /></Suspense>} />
          <Route path="subscribers" element={<Suspense fallback={<AdminFallback />}><AdminSubscribers /></Suspense>} />
          <Route path="messages" element={<Suspense fallback={<AdminFallback />}><AdminMessages /></Suspense>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
