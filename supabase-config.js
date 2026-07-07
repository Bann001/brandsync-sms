// Supabase Configuration
// This initializes the Supabase client using environment variables from Netlify

(function() {
  // These will be replaced by Netlify environment variables at build time
  const SUPABASE_URL = 'https://your-project.supabase.co';
  const SUPABASE_ANON_KEY = 'your-anon-key';

  // Initialize Supabase client
  window.supabase = window.supabase || {};
  window.supabase.createClient = window.supabase.createClient || (() => {});

  if (typeof window.supabase.createClient === 'function') {
    window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } else if (typeof supabase !== 'undefined' && supabase.createClient) {
    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  // Helper functions for common operations
  window.SupabaseDB = {
    // Generic CRUD operations
    async select(table, options = {}) {
      let query = window.supabaseClient.from(table).select(options.columns || '*');
      if (options.filter) query = query.eq(options.filter.column, options.filter.value);
      if (options.order) query = query.order(options.order.column, { ascending: options.order.ascending !== false });
      if (options.limit) query = query.limit(options.limit);
      if (options.range) query = query.range(options.range.from, options.range.to);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },

    async insert(table, data) {
      const { data: result, error } = await window.supabaseClient.from(table).insert(data).select();
      if (error) throw error;
      return result;
    },

    async update(table, id, data) {
      const { data: result, error } = await window.supabaseClient.from(table).update(data).eq('id', id).select();
      if (error) throw error;
      return result;
    },

    async delete(table, id) {
      const { error } = await window.supabaseClient.from(table).delete().eq('id', id);
      if (error) throw error;
      return true;
    },

    // Auth helpers
    async signUp(email, password, metadata = {}) {
      const { data, error } = await window.supabaseClient.auth.signUp({ email, password, options: { data: metadata } });
      if (error) throw error;
      return data;
    },

    async signIn(email, password) {
      const { data, error } = await window.supabaseClient.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    },

    async signOut() {
      const { error } = await window.supabaseClient.auth.signOut();
      if (error) throw error;
      return true;
    },

    async getSession() {
      const { data, error } = await window.supabaseClient.auth.getSession();
      if (error) throw error;
      return data.session;
    },

    async getUser() {
      const { data, error } = await window.supabaseClient.auth.getUser();
      if (error) throw error;
      return data.user;
    },

    onAuthStateChange(callback) {
      return window.supabaseClient.auth.onAuthStateChange(callback);
    },

    // Realtime subscriptions
    subscribe(table, callback, filter = {}) {
      return window.supabaseClient
        .channel(`db-changes-${table}`)
        .on('postgres_changes', { event: '*', schema: 'public', table, ...filter }, callback)
        .subscribe();
    }
  };

  console.log('Supabase client initialized');
})();