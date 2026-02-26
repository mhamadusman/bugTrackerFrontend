import axios from 'axios';
import { cookies } from 'next/headers';

export const serverApi = async () => {
  const cookieStore = await cookies();
  const allCookies = cookieStore.toString(); 

    // const baseURL = process.env.NODE_ENV === 'production'
    // ? process.env.BACKEND_URL
    // : process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL
    const baseURL = process.env.BACKEND_URL
  

  return axios.create({
    baseURL,
    headers: { Cookie: allCookies }
  });
}
