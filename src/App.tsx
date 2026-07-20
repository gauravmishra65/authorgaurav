import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Books from './pages/Books';
import BookDetail from './pages/BookDetail';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogPostDetail from './pages/BlogPostDetail';
import News from './pages/News';
import Contact from './pages/Contact';
import Testimonials from './pages/Testimonials';
import StartHere from './pages/StartHere';
import WriteTogetherHubPage from './pages/WriteTogetherHubPage';

// Admin is code-split out of the public bundle — regular visitors never
// download the CRUD forms or the auth-gated layout.
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminBooks = lazy(() => import('./pages/admin/AdminBooks'));
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials'));
const AdminTestimonialSubmissions = lazy(() => import('./pages/admin/AdminTestimonialSubmissions'));
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog'));
const AdminBlogContent = lazy(() => import('./pages/admin/AdminBlogContent'));
const AdminNews = lazy(() => import('./pages/admin/AdminNews'));
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
          <Route path="*" element={<Home />} />
        </Route>

        <Route path="/admin" element={<Suspense fallback={<AdminFallback />}><AdminLayout /></Suspense>}>
          <Route index element={<Navigate to="/admin/books" replace />} />
          <Route path="books" element={<Suspense fallback={<AdminFallback />}><AdminBooks /></Suspense>} />
          <Route path="testimonials" element={<Suspense fallback={<AdminFallback />}><AdminTestimonials /></Suspense>} />
          <Route path="testimonial-submissions" element={<Suspense fallback={<AdminFallback />}><AdminTestimonialSubmissions /></Suspense>} />
          <Route path="blog" element={<Suspense fallback={<AdminFallback />}><AdminBlog /></Suspense>} />
          <Route path="blog/:id/content" element={<Suspense fallback={<AdminFallback />}><AdminBlogContent /></Suspense>} />
          <Route path="news" element={<Suspense fallback={<AdminFallback />}><AdminNews /></Suspense>} />
          <Route path="subscribers" element={<Suspense fallback={<AdminFallback />}><AdminSubscribers /></Suspense>} />
          <Route path="messages" element={<Suspense fallback={<AdminFallback />}><AdminMessages /></Suspense>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
