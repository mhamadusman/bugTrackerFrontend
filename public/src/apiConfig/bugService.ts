import {api} from '../apiConfig/api'
import { IBugWithDeveloper } from '../components/types/types';
export class BugService {
  static async createBug(data: FormData): Promise<IBugWithDeveloper> {
    const response = await api.post('/bugs', data);
    return response.data
  }

  static async updateBugStatus(bugStatus: string, bugId: string){
    const response = await api.patch(`/bugs/${bugId}`, { status: bugStatus });
    return response.data.message
  }
  static async deleteBug(id: number) {
    const response  = await api.delete(`/bugs/${id}`)
    return response.data.message
  }
  static async updateBug(data: FormData, bugId: string) {
    const response = await api.patch(`/bugs/${bugId}`, data);
    return response.data
  }
  static async getAllBugs(projectId: number) {
    const response = await api.get('/bugs', {
      params: { projectId: projectId },
    });
    return response;
  }

}
