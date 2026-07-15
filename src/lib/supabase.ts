import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY — see .env.example.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const CONTACT_FORM_ENDPOINT = `${supabaseUrl}/functions/v1/contact-form`;
export const SUPABASE_ANON_KEY = supabaseAnonKey;
