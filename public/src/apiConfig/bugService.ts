import { BugType } from '../components/types/types';
import api from "./api";



export class BugService {

    static async createBug(data: FormData){
        await api.post('/bugs', data)
    }

    static async updateBugStatus(bugStatus: string , bugId: string){
        console.log(bugId , bugStatus)
        await api.patch(`/bugs/${bugId}`, {bugStatus: bugStatus})
    }
    static async deleteBug(id: number){
        await api.delete(`/bugs/${id}`)
    }
    static async updateBug(data: FormData, bugId: string){
        await api.patch(`/bugs/${bugId}` , data)

    }
    static async getAllBugs(projectId: number): Promise<any>{
        const response = await api.get('/bugs' , {
            params: {projectId: projectId}
        })
         return response
       
    }
    static async getBugState(projectId: number): Promise<any>{
        const response  = await api.get(`/bugs/bugState?projectId=${projectId}`)
        return response 
    }
}