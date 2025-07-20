
-- First, let's create the admin user type by updating the user_type enum
ALTER TYPE user_type ADD VALUE 'admin';

-- Create the admin profile
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  'meron@godigitalafrica.com',
  crypt('Meron@123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  false,
  'authenticated'
);

-- Create the expert profile
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  'promsis@gmail.com',
  crypt('Promsis@123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  false,
  'authenticated'
);

-- Insert profiles for both users
INSERT INTO public.profiles (id, user_type, full_name, created_at, updated_at)
SELECT 
  id,
  'admin',
  'Meron Admin',
  now(),
  now()
FROM auth.users 
WHERE email = 'meron@godigitalafrica.com';

INSERT INTO public.profiles (id, user_type, full_name, created_at, updated_at)
SELECT 
  id,
  'digital_expert',
  'Promsis Expert',
  now(),
  now()
FROM auth.users 
WHERE email = 'promsis@gmail.com';

-- Create digital expert profile for Promsis
INSERT INTO public.digital_expert_profiles (user_id, specialization, bio, experience_years, hourly_rate, availability_status, skills, created_at, updated_at)
SELECT 
  id,
  'Full Stack Development',
  'Experienced digital expert specializing in web development and digital marketing solutions.',
  5,
  75.00,
  'available',
  ARRAY['Web Development', 'Digital Marketing', 'SEO', 'Social Media'],
  now(),
  now()
FROM auth.users 
WHERE email = 'promsis@gmail.com';

-- Update RLS policies to allow admin access
CREATE POLICY "Admins can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

CREATE POLICY "Admins can view all tasks" 
  ON public.tasks 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

CREATE POLICY "Admins can view all conversations" 
  ON public.conversations 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

CREATE POLICY "Admins can view all messages" 
  ON public.messages 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

CREATE POLICY "Admins can view all expert profiles" 
  ON public.digital_expert_profiles 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

CREATE POLICY "Admins can view all task reports" 
  ON public.task_reports 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );
