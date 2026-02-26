'use server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
export const logout = async () => {

  // (await cookies()).delete('auth_token');
  // (await cookies()).delete('refresh_token');
  redirect('/auth/login')

};
