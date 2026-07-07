-- BrandSync SMS Database Schema for Supabase
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS & AUTHENTICATION
-- =============================================

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  credits INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =============================================
-- RBAC (ROLE-BASED ACCESS CONTROL)
-- =============================================

CREATE TABLE IF NOT EXISTS roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS permissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES profiles(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id)
);

-- Insert default roles
INSERT INTO roles (name, description, is_system) VALUES
  ('super_admin', 'Full system access', TRUE),
  ('admin', 'Administrative access', TRUE),
  ('manager', 'Manage campaigns and contacts', TRUE),
  ('operator', 'Send messages and view reports', TRUE),
  ('viewer', 'Read-only access', TRUE)
ON CONFLICT (name) DO NOTHING;

-- Insert default permissions
INSERT INTO permissions (name, description, resource, action) VALUES
  -- Contacts
  ('contacts.read', 'View contacts', 'contacts', 'read'),
  ('contacts.write', 'Create/edit contacts', 'contacts', 'write'),
  ('contacts.delete', 'Delete contacts', 'contacts', 'delete'),
  ('contacts.import', 'Import contacts', 'contacts', 'import'),
  ('contacts.export', 'Export contacts', 'contacts', 'export'),
  -- Campaigns
  ('campaigns.read', 'View campaigns', 'campaigns', 'read'),
  ('campaigns.write', 'Create/edit campaigns', 'campaigns', 'write'),
  ('campaigns.delete', 'Delete campaigns', 'campaigns', 'delete'),
  ('campaigns.send', 'Send campaigns', 'campaigns', 'send'),
  -- Scheduled
  ('scheduled.read', 'View scheduled messages', 'scheduled', 'read'),
  ('scheduled.write', 'Create/edit scheduled', 'scheduled', 'write'),
  ('scheduled.delete', 'Delete scheduled', 'scheduled', 'delete'),
  -- Templates
  ('templates.read', 'View templates', 'templates', 'read'),
  ('templates.write', 'Create/edit templates', 'templates', 'write'),
  ('templates.delete', 'Delete templates', 'templates', 'delete'),
  -- Inbox
  ('inbox.read', 'View inbox', 'inbox', 'read'),
  ('inbox.write', 'Reply to messages', 'inbox', 'write'),
  -- Users
  ('users.read', 'View users', 'users', 'read'),
  ('users.write', 'Manage users', 'users', 'write'),
  ('users.delete', 'Delete users', 'users', 'delete'),
  -- Blacklist
  ('blacklist.read', 'View blacklist', 'blacklist', 'read'),
  ('blacklist.write', 'Manage blacklist', 'blacklist', 'write'),
  -- Automation
  ('automation.read', 'View automation', 'automation', 'read'),
  ('automation.write', 'Manage automation', 'automation', 'write'),
  -- API
  ('api.read', 'View API settings', 'api', 'read'),
  ('api.write', 'Manage API settings', 'api', 'write'),
  -- Audit
  ('audit.read', 'View audit logs', 'audit', 'read'),
  -- Credits
  ('credits.read', 'View credits', 'credits', 'read'),
  ('credits.write', 'Manage credits', 'credits', 'write')
ON CONFLICT (name) DO NOTHING;

-- Assign all permissions to super_admin
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'super_admin'
ON CONFLICT DO NOTHING;

-- Assign admin permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'admin' AND p.name NOT IN ('users.delete', 'api.write')
ON CONFLICT DO NOTHING;

-- =============================================
-- CONTACTS
-- =============================================

CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone_number TEXT NOT NULL,
  email TEXT,
  company TEXT,
  position TEXT,
  tags TEXT[],
  custom_fields JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'opted_out', 'bounced')),
  source TEXT,
  notes TEXT,
  last_contacted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_phone ON contacts(phone_number);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_tags ON contacts USING GIN(tags);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own contacts" ON contacts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all contacts" ON contacts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Contact groups/lists
CREATE TABLE IF NOT EXISTS contact_groups (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_group_members (
  group_id UUID REFERENCES contact_groups(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (group_id, contact_id)
);

ALTER TABLE contact_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own groups" ON contact_groups
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own group members" ON contact_group_members
  FOR ALL USING (
    EXISTS (SELECT 1 FROM contact_groups WHERE id = group_id AND user_id = auth.uid())
  );

-- =============================================
-- TEMPLATES
-- =============================================

CREATE TABLE IF NOT EXISTS templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  variables JSONB DEFAULT '[]',
  is_system BOOLEAN DEFAULT FALSE,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_templates_user_id ON templates(user_id);
CREATE INDEX idx_templates_category ON templates(category);

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own templates" ON templates
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view system templates" ON templates
  FOR SELECT USING (is_system = TRUE);

CREATE POLICY "Admins can manage all templates" ON templates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- =============================================
-- CAMPAIGNS
-- =============================================

CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  template_id UUID REFERENCES templates(id) ON DELETE SET NULL,
  message_content TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'failed', 'cancelled')),
  target_type TEXT CHECK (target_type IN ('all', 'group', 'list', 'segment')),
  target_group_id UUID REFERENCES contact_groups(id) ON DELETE SET NULL,
  target_contact_ids UUID[],
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  opted_out_count INTEGER DEFAULT 0,
  cost_credits INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_scheduled ON campaigns(scheduled_at);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own campaigns" ON campaigns
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all campaigns" ON campaigns
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Campaign recipients tracking
CREATE TABLE IF NOT EXISTS campaign_recipients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE NOT NULL,
  phone_number TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'opted_out')),
  provider_message_id TEXT,
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_campaign_recipients_campaign ON campaign_recipients(campaign_id);
CREATE INDEX idx_campaign_recipients_contact ON campaign_recipients(contact_id);
CREATE INDEX idx_campaign_recipients_status ON campaign_recipients(status);

ALTER TABLE campaign_recipients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own campaign recipients" ON campaign_recipients
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM campaigns WHERE id = campaign_id AND user_id = auth.uid())
  );

-- =============================================
-- SCHEDULED MESSAGES
-- =============================================

CREATE TABLE IF NOT EXISTS scheduled_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  message TEXT NOT NULL,
  template_id UUID REFERENCES templates(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  provider_message_id TEXT,
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scheduled_user_id ON scheduled_messages(user_id);
CREATE INDEX idx_scheduled_status ON scheduled_messages(status);
CREATE INDEX idx_scheduled_at ON scheduled_messages(scheduled_at);

ALTER TABLE scheduled_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own scheduled messages" ON scheduled_messages
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all scheduled" ON scheduled_messages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- =============================================
-- INBOX MESSAGES
-- =============================================

CREATE TABLE IF NOT EXISTS inbox_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  phone_number TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  message TEXT NOT NULL,
  provider_message_id TEXT,
  status TEXT DEFAULT 'received' CHECK (status IN ('received', 'sent', 'delivered', 'failed', 'read')),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  scheduled_id UUID REFERENCES scheduled_messages(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  received_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inbox_user_id ON inbox_messages(user_id);
CREATE INDEX idx_inbox_contact ON inbox_messages(contact_id);
CREATE INDEX idx_inbox_phone ON inbox_messages(phone_number);
CREATE INDEX idx_inbox_direction ON inbox_messages(direction);
CREATE INDEX idx_inbox_received ON inbox_messages(received_at);

ALTER TABLE inbox_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own inbox" ON inbox_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inbound messages" ON inbox_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all inbox" ON inbox_messages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- =============================================
-- BLACKLIST
-- =============================================

CREATE TABLE IF NOT EXISTS blacklist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  phone_number TEXT NOT NULL,
  reason TEXT,
  source TEXT CHECK (source IN ('manual', 'opt_out', 'bounce', 'complaint', 'api')),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, phone_number)
);

CREATE INDEX idx_blacklist_user_id ON blacklist(user_id);
CREATE INDEX idx_blacklist_phone ON blacklist(phone_number);
CREATE INDEX idx_blacklist_active ON blacklist(is_active);

ALTER TABLE blacklist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own blacklist" ON blacklist
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all blacklist" ON blacklist
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- =============================================
-- AUTOMATION
-- =============================================

CREATE TABLE IF NOT EXISTS automation_rules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('inbound_message', 'keyword', 'schedule', 'webhook', 'contact_added', 'campaign_completed')),
  trigger_config JSONB NOT NULL DEFAULT '{}',
  conditions JSONB DEFAULT '[]',
  actions JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  last_triggered_at TIMESTAMPTZ,
  trigger_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_automation_user_id ON automation_rules(user_id);
CREATE INDEX idx_automation_trigger ON automation_rules(trigger_type);
CREATE INDEX idx_automation_active ON automation_rules(is_active);

ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own automation" ON automation_rules
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all automation" ON automation_rules
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Automation execution logs
CREATE TABLE IF NOT EXISTS automation_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  rule_id UUID REFERENCES automation_rules(id) ON DELETE CASCADE NOT NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  trigger_data JSONB,
  actions_executed JSONB,
  status TEXT CHECK (status IN ('success', 'partial', 'failed')),
  error_message TEXT,
  execution_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_automation_logs_rule ON automation_logs(rule_id);
CREATE INDEX idx_automation_logs_created ON automation_logs(created_at);

ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own automation logs" ON automation_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM automation_rules WHERE id = rule_id AND user_id = auth.uid())
  );

-- =============================================
-- AUDIT LOGS
-- =============================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "System can insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (TRUE);

-- =============================================
-- CREDITS / BILLING
-- =============================================

CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'usage', 'refund', 'bonus', 'expired', 'adjustment')),
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  description TEXT,
  reference_id UUID,
  reference_type TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_credit_transactions_user ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_type ON credit_transactions(type);
CREATE INDEX idx_credit_transactions_created ON credit_transactions(created_at);

ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions" ON credit_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions" ON credit_transactions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- =============================================
-- PROVIDER SETTINGS (PhilSMS, etc.)
-- =============================================

CREATE TABLE IF NOT EXISTS provider_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  provider TEXT NOT NULL,
  name TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE provider_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own providers" ON provider_settings
  FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- WEBHOOKS
-- =============================================

CREATE TABLE IF NOT EXISTS webhooks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL,
  secret TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_triggered_at TIMESTAMPTZ,
  success_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own webhooks" ON webhooks
  FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- TRIGGERS & FUNCTIONS
-- =============================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, credits)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'user', 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables with updated_at column
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename IN ('profiles', 'roles', 'contacts', 'contact_groups', 'templates', 
                      'campaigns', 'scheduled_messages', 'inbox_messages', 'blacklist',
                      'automation_rules', 'provider_settings', 'webhooks')
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS update_%s_updated_at ON %s', t, t);
    EXECUTE format('CREATE TRIGGER update_%s_updated_at BEFORE UPDATE ON %s FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', t, t);
  END LOOP;
END $$;

-- Log audit trail for important tables
CREATE OR REPLACE FUNCTION public.audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (user_id, action, resource_type, resource_id, new_data)
    VALUES (COALESCE(current_setting('request.jwt.claims', TRUE)::json->>'sub', 'system')::UUID, 
            'create', TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (user_id, action, resource_type, resource_id, old_data, new_data)
    VALUES (COALESCE(current_setting('request.jwt.claims', TRUE)::json->>'sub', 'system')::UUID,
            'update', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (user_id, action, resource_type, resource_id, old_data)
    VALUES (COALESCE(current_setting('request.jwt.claims', TRUE)::json->>'sub', 'system')::UUID,
            'delete', TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to key tables
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename IN ('contacts', 'campaigns', 'templates', 'scheduled_messages', 
                      'blacklist', 'automation_rules', 'profiles')
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS audit_%s ON %s', t, t);
    EXECUTE format('CREATE TRIGGER audit_%s AFTER INSERT OR UPDATE OR DELETE ON %s FOR EACH ROW EXECUTE FUNCTION audit_trigger()', t, t);
  END LOOP;
END $$;

-- =============================================
-- HELPER VIEWS
-- =============================================

-- User stats view
CREATE OR REPLACE VIEW user_stats AS
SELECT 
  p.id as user_id,
  p.email,
  p.full_name,
  p.role,
  p.credits,
  (SELECT COUNT(*) FROM contacts WHERE user_id = p.id) as total_contacts,
  (SELECT COUNT(*) FROM campaigns WHERE user_id = p.id) as total_campaigns,
  (SELECT COUNT(*) FROM scheduled_messages WHERE user_id = p.id AND status = 'pending') as pending_scheduled,
  (SELECT COUNT(*) FROM inbox_messages WHERE user_id = p.id AND direction = 'inbound' AND status = 'received') as unread_messages,
  (SELECT COALESCE(SUM(sent_count), 0) FROM campaigns WHERE user_id = p.id) as total_sent
FROM profiles p;

-- Campaign summary view
CREATE OR REPLACE VIEW campaign_summary AS
SELECT 
  c.*,
  p.email as user_email,
  p.full_name as user_name,
  t.name as template_name,
  g.name as group_name
FROM campaigns c
LEFT JOIN profiles p ON c.user_id = p.id
LEFT JOIN templates t ON c.template_id = t.id
LEFT JOIN contact_groups g ON c.target_group_id = g.id;

-- =============================================
-- SAMPLE DATA (Optional)
-- =============================================

-- Insert sample templates
INSERT INTO templates (user_id, name, content, category, variables, is_system) 
SELECT id, 'Welcome Message', 'Hi {{first_name}}, welcome to {{company}}! We are excited to have you.', 'marketing', '["first_name", "company"]', TRUE
FROM profiles WHERE role = 'super_admin' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO templates (user_id, name, content, category, variables, is_system)
SELECT id, 'Appointment Reminder', 'Hi {{first_name}}, this is a reminder for your appointment on {{date}} at {{time}}.', 'transactional', '["first_name", "date", "time"]', TRUE
FROM profiles WHERE role = 'super_admin' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO templates (user_id, name, content, category, variables, is_system)
SELECT id, 'OTP Verification', 'Your verification code is: {{code}}. Valid for 10 minutes.', 'transactional', '["code"]', TRUE
FROM profiles WHERE role = 'super_admin' LIMIT 1
ON CONFLICT DO NOTHING;

-- =============================================
-- GRANTS
-- =============================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Allow anon to read system templates
GRANT SELECT ON templates TO anon;