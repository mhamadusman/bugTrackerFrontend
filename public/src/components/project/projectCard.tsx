"use client"
import { MoreHorizontal, Edit2, Trash2, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectService } from "../../apiConfig/projectService";
import { projectToEdit } from "../types/types";
import { BugType, ProjectType } from "../types/types";
import { baseUrl } from "../../apiConfig/api";
import toast from "react-hot-toast";
import { BugService } from "../../apiConfig/bugService";


interface projectCardProps {
    project: ProjectType
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    sendProject: (project: projectToEdit) => void
    handleViewProjectDetails: (project: ProjectType) => void;
}

export default function ProjectCard({ project, sendProject, setIsModalOpen, handleViewProjectDetails }: projectCardProps) {
    const router = useRouter();
    const [show, setShow] = useState<boolean>(false)
    const [role, setRole] = useState('')
    const [bugs, setBugs] = useState<BugType[]>([])
    const [bugStats, setBugStats] = useState({
        totalBugs: 0,
        completedBugs: 0,
        pendingBugs: 0
    });

    const fallbackImage = '/icons/pro2.png';
    const imageUrl = (project.image && project.image !== "null") ? `${baseUrl}${project.image}` : fallbackImage;
    const completedbugs = bugs?.filter(bug => bug.projectId === project.projectId)?.filter(bug => bug.status === "completed")
    const totalBugs = bugs?.filter(bug => bug.projectId === project.projectId)

    const onDetailsClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleViewProjectDetails(project);
    };

    const handleCardClick = () => {
        router.push(`/dashboard/bugs?projectId=${project.projectId}`);
    };

    const handleEdit = async () => {
        try {
            const projectTobeEdit: projectToEdit = { id: project.projectId, name: project.name, description: project.description, image: project.image }
            sendProject(projectTobeEdit)
        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || "Failed to edit project";
            toast.error(errorMsg);
        }
    }

    const deleteProject = async () => {
        try {
            await ProjectService.deleteProject(project.projectId)
            toast.success('Project deleted successfully');
            router.refresh()
        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || "Failed to delete project";
            toast.error(errorMsg);
        }
    }

    useEffect(() => {
        const update = () => {
            const userRole = localStorage.getItem('role')
            if (userRole) {
                setRole(userRole)
            }
        }
        update()
    }, [])
    const fetchBugStats = async () => {
        try {
            const response = await BugService.getBugState(project.projectId)
            setBugStats({
                totalBugs: response?.data?.totalBugs,
                completedBugs: response?.data?.completedBugs,
                pendingBugs: response?.data?.pendingBugs
            });

        } catch (error) {
            console.error('Error fetching bug stats:', error);
        }
    };

    useEffect(() => {
        const fetch = () => {
            if (project.projectId) {
                fetchBugStats();
            }
        }
        fetch()
    }, [project.projectId]);

    return (
        <div
            onClick={handleCardClick}
            className="bg-white py-3  px-6  mt-2 rounded-sm shadow-xs relative border-none cursor-pointer group hover:bg-white hover:shadow-lg transition-all"
        >
            <div className="w-8 h-8 mb-4 rounded-sm overflow-hidden flex items-center justify-center bg-teal-100">
                <img src={imageUrl} alt="fallback" className="w-8 h-8 object-cover" />
            </div>


            <button
                onClick={onDetailsClick}
                className="absolute top-5 right-4 cursor-pointer p-1 text-gray-300 hover:text-gray-700 transition-colors z-10"
                title="View Project Details"
            >
                <Info size={18} />
            </button>

            {role === "manager" && (
                <div className="absolute top-5 right-11">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShow(!show)
                        }}
                        className="text-gray-300 cursor-pointer hover:text-gray-700 p-1 transition-colors"
                    >
                        <MoreHorizontal size={20} />
                    </button>

                    {show && (
                        <div className="absolute right-0 mt-2 w-32 bg-white shadow-xl rounded-lg z-20 py-2 border border-gray-50">
                            <button onClick={(e) => {
                                e.stopPropagation();
                                setIsModalOpen(true);
                                handleEdit()
                                setShow(false)
                            }} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors">
                                <Edit2 size={12} /> Edit
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); deleteProject() }} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors">
                                <Trash2 size={12} /> Delete
                            </button>
                        </div>
                    )}
                </div>
            )}

            <h3 className="font-poppins font-semibold text-gray-600 mb-1 text-sm">{project.name}</h3>
            <p className="font-inter font-light text-[14px] text-gray-400 mb-4 ">
                {project.description}
            </p>

            <div className="pt-2">
                <p className="font-inter text-sm text-gray-500 font-medium">
                    Task Done:
                    <span className="text-gray-900 font-bold ml-1">
                        {`${bugStats.completedBugs} / ${bugStats.totalBugs}`}
                    </span>
                </p>
            </div>
        </div>
    )
}