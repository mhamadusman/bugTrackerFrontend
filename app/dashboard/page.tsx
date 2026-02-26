import { serverApi } from "@/serverApi/serverApi"
import { ProjectType } from "@/public/src/components/types/types"
import Project from "@/public/src/components/project/project"

interface DashboardProps {
  searchParams: Promise<{ page: string, name: string, limit: string }>
}
export default async function DashboardPage({ searchParams }: DashboardProps) {

  const { page, name, limit } = await searchParams
  let projects: ProjectType[] = []
  let totalProjects
  let totalPages
  const api = await serverApi()

  try {
    const response = await api.get('/projects', {
      params: { page: page || '', name: name || '', limit: limit || '' }
    })
    projects = response.data.projectsWithDetails
    totalPages = response.data.pages
    totalProjects = response.data.totalProjects
  } catch (error: any) {
    console.error('error in fetching projects... ', error?.response?.message)
  }

  return (
    <>
      <Project projects={projects} totalPages={totalPages} totalProjects={totalProjects} />
    </>
  );
}