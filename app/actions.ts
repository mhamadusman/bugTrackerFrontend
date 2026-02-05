'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const logout = async () => {
  (await cookies()).delete('auth_token');
  redirect('/auth/login');
};

export const checkAuth = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value;
  if (!token) {
    return false
  }
  return true
};
