import api from "@/public/src/apiConfig/api";
import { cookies } from "next/headers";
import { IBugWithDeveloper } from "@/public/src/components/types/types";
import { redirect } from "next/navigation"
import Bug from "@/public/src/components/bug/bug";
import toast from "react-hot-toast";
interface projectIdProps {
  searchParams: Promise<{ projectId: string, page: string, title: string }>
}
export default async function BugsPage({ searchParams }: projectIdProps) {
  const { projectId, page, title } = await searchParams
  let bugs: IBugWithDeveloper[] = []
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  let totalBugs
  let totalPages
  if (!token) {
    redirect('/login')
  }
  try {
    const response = await api.get('/bugs', {
      params: {
        projectId: projectId || '',
        page: page,
        title: title || ''
      },
      headers: { Authorization: `Bearer ${token}` }
    });
    const bugsData = response.data.bugsWithDeveloper
    totalBugs = response.data.totalBugs
    totalPages = response.data.pages
    bugs = bugsData.map(item => ({
      ...item
    }));
  } catch (error: any) {
    toast.error('error in fetching bugs... ', error.response.data.message)
  }
  return (
    <>
      <Bug bugs={bugs} projectId={projectId} totalBugs={totalBugs} totalPages={totalPages} />
    </>
  );
}