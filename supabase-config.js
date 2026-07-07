(function() {
  const config = window.BrandSyncConfig || {};
  const SUPABASE_URL = config.SUPABASE_URL || 'https://llrdtvnufcstvlcphkvj.supabase.co';
  const SUPABASE_ANON_KEY = config.SUPABASE_ANON_KEY || '';

  window.supabaseClient = null;

  if (typeof supabase !== 'undefined' && supabase.createClient) {
    try {
      window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: true, autoRefreshToken: true }
      });
      console.log('Supabase client initialized:', SUPABASE_URL);
    } catch (e) {
      console.error('Failed to initialize Supabase client:', e.message);
    }
  } else {
    console.warn('Supabase JS library not loaded. Check CDN.');
  }

  window.SupabaseDB = {
    from(table) { return window.supabaseClient ? window.supabaseClient.from(table) : null; },

    async select(table, options = {}) {
      if (!window.supabaseClient) return [];
      let query = window.supabaseClient.from(table).select(options.columns || '*');
      if (options.filter) query = query.eq(options.filter.column, options.filter.value);
      if (options.order) query = query.order(options.order.column, { ascending: options.order.ascending !== false });
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) { console.error('Supabase select error:', error); return []; }
      return data || [];
    },

    async insert(table, data) {
      if (!window.supabaseClient) return null;
      const { data: result, error } = await window.supabaseClient.from(table).insert(data).select();
      if (error) { console.error('Supabase insert error:', error); return null; }
      return result;
    },

    async upsert(table, data, opts = {}) {
      if (!window.supabaseClient) return null;
      const { data: result, error } = await window.supabaseClient.from(table).upsert(data, opts).select();
      if (error) { console.error('Supabase upsert error:', error); return null; }
      return result;
    },

    async update(table, id, data) {
      if (!window.supabaseClient) return null;
      const { data: result, error } = await window.supabaseClient.from(table).update(data).eq('id', id).select();
      if (error) { console.error('Supabase update error:', error); return null; }
      return result;
    },

    async delete(table, id) {
      if (!window.supabaseClient) return false;
      const { error } = await window.supabaseClient.from(table).delete().eq('id', id);
      if (error) { console.error('Supabase delete error:', error); return false; }
      return true;
    },

    subscribe(table, callback) {
      if (!window.supabaseClient) return null;
      return window.supabaseClient
        .channel(`db-changes-${table}`)
        .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
        .subscribe();
    }
  };
})();