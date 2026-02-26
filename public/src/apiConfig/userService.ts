import { profile, User } from '../components/types/types';
import {api} from '../apiConfig/api';

export class UserService {
  static async getUsers(): Promise<User[]> {
    const response = await api.get('/users');
    console.log(`users are : ${response.data.users}`);
    return response.data.users;
  }

  //get users having role=developer
  static async getDevelopers(projectId: string): Promise<User[]> {
    try {
      const response = await api.get(`/users/${projectId}`);
      const developers: User[] = response.data.developers;
      return developers;
    } catch (error: any) {
      alert(`error fetching developers: ${error.message}`);
      return [];
    }
  }

  // static async getUser(id: string) {
  //   const response = await api.get(`/users/?id=${id}`);
  //   return response?.data?.user || null;
  // }

  //get assigned users on a project developrs and sqa
  // static async getAssignedUsers(projectId: number): Promise<User[]> {
  //   const response = await api.get(`/users/${projectId}`);
  //   const users: User[] | [] = response.data.developers;
  //   if (users) {
  //     return users;
  //   }
  //   return [];
  // }

  static async updateProfile(data: FormData) {
    await api.patch('/users/update', data);
  }

  static async getProfile(): Promise<profile> {
    const response = await api.get('/users/me');
    const user = response.data.user;
    return user;
  }
}
