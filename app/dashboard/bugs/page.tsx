import { serverApi } from "@/serverApi/serverApi";
import { IBugWithDeveloper } from "@/public/src/components/types/types";
import { redirect } from "next/navigation"
import Bug from "@/public/src/components/bug/bug";


interface projectIdProps {
  searchParams: Promise<{ projectId: string, page: string, title: string }>
}
export default async function BugsPage({ searchParams }: projectIdProps) {
  const { projectId, page, title } = await searchParams
  const api = await serverApi()
  let bugs: IBugWithDeveloper[] = []
  let totalBugs
  let totalPages

  try {
    const response = await api.get('/bugs', {
      params: {
        projectId: projectId || '',
        page: page,
        title: title || ''
      }
    });
    bugs = response.data.bugsWithDeveloper
    totalBugs = response.data.totalBugs
    totalPages = response.data.pages
  } catch (error: any) {
    console.error('error in getting bugs :: ', error.response.data.message)
    redirect('/auth/login')
  }

  return <Bug bugs={bugs} projectId={projectId} totalBugs={totalBugs} totalPages={totalPages} />
}