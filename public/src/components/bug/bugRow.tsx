"use client"

import { MoreVertical, Calendar, Trash2,Edit2 } from "lucide-react";
import { useState } from "react";
import { BugType } from "../types/types";
import { BugService } from "../../apiConfig/bugService";
import { useRouter } from 'next/navigation'


interface bugProps {
    bug: BugType,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleBugData: (bugData: BugType) => void
    setEdit: React.Dispatch<React.SetStateAction<boolean>>;
    role: string | null
}

export default function BugRow({ bug, setIsModalOpen, handleBugData, setEdit, role }: bugProps) {

    const router = useRouter()
    const [showDropDown, setShowDropDown] = useState<boolean>(false)
    const [show, setShow] = useState<boolean>(false)
    const updaBugStatus = async (bugStatus: string) => {
        console.log(bugStatus, bug.bugId)
        try {

            await BugService.updateBugStatus(bugStatus, String(bug.bugId))
            router.refresh()

        } catch (error: any) {
            alert(`error in updating bug status ${error?.data?.message}`)
        }
    }

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "pending":
                return "text-red-500 bg-red-100";
            case "in progress":
                return "text-blue-500 bg-blue-100";
            case "completed":
                return "text-green-500 bg-green-100";
        }
    }
    const deleteBug = async () => {
        try {

            await BugService.deleteBug(bug.bugId)
            router.refresh()

        } catch (error) {
            alert(`error in deleting bug.... ${error}`)
        }
    }
    const handleEdit = async () => {
        setEdit((pre) => !pre);
        handleBugData(bug)

    }

    return (
        <div className="w-full bg-white border border-gray-100 flex justify-between items-center px-3 py-3 hover:bg-gray-50 transition-all cursor-pointer group relative">


            <div className="flex items-center gap-2 ">
                <div className={`w-2 h-2 rounded-full ${bug.status.toLowerCase() === 'pending' ? 'bg-red-500' : bug.status.toLowerCase() === 'in progress' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                <p className="font-poppins text-[12px] text-gray-700 font-medium truncate max-w-[400px]">
                    {bug.title}
                </p>
            </div>

            <div className="flex items-center gap-6 lg:gap-7">


                <div className="w-24 flex justify-center">
                    <span className={`font-inter text-[10px] p-1 px-2 rounded-xl  ${getStatusStyles(bug.status)}`}>
                        {bug.status}
                    </span>
                </div>

                <div className="flex items-center gap-1 w-28 justify-center">
                    <Calendar size={14} className="text-blue-400" />
                    <span className="text-[8px] font-medium text-gray-700">
                        {new Date(bug.deadline).toLocaleDateString()}
                    </span>
                </div>


                <div className="flex -space-x-2 w-24 justify-center">
                    <img src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" className="size-6 rounded-full ring-2 ring-white" />
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" className="size-6 rounded-full ring-2 ring-white" />
                </div>

                {role === "developer" && (
                    <div className="">
                        <button
                            onClick={() => setShowDropDown(!showDropDown)}
                            className="text-gray-300 hover:bg-gray-100 p-1 cursor-pointer rounded-full transition-colors"
                        >
                            <MoreVertical size={20} />
                        </button>
                        {showDropDown && (
                            <div className="absolute cursor-pointer right-0 mt-2 w-32 bg-white shadow-xl rounded-lg z-20 py-2 border border-gray-50 flex flex-col gap-1">
                                <button onClick={() => { updaBugStatus("pending"); setShowDropDown(false) }} className="px-2 py-1 mx-1 rounded-lg text-[10px] text-red-500 cursor-pointer bg-red-100 hover:bg-red-200 transition-colors text-left">
                                    pending
                                </button>
                                <button onClick={() => { updaBugStatus("in progress"); setShowDropDown(false) }} className="px-2 py-1 mx-1 rounded-lg text-[10px] text-blue-500 cursor-pointer bg-blue-100 hover:bg-blue-200 transition-colors text-left">
                                    in progress
                                </button>
                                <button onClick={() => { updaBugStatus("completed"); setShowDropDown(false) }} className="px-2 py-1 mx-1 rounded-lg text-[10px] text-green-500 cursor-pointer bg-green-100 hover:bg-green-200 transition-colors text-left">
                                    completed
                                </button>
                            </div>
                        )}
                    </div>
                )}


                 {role === "sqa" && (
                <div className="">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShow(!show)
                        }}
                        className="text-gray-300 hover:bg-gray-100 p-1 rounded-full transition-colors"
                    >
                        <MoreVertical size={14} className="cursor-pointer mr-2" />
                    </button>
                    {show && (
                        <div className="absolute right-0 mt-1 w-32 bg-white shadow-xl rounded-lg z-20 py-2 border border-gray-50">
                            <button onClick={(e) => {
                                e.stopPropagation();
                                setIsModalOpen(true);
                                handleEdit();
                                setShow(false)
                            }} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors">
                                <Edit2 size={12} /> Edit
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); deleteBug() }} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors">
                                <Trash2 size={12} /> Delete
                            </button>
                        </div>
                    )}
                </div>
            )}
            </div>
        </div>
    )
}