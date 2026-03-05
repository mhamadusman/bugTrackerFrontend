
import {api} from "../apiConfig/api";
export class ProjectService {

    static async createProject(data: FormData){
        const response = await api.post('/projects' , data)
        return response.data.message
    }

    static async deleteProject(id: number){
         const response = await api.delete(`/projects/${id}`)
         return response.data.message
    }

static async updateProject(data: FormData, id: number) {
    const response = await api.patch(`/projects/${id}`, data);
    return response.data.message; 
}
}