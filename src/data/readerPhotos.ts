export interface ReaderPhoto {
  id: string;
  imageSrc: string;
  readerName?: string;
  caption?: string;
  bookTitle?: string;
  kind: 'reader' | 'bookstore';
}

// Reader-submitted photos with the book live in Supabase
// (authorgaurav_reader_photos) — see src/lib/queries.ts. Manage via /admin.
