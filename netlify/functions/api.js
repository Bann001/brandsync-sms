const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const path = event.path.replace('/.netlify/functions/api', '');
    const method = event.httpMethod;
    const body = event.body ? JSON.parse(event.body) : null;
    const params = event.queryStringParameters || {};

    // Auth endpoints
    if (path === '/auth/login' && method === 'POST') {
      const { email, password } = body;
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    if (path === '/auth/signup' && method === 'POST') {
      const { email, password, metadata } = body;
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: metadata } });
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    if (path === '/auth/logout' && method === 'POST') {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    if (path === '/auth/user' && method === 'GET') {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify({ user }) };
    }

    // Get auth token from header
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
      }
    }

    // Contacts
    if (path === '/contacts' && method === 'GET') {
      const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    if (path === '/contacts' && method === 'POST') {
      const { data, error } = await supabase.from('contacts').insert(body).select().single();
      if (error) throw error;
      return { statusCode: 201, headers, body: JSON.stringify(data) };
    }

    if (path.startsWith('/contacts/') && method === 'PUT') {
      const id = path.split('/')[2];
      const { data, error } = await supabase.from('contacts').update(body).eq('id', id).select().single();
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    if (path.startsWith('/contacts/') && method === 'DELETE') {
      const id = path.split('/')[2];
      const { error } = await supabase.from('contacts').delete().eq('id', id);
      if (error) throw error;
      return { statusCode: 204, headers, body: '' };
    }

    // Campaigns
    if (path === '/campaigns' && method === 'GET') {
      const { data, error } = await supabase.from('campaigns').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    if (path === '/campaigns' && method === 'POST') {
      const { data, error } = await supabase.from('campaigns').insert(body).select().single();
      if (error) throw error;
      return { statusCode: 201, headers, body: JSON.stringify(data) };
    }

    // Scheduled messages
    if (path === '/scheduled' && method === 'GET') {
      const { data, error } = await supabase.from('scheduled_messages').select('*').order('scheduled_at', { ascending: true });
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    if (path === '/scheduled' && method === 'POST') {
      const { data, error } = await supabase.from('scheduled_messages').insert(body).select().single();
      if (error) throw error;
      return { statusCode: 201, headers, body: JSON.stringify(data) };
    }

    // Templates
    if (path === '/templates' && method === 'GET') {
      const { data, error } = await supabase.from('templates').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    if (path === '/templates' && method === 'POST') {
      const { data, error } = await supabase.from('templates').insert(body).select().single();
      if (error) throw error;
      return { statusCode: 201, headers, body: JSON.stringify(data) };
    }

    // Inbox messages
    if (path === '/inbox' && method === 'GET') {
      const { data, error } = await supabase.from('inbox_messages').select('*').order('received_at', { ascending: false });
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    // Users (admin)
    if (path === '/users' && method === 'GET') {
      const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    // Blacklist
    if (path === '/blacklist' && method === 'GET') {
      const { data, error } = await supabase.from('blacklist').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    if (path === '/blacklist' && method === 'POST') {
      const { data, error } = await supabase.from('blacklist').insert(body).select().single();
      if (error) throw error;
      return { statusCode: 201, headers, body: JSON.stringify(data) };
    }

    // Automation
    if (path === '/automation' && method === 'GET') {
      const { data, error } = await supabase.from('automation_rules').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    // Audit logs
    if (path === '/audit' && method === 'GET') {
      const { data, error } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(100);
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    // RBAC
    if (path === '/rbac/roles' && method === 'GET') {
      const { data, error } = await supabase.from('roles').select('*');
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    if (path === '/rbac/permissions' && method === 'GET') {
      const { data, error } = await supabase.from('permissions').select('*');
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };
  } catch (error) {
    console.error('API Error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};