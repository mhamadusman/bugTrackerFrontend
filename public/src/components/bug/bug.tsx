"use client"
import { useEffect, useState } from "react";
import { Search, Plus, LayoutGrid, List } from 'lucide-react'
import { LoadingIndicator } from '../loadingIndicator/loadingIndicator';
import BugCard from "./bugCard";
import BugModel from "./bugModel";
import Pagination from "../pagination/pagination";
import { useRouter } from "next/navigation";
import BugDetailsModel from "./bugDetailsModel";
import BugRow from "./bugRow";
import { User } from '../types/types';
import { UserService } from "../../apiConfig/userService";
import { IBugDTO } from "../types/types";
import { IBugWithDeveloper } from "../types/types";
interface bugProps {
    bugs: IBugWithDeveloper[]
    projectId: string
    totalBugs: number
    totalPages: number
}
export default function Bug({ bugs, projectId, totalBugs, totalPages }: bugProps) {
    const router = useRouter()
    const [currentPage, setCurrentPage] = useState(1)
    const [role, setRole] = useState<string | null>('')
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [gridView, setGridView] = useState<boolean>(true)
    const [edit, setEdit] = useState<boolean>(false)
    const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
    const [selectedBug, setSelectedBug] = useState<IBugWithDeveloper | null>(null);
    const [title, setTitle] = useState('')
    const [developers, setDevelopers] = useState<User[] | []>([])
    const [showLoading, setLoading] = useState(false)
    const [allBugs, setAllBugs] = useState<IBugWithDeveloper[]>(bugs)
    const filterbugsUsingTitle = async (value: string) => {
        if (value.trim().length > 0) {
            router.push(`/dashboard/bugs?title=${value}&page=${currentPage}`)
        } else {
            router.push(`/dashboard/bugs?page=${currentPage}`)
        }
    }
    const updatePage = (page: number) => {
        setCurrentPage(page);
        const query = projectId ? `?projectId=${projectId}&page=${page}` : `?page=${page}`;
        setLoading(true)
        router.push(`/dashboard/bugs${query}`);
    };
    const handleViewDetails = (bug: IBugWithDeveloper) => {
        setSelectedBug(bug);
        setIsDetailsOpen(true);
    };
    const initialBugState: IBugDTO = {
        bugId: 0,
        title: '',
        description: '',
        type: 'feature',
        status: 'pending',
        screenshot: '',
        deadline: '',
        developerId: 0,
        sqaId: 0,
        createdAt: '',
        updatedAt: '',
        projectId: 0,
        isClose: false
    };
    const [bugToEdit, setBugToEdit] = useState<IBugDTO>(initialBugState);
    useEffect(() => {
        const updateRole = () => {
            const userRole = localStorage.getItem('role')
            setRole(userRole)
        }
        updateRole()
    }, [])
    const handleBugData = (bugData: IBugDTO) => {
        setBugToEdit(bugData)
        getDevelopers(String(bugData.projectId))
    }
    const getDevelopers = async (projectId: string) => {
        if (developers.length > 0) {
            return
        }
        try {
            const developers = await UserService.getDevelopers(String(projectId))
            const devs: User[] | [] = developers.filter((dev: User) => dev.userType === "developer")
            setDevelopers(devs)
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        setAllBugs(bugs);
        setLoading(false)
    }, [bugs]);
    return (
        <>
            <div className={`h-screen flex flex-col bg-gray-50 pt-20 overflow-hidden ${(isModalOpen || isDetailsOpen) ? 'blur-sm transition-all duration-300 pointer-events-none' : ''}`}>
                {/* header search bar and add button */}
                <div className="shrink-0 px-3 lg:px-20">
                    <header className="border-t border-b border-gray-200 py-3 lg:mb-1 mb-2">
                        <div className="flex  md:flex-row md:items-end justify-between gap-4">
                            <h4 className="font-poppins text-xl font-bold text-gray-900 ">All bugs listing</h4>
                            <div className="flex items-center gap-3">
                                {(role === "sqa") && projectId && (
                                    <button
                                        onClick={() => { setIsModalOpen((pre) => !pre); getDevelopers(projectId) }}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 cursor-pointer transition-colors hover:bg-blue-700"
                                    >
                                        <Plus size={16} /> Add Feature
                                    </button>
                                )}
                            </div>
                        </div>
                    </header>
                    <div className="relative flex justify-between items-center">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => { setTitle(e.target.value); filterbugsUsingTitle(e.target.value) }}
                            placeholder="Search bug using title"
                            className="font-inter text-xs bg-gray-100 px-10 py-2 rounded-md outline-none w-full max-w-[220px] border border-gray-200 focus:ring-0 shadow-none"
                        />
                        <div className="flex justify-end gap-1">
                            <div className="flex gap-2 shrink-0 items-center bg-gray-50 p-1 rounded-sm border border-gray-100">
                                <button
                                    onClick={() => setGridView(true)}
                                    className={`p-1 rounded-sm transition-colors ${gridView ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                    title="Grid View"
                                >
                                    <LayoutGrid size={20} />
                                </button>
                                <button
                                    onClick={() => setGridView(false)}
                                    className={`p-1 rounded-sm transition-colors ${!gridView ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                    title="List View"
                                >
                                    <List size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <hr className="text-gray-200 mt-1" />
                </div>
                <div className="px-3 lg:px-20 pb-10 no-scrollbar overflow-y-auto flex-1">
                    <div className="lg:px-0 pb-0 no-scrollbar overflow-y-auto flex-1">
                        <div className="min-w-max">
                            {/* header row */}
                            <div className={`sticky top-0 z-40 w-full h-9 bg-gray-100 flex justify-between items-center px-4  ${gridView ? "hidden" : "flex"}`}>
                                <p className="uppercase text-[10px] text-gray-600 font-poppins font-bold truncate flex-1 pr-4">
                                    bug details
                                </p>
                                <div className="flex items-center gap-2 sm:gap-6 uppercase text-[10px] font-poppins font-medium text-gray-600">
                                    <div className="w-16 sm:w-24 text-center flex items-center justify-center gap-1 sm:gap-2">
                                        <p>status</p>
                                        <span className="hidden sm:block w-[0.5px] h-3 bg-gray-300"></span>
                                    </div>
                                    <div className="w-20 sm:w-28 text-center flex items-center justify-center gap-1 sm:gap-2">
                                        <p className="truncate">due date</p>
                                        <span className="hidden sm:block w-[0.5px] h-3 bg-gray-300"></span>
                                    </div>
                                    <div className="hidden xs:flex w-20 sm:w-24 text-center items-center justify-center gap-2">
                                        <p>assigned</p>
                                        {role !== "manager" && <span className="hidden sm:block w-[0.5px] h-3 bg-gray-300"></span>}
                                    </div>
                                    {role !== "manager" && (
                                        <div className="w-8 sm:w-10 text-center">
                                            <p>actions</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    {showLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <LoadingIndicator />
                        </div>
                    ) : (
                        <>
                            {!allBugs || allBugs.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center py-20">
                                    <h2 className="font-poppins font-semibold text-gray-800 text-lg">No bugs found</h2>
                                </div>
                            ) : (
                                gridView ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                                        {allBugs.map((item) => (
                                            <BugCard
                                                key={item.bug.bugId}
                                                item={item}
                                                handleBugData={handleBugData}
                                                handleViewDetails={handleViewDetails}
                                                setIsModalOpen={setIsModalOpen}
                                                setEdit={setEdit}
                                                role={role}
                                                setAllBugs={setAllBugs}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col bg-gray-50">
                                        {allBugs.map((item) => (
                                            <BugRow
                                                key={item.bug.bugId}
                                                item={item}
                                                handleBugData={handleBugData}
                                                handleViewDetails={handleViewDetails}
                                                setIsModalOpen={setIsModalOpen}
                                                setEdit={setEdit}
                                                role={role}
                                                setAllBugs={setAllBugs}
                                            />
                                        ))}
                                    </div>
                                )
                            )}
                        </>
                    )}
                </div>
                <div className="shrink-0">
                    <Pagination updatePage={updatePage} currentPage={currentPage} totalPages={totalPages} totalItems={totalBugs} />
                </div>
            </div>
            <BugModel
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                role={role as string}
                projectId={projectId}
                bugToEdit={bugToEdit}
                edit={edit}
                developers={developers}
                setAllBugs={setAllBugs}
                resetEdit={() => { setIsModalOpen(false); setEdit(false); setBugToEdit(initialBugState) }}
            />
            {isDetailsOpen && selectedBug && (
                <BugDetailsModel
                    item={selectedBug}
                    role={role as string}
                    onClose={() => setIsDetailsOpen(false)}
                />
            )}
        </>
    );
}