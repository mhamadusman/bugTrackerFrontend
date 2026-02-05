"use client"
import { useEffect, useState } from "react";
import { Search, Plus, LayoutGrid, List } from 'lucide-react'
import { usePathname } from "next/navigation";
import { BugType } from '../types/types';
import BugCard from "./bugCard";
import BugModel from "./bugModel";
import Pagination from "../pagination/pagination";
import { useRouter } from "next/navigation";
import BugRow from "./bugRow";
import BugDetailsModel from "./bugDetailsModel";



interface bugProps {
    bugs: BugType[]
    projectId: string
    totalBugs: number
    totalPages: number
}

export default function Bug({ bugs, projectId, totalBugs, totalPages }: bugProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [currentPage, setCurrentPage] = useState(1)
    const length = pathname.split('/')
    const [role, setRole] = useState<string | null>('')
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [gridView, setGridView] = useState<boolean>(true)
    const [edit, setEdit] = useState<boolean>(false)
    const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
    const [selectedBug, setSelectedBug] = useState<BugType | null>(null);
    const [title , setTitle] = useState('')


    const filterbugsUsingTitle = async (value: string) => {
        if(value.trim().length > 0){
             router.push(`/dashboard/bugs?title=${value}&page=${currentPage}`)
             
        }else{
             router.push(`/dashboard/bugs?page=${currentPage}`)
            
        }   

    }

    const updatePage = (page: number) => {
        setCurrentPage(page)
    }
    useEffect(() => {
        if (projectId) {
            router.push(`/dashboard/bugs?projectId=${projectId}&page=${currentPage}`);
        } else {
            router.push(`/dashboard/bugs?page=${currentPage}`);

        }
    }, [currentPage])

    const handleViewDetails = (bug: BugType) => {
        setSelectedBug(bug);
        setIsDetailsOpen(true);
    };

    const initialBugState: BugType = {
        bugId: 0,
        title: '',
        description: '',
        type: 'feature',
        status: 'pending',
        screenshot: '',
        deadline: '',
        projectId: 0
    };
    const [data, setData] = useState<BugType>(initialBugState);

    useEffect(() => {
        const updateRole = () => {
            const userRole = localStorage.getItem('role')
            setRole(userRole)
        }
        updateRole()
    }, [])

    const handleBugData = (bugData: BugType) => {
        console.log('received bug data :: ', bugData)
        setData(bugData)
    }

    return (
        <>
            <div className={`h-screen flex flex-col bg-gray-50 pt-20 overflow-hidden ${(isModalOpen || isDetailsOpen) ? 'blur-sm transition-all duration-300 pointer-events-none' : ''}`}>
                {/* header serch bar and add button  */}
                <div className="flex-shrink-0 px-6 lg:px-20">
                    <header className="border-t border-b border-gray-200 py-3 mb-1">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <h4 className="font-poppins text-xl font-bold text-gray-900 ">All bugs listing</h4>
                            <div className="flex items-center gap-3">
                                {(role === "sqa") && length.length === 3 && (
                                    <button
                                        onClick={() => setIsModalOpen((pre) => !pre)}
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
                            onChange={(e)=>{setTitle(e.target.value) ; filterbugsUsingTitle(e.target.value)}}
                            placeholder="Search bug using title"
                            className="font-inter text-xs  bg-gray-100 px-10 py-2 rounded-md outline-none w-55 border border-gray-200 focus:ring-0 shadow-none"
                        />
                        <div className="flex justify-end gap-1">
                            <div className="flex gap-2 shrink-0 items-center bg-gray-50 p-1 rounded-sm border border-gray-100">
                                <button
                                    onClick={() => setGridView(true)}
                                    className={`p-1 rounded-sm transition-colors ${gridView ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                    title="Grid View"
                                >
                                    <LayoutGrid size={20} />
                                </button>
                                <button
                                    onClick={() => setGridView(false)}
                                    className={`p-1 rounded-sm transition-colors ${!gridView ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                    title="List View"
                                >
                                    <List size={20} />
                                </button>
                            </div>
                        </div>

                    </div>
                    <hr className="text-gray-200 mt-1" />

                </div>

                {/* bugs  */}
                <div className="px-6 lg:px-20 pb-10 no-scrollbar overflow-y-auto h-screen">

                    <div className={`sticky top-0 z-50 w-full h-9 bg-gray-100 flex justify-between items-center px-3 ${gridView ? "hidden" : "flex"}`}>
                        <p className="uppercase text-[10px] text-gray-600 font-poppins font-bold">bug details</p>
                        <div className="uppercase text-[10px] flex justify-between space-x-6 font-poppins font-medium">
                            <p>status</p>
                            <span className="w-[0.5px] h-3 bg-gray-300"></span>
                            <p>due date</p>
                            <span className="w-[0.5px] h-3 bg-gray-300"></span>
                            <p>assigned to</p>
                            <span className="w-[0.5px] h-3 bg-gray-300"></span>
                            <p>action</p>
                            <span className="w-[0.5px] h-3 bg-gray-300"></span>
                        </div>
                    </div>
                    {!bugs || bugs.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center py-20">
                            <h2 className="font-poppins font-semibold text-gray-800 text-lg">No bugs found</h2>
                        </div>
                    ) : (
                        gridView ? (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                                {bugs.map((bug) => (
                                    <BugCard
                                        key={bug.bugId}
                                        bug={bug}
                                        handleBugData={handleBugData}
                                        handleViewDetails={handleViewDetails}
                                        setIsModalOpen={setIsModalOpen}
                                        setEdit={setEdit}
                                        role={role}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col bg-gray-50">
                                {bugs.map((bug) => (
                                    <BugRow
                                        key={bug.bugId}
                                        bug={bug}
                                        handleBugData={handleBugData}
                                        setIsModalOpen={setIsModalOpen}
                                        setEdit={setEdit}
                                        role={role}
                                    />
                                ))}
                            </div>
                        )
                    )}
                </div>
                <Pagination updatePage={updatePage} currentPage={currentPage} totalPages={totalPages} totalItems={totalBugs} />
            </div>

            {/* bug model  */}
            <BugModel
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                role={role}
                projectId={projectId}
                data={data}
                edit={edit}
                resetEdit={() => { setIsModalOpen(false); setEdit(false); setData(initialBugState) }}
            />
            {isDetailsOpen && selectedBug && (
                <BugDetailsModel
                    bug={selectedBug}
                    role={role}
                    onClose={() => setIsDetailsOpen(false)}
                />
            )}
        </>
    )
}