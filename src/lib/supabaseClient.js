
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://<project>.supabase.co', import.meta.env.VITE_ANON_KEY_DB);
