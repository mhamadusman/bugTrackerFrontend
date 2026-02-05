"use client"
import { MoreVertical, Calendar, Edit2, Trash2 } from "lucide-react";
import {useState } from "react";
import { BugType } from "../types/types";
import { BugService } from "../../apiConfig/bugService";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface bugProps {
    bug: BugType,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    handleBugData: (bugData: BugType) => void
    setEdit: React.Dispatch<React.SetStateAction<boolean>>
    role: string | null
    handleViewDetails: (bug: BugType) => void
}

export default function BugCard({ bug, setIsModalOpen, handleBugData, setEdit, role , handleViewDetails }: bugProps) {

    const router = useRouter()
    const [show, setShow] = useState<boolean>(false)
    const [showDropDown, setShowDropDown] = useState<boolean>(false)
    const [developer , setDeveloper] = useState(null)
    const updaBugStatus = async (bugStatus: string) => {
        console.log(bugStatus, bug.bugId)
        try {

            await BugService.updateBugStatus(bugStatus, String(bug.bugId))
            router.refresh()
            toast.success("Bug status updated")

        } catch (error: any) {
            toast.error(`${error?.response?.data?.message}`)
        }
    }

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "pending":
                return "text-red-500 bg-red-100 py-1 px-2";
            case "in progress":
                return "text-blue-500 bg-blue-100 py-1 px-2";
            case "completed":
                return "text-green-500 bg-green-100 py-1 px-2";
            default:
                return "text-gray-500 bg-gray-100 py-1 px-2";
        }
    }
    const deleteBug = async () => {
        try {

            await BugService.deleteBug(bug.bugId)
            router.refresh()
            toast.success("Bug deleted")
        } catch (error: any) {
            toast.error(error?.response?.data?.message)
        }
    }
    const handleEdit = async () => {
        setEdit((pre) => !pre);
        handleBugData(bug)

    }
   return (
    <div className="bg-gray-100 py-3 border border-gray-100 px-6 mt-1 rounded-md shadow-sm relative  cursor-pointer  hover:bg-white hover:shadow-md transition-all">

        {role === "developer" && (
            <div className="absolute top-1 right-4">
                <button
                    onClick={() => setShowDropDown(!showDropDown)}
                    className="text-gray-300 top-3 cursor-pointer transition-colors"
                >
                    <MoreVertical size={20} />
                </button>
                {showDropDown && (
                    <div className="absolute right-0 mt-2 w-32 bg-white shadow-xl rounded-lg z-20 py-2 border border-gray-50 flex flex-col gap-1">
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
            <div className="absolute top-3 right-4">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShow(!show)
                    }}
                    className="text-gray-300 hover:text-gray-600 cursor-pointer transition-colors"
                >
                    <MoreVertical size={20} />
                </button>
                {show && (
                    <div className="absolute right-0 mt-2 w-32 bg-white shadow-xl rounded-lg z-20 py-2 border border-gray-50">
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

        <h3 className="font-poppins font-semibold text-gray-800 mb-0 text-sm">{bug.title}</h3>

        <span className={`font-inter text-[10px] inline-block rounded-lg mb-1 leading-relaxed ${getStatusStyles(bug.status)}`}>
            {bug.status}
        </span>

        <hr className="border-gray-200 mb-2" />

        <div className="flex justify-between items-center">
            <p className="text-[12px] text-gray-500">Due Date</p>
            <div className="flex items-center gap-2 px-3 py-1 rounded-md text-gray-500">
                <Calendar size={14} className="text-gray-900" />
                <span className="text-[11px] font-medium text-gray-900">{new Date(bug.deadline).toLocaleDateString()}</span>
            </div>
        </div>

        <div className="flex justify-between items-center">
            <p className="text-[12px] text-gray-500">Assigned to</p>
            <div className="flex items-center relative">
                <div className="flex -space-x-1 overflow-hidden lg:mr-16">
                    <img src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" className="inline-block size-6 rounded-full ring-1 ring-white outline -outline-offset-1 outline-white" />
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" className="inline-block size-6 rounded-full ring-1 ring-white outline -outline-offset-1 outline-white" />
                </div>
                <p className="text-[10px] text-gray-900 absolute top-1 left-12">Assigned to</p>
            </div>
        </div>

        <hr className="border-gray-200 mt-2" />

        <div className="flex items-center justify-center mt-2">
            <button className="text-gray-800 bg-gray-200 w-full rounded-md py-1 font-medium text-sm cursor-pointer hover:bg-gray-100" onClick={() => handleViewDetails(bug)}>
                View Details
            </button>
        </div>
    </div>
)
}