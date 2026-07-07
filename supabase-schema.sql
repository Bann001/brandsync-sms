-- BrandSync SMS Database Schema for Supabase (Clean Run)
-- Run this in Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- DROP EXISTING POLICIES (for clean re-run)
-- =============================================
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename);
    END LOOP;
END $$;

-- =============================================
-- PROFILES
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  position TEXT,
  company TEXT,
  role TEXT DEFAULT 'user',
  credits INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all_profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- ROLES & PERMISSIONS
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
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id)
);

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all_roles" ON roles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_permissions" ON permissions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_role_permissions" ON role_permissions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_user_roles" ON user_roles FOR ALL USING (true) WITH CHECK (true);

INSERT INTO roles (name, description, is_system) VALUES
  ('super_admin', 'Full system access', TRUE),
  ('admin', 'Administrative access', TRUE),
  ('manager', 'Manage campaigns and contacts', TRUE),
  ('operator', 'Send messages and view reports', TRUE),
  ('viewer', 'Read-only access', TRUE)
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- CONTACTS
-- =============================================
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT NOT NULL,
  phone_number TEXT,
  email TEXT,
  company TEXT,
  position TEXT,
  tags TEXT[],
  group_ids TEXT[],
  custom_fields JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active',
  source TEXT,
  notes TEXT,
  interest TEXT,
  sales_person TEXT,
  event TEXT,
  added TEXT,
  last_contacted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_phone ON contacts(phone);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_contacts" ON contacts FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- CONTACT GROUPS
-- =============================================
CREATE TABLE IF NOT EXISTS contact_groups (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contact_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_groups" ON contact_groups FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- TEMPLATES
-- =============================================
CREATE TABLE IF NOT EXISTS templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  folder_id UUID,
  variables JSONB DEFAULT '[]',
  is_system BOOLEAN DEFAULT FALSE,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_templates_user_id ON templates(user_id);

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_templates" ON templates FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- TEMPLATE FOLDERS
-- =============================================
CREATE TABLE IF NOT EXISTS template_folders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE template_folders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_tpl_folders" ON template_folders FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- SCHEDULED MESSAGES
-- =============================================
CREATE TABLE IF NOT EXISTS scheduled_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  message TEXT NOT NULL,
  template_id UUID REFERENCES templates(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  provider_message_id TEXT,
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scheduled_user ON scheduled_messages(user_id);

ALTER TABLE scheduled_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_scheduled" ON scheduled_messages FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- INBOX MESSAGES
-- =============================================
CREATE TABLE IF NOT EXISTS inbox_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  contact_id UUID,
  phone_number TEXT NOT NULL,
  direction TEXT NOT NULL DEFAULT 'inbound',
  message TEXT NOT NULL,
  provider_message_id TEXT,
  status TEXT DEFAULT 'received',
  campaign_id UUID,
  scheduled_id UUID,
  metadata JSONB DEFAULT '{}',
  received_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inbox_user_id ON inbox_messages(user_id);
CREATE INDEX idx_inbox_phone ON inbox_messages(phone_number);

ALTER TABLE inbox_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_inbox" ON inbox_messages FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- CAMPAIGNS
-- =============================================
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  template_id UUID REFERENCES templates(id) ON DELETE SET NULL,
  message_content TEXT,
  status TEXT DEFAULT 'draft',
  target_type TEXT DEFAULT 'all',
  target_group_id UUID REFERENCES contact_groups(id) ON DELETE SET NULL,
  target_contact_ids UUID[],
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  cost_credits INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_campaigns" ON campaigns FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- CAMPAIGN RECIPIENTS
-- =============================================
CREATE TABLE IF NOT EXISTS campaign_recipients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  provider_message_id TEXT,
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE campaign_recipients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_camp_recipients" ON campaign_recipients FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- BLACKLIST
-- =============================================
CREATE TABLE IF NOT EXISTS blacklist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  reason TEXT,
  source TEXT DEFAULT 'manual',
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, phone_number)
);

ALTER TABLE blacklist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_blacklist" ON blacklist FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- AUTOMATION
-- =============================================
CREATE TABLE IF NOT EXISTS automation_rules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL DEFAULT 'keyword',
  trigger_config JSONB NOT NULL DEFAULT '{}',
  conditions JSONB DEFAULT '[]',
  actions JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  last_triggered_at TIMESTAMPTZ,
  trigger_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_automation" ON automation_rules FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- PENDING CONTACTS (BrandSync leads)
-- =============================================
CREATE TABLE IF NOT EXISTS pending_contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT DEFAULT 'Cloud Lead',
  phone TEXT NOT NULL,
  email TEXT DEFAULT 'N/A',
  company TEXT,
  position TEXT,
  event TEXT,
  interest TEXT,
  sales_person TEXT DEFAULT 'Unassigned',
  tags TEXT[],
  awareness TEXT,
  source TEXT DEFAULT 'Brand-Sync',
  brand_sync_id TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  added TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE pending_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_pending_contacts" ON pending_contacts FOR ALL USING (true) WITH CHECK (true);

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

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_audit" ON audit_logs FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- CREDIT TRANSACTIONS
-- =============================================
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'purchase',
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  description TEXT,
  reference_id UUID,
  reference_type TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_credits" ON credit_transactions FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- PROVIDER SETTINGS
-- =============================================
CREATE TABLE IF NOT EXISTS provider_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  name TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE provider_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_providers" ON provider_settings FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- WEBHOOKS
-- =============================================
CREATE TABLE IF NOT EXISTS webhooks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
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
CREATE POLICY "allow_all_webhooks" ON webhooks FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- APP SETTINGS
-- =============================================
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, key)
);

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_settings" ON app_settings FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- TRIGGER: auto-update updated_at
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename IN ('profiles', 'roles', 'contacts', 'contact_groups', 'templates',
                      'template_folders', 'campaigns', 'scheduled_messages', 'inbox_messages',
                      'blacklist', 'automation_rules', 'provider_settings', 'webhooks',
                      'pending_contacts')
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS update_%s_updated_at ON %I', t, t);
    EXECUTE format('CREATE TRIGGER update_%s_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', t, t);
  END LOOP;
END $$;

-- =============================================
-- DONE
-- =============================================
SELECT 'BrandSync SMS schema created successfully' AS status;