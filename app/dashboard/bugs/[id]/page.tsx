import { cookies } from "next/headers"
import api from "@/public/src/apiConfig/api"
import { BugType } from "@/public/src/components/types/types"
import Bug from "@/public/src/components/bug/bug"

interface projectIdProps {
  searchParams: Promise<{ projectId: string }>
}

export default async function ProjectId({ searchParams }: projectIdProps) {
  let bugs: BugType[] = []
  const { projectId } = await searchParams
  console.log('params value is :: ', projectId)
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value
    console.log('token value from cookie', token)
    const response = await api.get('/bugs', {
      params: { projectId: projectId },
      headers: { Authorization: `Bearer ${token}` }
    })
    bugs = response.data.bugs
    console.log(`these are the bugs which are created on project ${projectId}...... `, bugs)
  } catch (error) {
    console.log('error in fetching projects... ', error)
  }
  return (
    <>
      <Bug bugs={bugs} projectId={String(projectId)} />
    </>
  )
}