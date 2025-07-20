
-- First, let's ensure the admin user type exists in the enum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_type') THEN
        CREATE TYPE user_type AS ENUM ('client', 'digital_expert', 'sme');
    END IF;
    
    -- Add admin to the enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'admin' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_type')) THEN
        ALTER TYPE user_type ADD VALUE 'admin';
    END IF;
END $$;

-- Clean up any existing test users completely
DELETE FROM public.digital_expert_profiles WHERE user_id IN (
    SELECT id FROM auth.users WHERE email IN ('meron@godigitalafrica.com', 'promsis@gmail.com')
);
DELETE FROM public.profiles WHERE id IN (
    SELECT id FROM auth.users WHERE email IN ('meron@godigitalafrica.com', 'promsis@gmail.com')
);
DELETE FROM auth.users WHERE email IN ('meron@godigitalafrica.com', 'promsis@gmail.com');

-- Create admin user with proper Supabase Auth structure
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
    deleted_at,
    is_anonymous
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'a1111111-1111-1111-1111-111111111111',
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
    null,
    false
);

-- Create expert user with proper Supabase Auth structure
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
    deleted_at,
    is_anonymous
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'b2222222-2222-2222-2222-222222222222',
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
    null,
    false
);

-- Create profiles for both users
INSERT INTO public.profiles (id, user_type, full_name, created_at, updated_at)
VALUES (
    'a1111111-1111-1111-1111-111111111111',
    'admin',
    'Meron Admin',
    now(),
    now()
);

INSERT INTO public.profiles (id, user_type, full_name, created_at, updated_at)
VALUES (
    'b2222222-2222-2222-2222-222222222222',
    'digital_expert',
    'Promsis Expert',
    now(),
    now()
);

-- Create digital expert profile for Promsis
INSERT INTO public.digital_expert_profiles (user_id, specialization, bio, experience_years, hourly_rate, availability_status, skills, created_at, updated_at)
VALUES (
    'b2222222-2222-2222-2222-222222222222',
    'Full Stack Development',
    'Experienced digital expert specializing in web development and digital marketing solutions.',
    5,
    75.00,
    'available',
    ARRAY['Web Development', 'Digital Marketing', 'SEO', 'Social Media'],
    now(),
    now()
);

-- Verify the users were created correctly
SELECT email, encrypted_password, email_confirmed_at, created_at 
FROM auth.users 
WHERE email IN ('meron@godigitalafrica.com', 'promsis@gmail.com');
