import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  // Never throw here — a missing env var must not blank the entire app.
  // Individual queries below fail gracefully instead (see useSupabaseData).
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY — see .env.example. Content, forms, and /admin will not work until these are set.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.invalid',
  supabaseAnonKey || 'placeholder-anon-key',
);

export const CONTACT_FORM_ENDPOINT = `${supabaseUrl ?? ''}/functions/v1/contact-form`;
export const SUPABASE_ANON_KEY = supabaseAnonKey ?? '';
