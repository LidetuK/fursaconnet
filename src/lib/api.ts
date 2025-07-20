export async function registerUser({ email, password, name }: { email: string; password: string; name: string }) {
  const res = await fetch('https://premium-promospace-production.up.railway.app/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
    credentials: 'include',
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Registration failed');
  return res.json();
}

export async function loginUser({ email, password }: { email: string; password: string }) {
  console.log('=== FRONTEND LOGIN START ===');
  console.log('loginUser called with email:', email);
  console.log('Cookies before login:', document.cookie);
  
  const res = await fetch('https://premium-promospace-production.up.railway.app/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });
  
  console.log('Login response status:', res.status);
  console.log('Login response headers:', res.headers);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.log('Login error response:', errorText);
    throw new Error(errorText || 'Login failed');
  }
  
  const data = await res.json();
  console.log('Login success - received data:', data);
  
  // Check if cookies were set
  console.log('Cookies after login:', document.cookie);
  console.log('=== FRONTEND LOGIN END ===');
  
  return data;
}

export async function getCurrentUser() {
  console.log('=== FRONTEND GET CURRENT USER START ===');
  console.log('getCurrentUser called - checking authentication...');
  console.log('Current cookies:', document.cookie);
  
  // Use cookies instead of localStorage tokens to match backend authentication
  const res = await fetch('https://premium-promospace-production.up.railway.app/auth/me', {
    method: 'GET',
    credentials: 'include', // This sends cookies
  });
  
  console.log('Auth/me response status:', res.status);
  console.log('Auth/me response headers:', res.headers);
  
  if (res.status === 401) {
    console.log('401 Unauthorized - no valid authentication found');
    const responseText = await res.text();
    console.log('Response text:', responseText);
    console.log('=== FRONTEND GET CURRENT USER END (401) ===');
    return null;
  }
  if (!res.ok) {
    const errorText = await res.text();
    console.log('Auth/me error response:', errorText);
    console.log('=== FRONTEND GET CURRENT USER END (ERROR) ===');
    throw new Error((await res.json()).message || 'Failed to fetch user');
  }
  
  const data = await res.json();
  console.log('Auth/me success - user data:', data);
  console.log('=== FRONTEND GET CURRENT USER END (SUCCESS) ===');
  return data.user;
}

export async function ping() {
  console.log('Pinging backend...');
  console.log('Current cookies:', document.cookie);
  
  const res = await fetch('https://premium-promospace-production.up.railway.app/auth/ping', {
    method: 'GET',
    credentials: 'include',
  });
  
  console.log('Ping response status:', res.status);
  
  const data = await res.json();
  console.log('Ping response:', data);
  return data;
}

export async function registerSme({ email, company_name, password, company_logo }: { email: string; company_name: string; password: string; company_logo: string }) {
  const res = await fetch('https://premium-promospace-production.up.railway.app/auth/register-sme', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, company_name, password, company_logo }),
    credentials: 'include',
  });
  if (!res.ok) throw new Error((await res.json()).message || 'SME registration failed');
  return res.json();
} 