import api from "@/public/src/apiConfig/api"
import { ProjectType } from "@/public/src/components/types/types"
import { cookies } from "next/headers"
import Project from "@/public/src/components/project/project"
import { redirect } from "next/navigation"

interface DashboardProps{
  searchParams: Promise<{page: string ,name: string}>
}
export default async function DashboardPage({searchParams}: DashboardProps) {

  const {page , name} = await searchParams
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
      params: {page: page , name: name} ,
      headers: { Authorization: `Bearer ${token}` }
    })
    projects = response.data.projects
    totalPages = response.data.pages
    totalProjects = response.data.count
    console.log(`these are the projects...... `, projects)

  } catch (error: any) {
    console.log('error in fetching projects... ', error?.response?.message)
  }

  return (
    <>
      <Project projects={projects}  totalPages={totalPages} totalProjects={totalProjects}/>
    </>
  );
}