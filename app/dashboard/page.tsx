import api from "@/public/src/apiConfig/api"
import { ProjectType } from "@/public/src/components/types/types"
import { cookies } from "next/headers"
import Project from "@/public/src/components/project/project"
import { redirect } from "next/navigation"

interface DashboardProps{
  searchParams: Promise<{page: string ,name: string , limit: string}>
}
export default async function DashboardPage({searchParams}: DashboardProps) {

  const {page , name , limit} = await searchParams
  let projects: ProjectType[] = []
  let totalProjects
  let totalPages
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  if(!token){
    redirect('/auth/login')
  }

  try {
    
    console.log('token value from cookie' , token)
    const response = await api.get('/projects', {
      params: {page: page , name: name , limit: limit} ,
      headers: { Authorization: `Bearer ${token}` }
    })
    projects = response.data.projectsWithDetails
    totalPages = response.data.pages
    totalProjects = response.data.totalProjects
  } catch (error: any) {
    console.error('error in fetching projects... ', error?.response?.message)
  }

  return (
    <>
      <Project projects={projects}  totalPages={totalPages} totalProjects={totalProjects}/>
    </>
  );
}