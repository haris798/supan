import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pcoyvfhcniscynjkndlw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_4HYaHZhOIECG56Eccpe4sA_xj-Ecy9n';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
