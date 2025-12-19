/*
  # Create Curriculum Mapping and Admin Config Tables
  
  This migration creates the foundational tables for integrating AP Chemistry curriculum
  with the Alabama Environmental Justice Dashboard.
  
  ## Tables Created
  
  ### 1. curriculum_mapping
  Links AP Chemistry topics to environmental data widgets with educational popup content.
  
  **Columns:**
  - `id` (uuid, primary key) - Unique identifier
  - `unit_code` (text) - AP Chemistry unit code (e.g., "Unit 3.1", "Unit 5", "Unit 7")
  - `topic_title` (text) - Human-readable topic name
  - `popup_content` (text) - Educational content displayed in hover popups
  - `target_metric` (text) - ID of the environmental widget (e.g., "benzene", "pfas", "ozone")
  - `chemistry_concept` (text) - Core chemistry concept (e.g., "Intermolecular Forces", "Kinetics")
  - `is_active` (boolean) - Whether this mapping is currently enabled
  - `created_at` (timestamptz) - Timestamp of creation
  - `updated_at` (timestamptz) - Timestamp of last update
  
  ### 2. admin_config
  Stores persistent admin preferences and dashboard configurations.
  
  **Columns:**
  - `id` (uuid, primary key) - Unique identifier
  - `config_key` (text, unique) - Setting name (e.g., "default_view", "active_unit")
  - `config_value` (jsonb) - Setting value in JSON format
  - `updated_at` (timestamptz) - Timestamp of last update
  
  ## Security
  
  ### Row Level Security (RLS)
  - Both tables have RLS enabled
  - All authenticated users can read curriculum mappings (SELECT)
  - Only authenticated users can modify curriculum mappings (INSERT/UPDATE/DELETE)
  - Only authenticated users can read and modify admin configs
  
  ## Notes
  - Uses UUID for primary keys to ensure uniqueness
  - Includes timestamps for audit trails
  - JSONB used for flexible admin configuration storage
  - Default values set for boolean and timestamp fields
*/

-- Create curriculum_mapping table
CREATE TABLE IF NOT EXISTS curriculum_mapping (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_code text NOT NULL,
  topic_title text NOT NULL,
  popup_content text NOT NULL,
  target_metric text NOT NULL,
  chemistry_concept text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create admin_config table
CREATE TABLE IF NOT EXISTS admin_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key text UNIQUE NOT NULL,
  config_value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE curriculum_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_config ENABLE ROW LEVEL SECURITY;

-- RLS Policies for curriculum_mapping
CREATE POLICY "Anyone can read curriculum mappings"
  ON curriculum_mapping
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert curriculum mappings"
  ON curriculum_mapping
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update curriculum mappings"
  ON curriculum_mapping
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete curriculum mappings"
  ON curriculum_mapping
  FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for admin_config
CREATE POLICY "Authenticated users can read admin config"
  ON admin_config
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert admin config"
  ON admin_config
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update admin config"
  ON admin_config
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default curriculum mappings
INSERT INTO curriculum_mapping (unit_code, topic_title, popup_content, target_metric, chemistry_concept) VALUES
  (
    'Unit 3.1',
    'Intermolecular Forces in Benzene',
    'Benzene (C₆H₆) is a nonpolar molecule with only London Dispersion Forces (LDFs) between molecules. These weak intermolecular forces result in high volatility and vapor pressure, which is why benzene readily evaporates at room temperature. This explains why benzene concentrations increase with temperature.',
    'benzene',
    'Intermolecular Forces'
  ),
  (
    'Unit 3.2',
    'PFAS and Solubility',
    'PFAS molecules contain Carbon-Fluorine (C-F) bonds, which are among the strongest single bonds in organic chemistry. The fluorinated tail is hydrophobic while the head group is often hydrophilic, making PFAS act as surfactants. This amphiphilic nature explains why PFAS persists in water systems and bioaccumulates.',
    'pfas',
    'Intermolecular Forces'
  ),
  (
    'Unit 5',
    'Kinetics and Ozone Formation',
    'Ground-level ozone (O₃) forms when Nitrogen Oxides (NOₓ) and Volatile Organic Compounds (VOCs) react in sunlight. This follows the Arrhenius equation (k = Ae^(-Ea/RT)), where reaction rate increases exponentially with temperature. Alabama''s high summer temperatures significantly accelerate ozone formation, explaining peak concentrations in hot afternoon hours.',
    'ozone',
    'Kinetics'
  ),
  (
    'Unit 7',
    'Chemical Equilibrium in Water',
    'Natural water systems maintain pH through the carbonic acid equilibrium: H₂CO₃ ⇌ HCO₃⁻ + H⁺. When acid rain or industrial waste introduces excess H⁺, Le Chatelier''s Principle predicts the equilibrium shifts left to resist the change. This buffering capacity protects aquatic ecosystems from rapid pH changes.',
    'ph',
    'Chemical Equilibrium'
  ),
  (
    'Unit 3.3',
    'CO₂ Sequestration and Gas Laws',
    'Carbon dioxide sequestration involves compressing CO₂ to supercritical fluid state and injecting it into geological formations. The behavior follows the Ideal Gas Law (PV=nRT) at lower pressures, but deviates at high pressures due to intermolecular forces. Understanding these deviations is crucial for calculating storage capacity and predicting long-term stability.',
    'carbon',
    'Intermolecular Forces'
  );

-- Insert default admin config
INSERT INTO admin_config (config_key, config_value) VALUES
  ('active_unit', '{"unit": "Unit 3.1", "enabled": true}'),
  ('default_view', '{"lat": 33.518, "lng": -86.810, "zoom": 10}'),
  ('student_mode', '{"enabled": false}');
