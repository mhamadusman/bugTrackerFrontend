"use client"
import { MoreHorizontal, Edit2, Trash2, Info } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ProjectService } from "../../apiConfig/projectService";
import { projectToEdit } from "../types/types";
import { ProjectType } from "../types/types";
import toast from "react-hot-toast";
import Image from "next/image";


interface projectCardProps {
    project: ProjectType
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    sendProject: (project: projectToEdit) => void
    handleViewProjectDetails: (project: ProjectType) => void;
    setAllProjects: React.Dispatch<React.SetStateAction<ProjectType[]>>;
}

export default function ProjectCard({ project, sendProject, setIsModalOpen, handleViewProjectDetails, setAllProjects }: projectCardProps) {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [show, setShow] = useState<boolean>(false)
    const [role, setRole] = useState('')


    const fallbackImage = '/icons/pro2.png';
    const imageUrl = (project.image && project.image !== "null") ? `${project.image}` : fallbackImage;
    const onDetailsClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleViewProjectDetails(project);
    };

    const handleCardClick = () => {
        router.push(`/dashboard/bugs?projectId=${project.projectId}`);
    };

    const handleEdit = async () => {
        try {
            const projectTobeEdit: projectToEdit = {
                projectId: project.projectId,
                name: project.name,
                description: project.description,
                image: project.image,
                devTeam: project.devTeam || [],
                qaTeam: project.qaTeam || []
            }

            sendProject(projectTobeEdit)
            setIsModalOpen(true)
        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || "Failed to edit project";
            toast.error(errorMsg);
        }
    }

    const deleteProject = async () => {
        try {
            await ProjectService.deleteProject(project.projectId);

            setAllProjects((prev) => prev.filter((p) => p.projectId !== project.projectId));

            toast.success('Project deleted successfully');
        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || "Failed to delete project";
            toast.error(errorMsg);
        }
    };

    useEffect(() => {
        const update = () => {
            const userRole = localStorage.getItem('role')
            if (userRole) {
                setRole(userRole)
            }
        }
        update()
    }, [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShow(false);
            }
        };

        if (show) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [show]);

    return (
        <div
            onClick={handleCardClick}
            className="bg-white py-3 px-6 mt-2 rounded-sm shadow-xs relative border-none cursor-pointer group hover:bg-white hover:shadow-lg transition-all"
        >
            <div className="w-8 h-8 mb-4 rounded-sm overflow-hidden flex items-center justify-center ">
                <Image unoptimized={true} width={31} height={31} src={imageUrl} alt="fallback" className="object-cover" />
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
                        className="text-gray-300 cursor-pointer hover:text-gray-700 p-1 transition-colors  z-30 relative"
                    >
                        <MoreHorizontal size={20} />
                    </button>

                    {show && (

                        <>
                        <div
                                className="fixed inset-0 z-10 cursor-default"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShow(false);
                                }}
                            />
                            <div
                                className="fixed inset-0 z-10 cursor-default"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShow(false);
                                }}
                            />
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
                        </>
                    )}
                </div>
            )}

            <h3 className="font-poppins font-semibold text-gray-600 mb-1 text-sm">{project.name}</h3>


            <p className="font-inter font-light text-[14px] text-gray-400 mb-4 min-h-[60px] line-clamp-3 overflow-hidden">
                {project.description}
            </p>

            <div className="pt-2  border-gray-50">
                <p className="font-inter text-xs text-gray-500 font-medium">
                    Task Done:
                    <span className="text-gray-900 font-bold ml-1 text-[10px]">
                        {`${project.taskComplete} / ${project.totalBugs}`}
                    </span>
                </p>
            </div>
        </div>
    )
}