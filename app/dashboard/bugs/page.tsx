import api from "@/public/src/apiConfig/api";
import { cookies } from "next/headers";
import { BugType } from "@/public/src/components/types/types";
import { redirect } from "next/navigation"
import Bug from "@/public/src/components/bug/bug";

interface projectIdProps {
  searchParams: Promise<{ projectId: string, page: string , title: string }>


}


export default async function BugsPage({ searchParams }: projectIdProps) {

  const { projectId, page , title } = await searchParams
  let bugs: BugType[] = []
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  let totalBugs
  let totalPages
  if (!token) {
    redirect('/login')
  }

  console.log('we are going to fetch bugs on a project....')
  try {

    console.log('token value from cookie', token)
    const response = await api.get('/bugs', {
      params: { projectId: projectId ? projectId : '', page: page , title: title ? title : '' },
      headers: { Authorization: `Bearer ${token}` }
    })
    bugs = response.data.bugs
    totalBugs = response.data.totalBugs
    totalPages = response.data.pages
    console.log(`these are the projects...... `, bugs)

  } catch (error: any) {
    console.log('error in fetching projects... ', error.response.data.message)
  }

  return (
    <>
      <Bug bugs={bugs} projectId={projectId} totalBugs={totalBugs} totalPages={totalPages} />
    </>
  );
}