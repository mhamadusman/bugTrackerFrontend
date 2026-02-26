import {api} from '../apiConfig/api'

export class BugService {
  static async createBug(data: FormData) {
    const response = await api.post('/bugs', data);
    return response.data
  }

  static async updateBugStatus(bugStatus: string, bugId: string) {
    await api.patch(`/bugs/${bugId}`, { status: bugStatus });
  }
  static async deleteBug(id: number) {
    const response  = await api.delete(`/bugs/${id}`)
    return response
  }
  static async updateBug(data: FormData, bugId: string): Promise<any> {
    const response = await api.patch(`/bugs/${bugId}`, data);
    return response.data
  }
  static async getAllBugs(projectId: number): Promise<any> {
    const response = await api.get('/bugs', {
      params: { projectId: projectId },
    });
    return response;
  }
  static async getBugState(projectId: number): Promise<any> {
    const response = await api.get(`/bugs/bugState?projectId=${projectId}`);
    return response;
  }
}
