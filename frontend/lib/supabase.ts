import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hybpdeunlpxmfwcthrfy.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5YnBkZXVubHB4bWZ3Y3RocmZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NDI0NDgsImV4cCI6MjA4ODIxODQ0OH0.gc_oqHgugoPKu_54RmSPc9rEHbVrTL9yjcOb9chsfZ0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
