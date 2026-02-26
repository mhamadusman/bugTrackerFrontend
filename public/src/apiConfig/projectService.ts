
import {api} from "../apiConfig/api";
export class ProjectService {

    static async createProject(data: FormData){
        const response = await api.post('/projects' , data)
        return response.data
    }

    static async deleteProject(id: number){
         await api.delete(`/projects/${id}`)
    }

static async updateProject(data: FormData, id: number) {
    const response = await api.patch(`/projects/${id}`, data);
    return response.data; 
}
}