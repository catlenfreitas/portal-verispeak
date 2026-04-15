const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://eesrrknobftmdgfpfcda.supabase.co',
  'sb_publishable_qECl9GlYMZ_FomscllSdyQ_jyagSyA0'
);

module.exports = supabase;