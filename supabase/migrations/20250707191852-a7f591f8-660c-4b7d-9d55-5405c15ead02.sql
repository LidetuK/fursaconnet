
-- First, let's remove the existing users and recreate them properly
DELETE FROM public.profiles WHERE id IN (
  SELECT id FROM auth.users WHERE email IN ('meron@godigitalafrica.com', 'promsis@gmail.com')
);

DELETE FROM public.digital_expert_profiles WHERE user_id IN (
  SELECT id FROM auth.users WHERE email IN ('meron@godigitalafrica.com', 'promsis@gmail.com')
);

DELETE FROM auth.users WHERE email IN ('meron@godigitalafrica.com', 'promsis@gmail.com');

-- Now let's create the users with proper Supabase Auth format
-- Admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'meron@godigitalafrica.com',
  crypt('Meron@123', gen_salt('bf')),
  now(),
  null,
  '',
  null,
  '',
  null,
  '',
  '',
  null,
  null,
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  false,
  now(),
  now(),
  null,
  null,
  '',
  '',
  null,
  '',
  0,
  null,
  '',
  null,
  false,
  null
);

-- Expert user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'promsis@gmail.com',
  crypt('Promsis@123', gen_salt('bf')),
  now(),
  null,
  '',
  null,
  '',
  null,
  '',
  '',
  null,
  null,
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  false,
  now(),
  now(),
  null,
  null,
  '',
  '',
  null,
  '',
  0,
  null,
  '',
  null,
  false,
  null
);

-- Create profiles for both users
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
