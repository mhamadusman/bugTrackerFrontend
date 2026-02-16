'use server';
import { cookies } from 'next/headers';

export const logout = async () => {
  (await cookies()).delete('auth_token');
  (await cookies()).delete('refresh_token');

};
