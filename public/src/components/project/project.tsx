"use client"
import { useEffect, useState, useMemo } from "react";
import { Search, Plus } from 'lucide-react'
import { projectToEdit, ProjectType } from "../types/types";
import ProjectCard from "./projectCard";
import Model from "./model";
import BugDetailsModel from "../bug/bugDetailsModel";
import Pagination from "../pagination/pagination";
import { useRouter } from "next/navigation";
import debounce from 'lodash.debounce';
import { profile } from "../types/types";
import { UserService } from "../../apiConfig/userService";


interface projectProps {
    projects: ProjectType[]
    totalPages: number
    totalProjects: number
}

export default function Project({ projects, totalPages, totalProjects }: projectProps) {
    const router = useRouter()
    const [role, setRole] = useState<string>('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [project, setProject] = useState<projectToEdit | null>(null);
    const [selectedItem, setSelectedItem] = useState<ProjectType | null>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [user, setUser] = useState<profile>({
            name: '',
            email: '',
            password: '',
            phoneNumber: '',
            image: '',
        });
    const [name, setName] = useState('')

    const filterProjectsUsingName = useMemo(() => debounce((value: string) => {
        if (value.trim().length > 0) {
            router.push(`/dashboard?name=${value}&page=${currentPage}`);
        } else {
            router.push(`/dashboard?page=${currentPage}`);
        }
    }, 500),
        [router, currentPage]);

    const updatePage = (page: number) => {
        setCurrentPage(page)
    }
    useEffect(() => {
        router.push(`/dashboard?page=${currentPage}`);
    }, [currentPage])

    const handleViewProjectDetails = (project: ProjectType) => {
        setSelectedItem(project);
        setIsDetailsOpen(true);
    };

    const handleProjectData = (project: projectToEdit) => {
        console.log('handling edit project data in parent compont  :: ', project)
        setProject({
            name: project.name,
            id: project.id,
            description: project.description,
            image: project.image
        })
    }

    useEffect(() => {
        const updateRoleAndUser = async () => {
            const userRole = localStorage.getItem('role')
            if (userRole) {
                setRole(userRole)
            }
            const user = await UserService.getProfile()
            setUser({
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                image: user.image,
                password: user.password || ''
            });
        }

        updateRoleAndUser()
    }, [])

    return (
        <>
            <div className={`h-screen flex flex-col bg-gray-50 pt-16 lg:pt-18 overflow-hidden ${isModalOpen ? 'blur-sm transition-all duration-300' : ''}`}>
                {/* header section serch bar and add button  */}
                <div className="flex-shrink-0 px-3  lg:px-20">
                    <header className="border-t border-b border-gray-200  py-3 mb-2 lg:mb-4">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2  lg:gap-4">
                            <div className="border-l-4 border-[#43A67F] pl-4">
                                <h5 className="font-poppins text-md lg:text-lg font-bold text-gray-900 ">Visnext Software Solutions</h5>
                                <p className="font-poppins text-xs text-gray-400">Hi <span className="capitalize font-bold text-gray-700">{user.name}</span>, welcome to ManageBug</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className={`relative`}>
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setName(value);
                                            filterProjectsUsingName(value);
                                        }}
                                        placeholder="Search for Projects here"
                                        className="font-inter text-xs bg-gray-100 px-10 py-[11px] rounded-md outline-none w-64 border-none focus:ring-0 shadow-none"
                                    />
                                </div>

                                {(role === "manager") && (
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="bg-blue-600 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-md text-sm flex items-center gap-2 cursor-pointer transition-colors hover:bg-blue-700"
                                    >
                                        <Plus size={16} />  {role === "manager" ? <p className="text-xs lg:text-sm font-poppins">Add Project</p> : <p className="text-xs lg:text-sm font-poppins">Add Feature</p>}
                                    </button>
                                )}
                            </div>
                        </div>
                    </header>
                </div>

                {/* projects  */}
                <div className="flex-1 overflow-y-auto px-3 lg:px-20 lg:pb-4 no-scrollbar">
                    {projects && projects.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-2">
                            {projects.map((project) => (
                                <ProjectCard
                                    key={project.projectId}
                                    project={project}
                                    sendProject={handleProjectData}
                                    setIsModalOpen={setIsModalOpen}
                                    handleViewProjectDetails={handleViewProjectDetails}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center">
                            <h2 className="font-poppins font-semibold text-gray-800 text-lg">No projects found</h2>
                        </div>
                    )}
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={totalProjects} updatePage={updatePage} />

            </div>
            <Model
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                role={role}
                project={project}
                resetEdit={() => setProject({ name: '', id: 0, description: '', image: '' })}
            />
            {isDetailsOpen && selectedItem && (
                <BugDetailsModel
                    role={role}
                    onClose={() => {
                        setIsDetailsOpen(false);
                        setSelectedItem(null);
                    }}
                    project={selectedItem}
                />
            )}
        </>
    )
}