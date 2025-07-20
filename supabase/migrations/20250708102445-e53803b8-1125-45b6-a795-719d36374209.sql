
-- Update RLS policies to allow SME users to view all expert profiles for consultation booking
-- First, drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can view their own expert profile" ON digital_expert_profiles;

-- Create new policies that allow:
-- 1. Users to view their own expert profile (for profile management)
-- 2. SME users to view all expert profiles (for consultation booking)
-- 3. Keep the existing insert and update policies

-- Policy for users to view their own expert profile
CREATE POLICY "Users can view their own expert profile" 
  ON digital_expert_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy for SME users to view all expert profiles for consultation booking
CREATE POLICY "SME users can view all expert profiles" 
  ON digital_expert_profiles 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'sme'
    )
  );

-- Policy for admin users to view all expert profiles
CREATE POLICY "Admin users can view all expert profiles" 
  ON digital_expert_profiles 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'admin'
    )
  );
