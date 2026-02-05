
import api from "./api";
export class ProjectService {

    static async createProject(data: FormData){
        await api.post('/projects/create' , data)
    }

    static async deleteProject(id: number){
         await api.delete(`/projects/${id}`)
    }


    static async updateProject(data: FormData , id: number){
       
        await api.patch(`/projects/${id}` , data)
    }
}