"use client"
import { MoreVertical, Calendar, Trash2, Edit2, CheckCircle, XCircle } from "lucide-react";
import { useState, useRef } from "react";
import { IBugDTO, IBugWithDeveloper } from "../types/types";
import { BugService } from "../../apiConfig/bugService";
import { useRouter } from 'next/navigation'

import toast from "react-hot-toast";

interface bugProps {
    item: IBugWithDeveloper,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleBugData: (bugData: IBugDTO) => void
    setEdit: React.Dispatch<React.SetStateAction<boolean>>;
    handleViewDetails: (bug: IBugWithDeveloper) => void
    setAllBugs: React.Dispatch<React.SetStateAction<IBugWithDeveloper[]>>;
    role: string | null
}

export default function BugRow({ item, setIsModalOpen, handleBugData, setEdit, setAllBugs , role, handleViewDetails }: bugProps) {

    const router = useRouter()
    const [showDropDown, setShowDropDown] = useState<boolean>(false)
    const [show, setShow] = useState<boolean>(false)
    const [isUpward, setIsUpward] = useState(false);
    const buttonRef = useRef<HTMLDivElement>(null);
    const buttonRefSqa = useRef<HTMLDivElement>(null);

    const handleToggle = (
        e: React.MouseEvent<HTMLButtonElement>,
        ref: React.RefObject<HTMLDivElement | null>
    ): void => {
        e.stopPropagation();
        if (ref && ref.current) {
            const rect = ref.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            setIsUpward(spaceBelow < 180);
        }
    };

    const updaBugStatus = async (bugStatus: string) => {
        try {
            await BugService.updateBugStatus(bugStatus, String(item.bug.bugId))
            router.refresh()
            toast.success("Bug status updated")
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Error updating status")
        }
    }

    const handleReview = async (isCloseValue: boolean) => {
        try {
            const formData = new FormData();
            const newStatus = (item.bug.status === 'completed' && isCloseValue) ? 'completed' : 'in progress';
            formData.append("isClose", String(isCloseValue));
            formData.append("status", newStatus);
            await BugService.updateBug(formData, String(item.bug.bugId));
            if (isCloseValue) {
                toast.success("Bug Accepted & Closed");
            } else if (item.bug.isClose) {
                toast.success("Bug Reopened");
            } else {
                toast.success("Bug Rejected");
            }

            router.refresh();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to update review status");
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "pending":
                return "text-red-500 bg-red-100";
            case "in progress":
                return "text-blue-500 bg-blue-100";
            case "completed":
                return "text-green-500 bg-green-100";
            default:
                return "text-gray-500 bg-gray-100";
        }
    }

    const deleteBug = async () => {
        try {
            const response = await BugService.deleteBug(item.bug.bugId)
            setAllBugs((prev)=>prev.filter((p)=>p.bug.bugId !== item.bug.bugId))
            toast.success(response.data.message)
        } catch (error: any) {
            toast.error(error?.response?.data?.message)
        }
    }

    const handleEdit = async () => {
        setEdit((pre) => !pre);
        handleBugData(item.bug)
    }

    const imgUrl = item.developer.image ? `${item.developer.image}` : '/icons/user.png'

   return (
    <div onClick={() => handleViewDetails(item)} className="w-full bg-white border border-gray-100 flex justify-between items-center px-3 py-3 hover:bg-gray-50 transition-all cursor-pointer group relative">
        <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className={`shrink-0 w-2 h-2 rounded-full ${item.bug.status.toLowerCase() === 'pending' ? 'bg-red-500' : item.bug.status.toLowerCase() === 'in progress' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
            <p className="font-poppins text-[12px] text-gray-700 font-medium truncate max-w-[150px] sm:max-w-[400px]">
                {item.bug.title}
            </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-6 lg:gap-7 shrink-0">
            <div className="flex justify-center">
                <span className={`font-inter text-[9px] lg:w-18 w-16  text-center lg:mr-5 sm:text-[10px] p-1 px-2 rounded-xl truncate ${getStatusStyles(item.bug.status)}`}>
                    {item.bug.isClose ? "Closed" : item.bug.status}
                </span>
            </div>

            <div className="flex items-center gap-1 w-20 sm:w-28 justify-center">
                <Calendar size={12} className="text-blue-400 shrink-0" />
                <span className="text-[8px] font-medium text-gray-700">
                    {new Date(item.bug.deadline).toLocaleDateString()}
                </span>
            </div>

            <div className={`hidden xs:flex w-20 sm:w-24 ${role === "developer" ? "justify-center" : "justify-end mr-3"} `}>
                <img src={imgUrl} alt="" className="size-5 sm:size-6 rounded-full ring-2 ring-white" />
            </div>

            {(role === "developer" || role === "sqa") && (
                <div className="w-8 sm:w-10 flex justify-center">
                    {role === "developer" && !item.bug.isClose && (
                        <div className="relative" ref={buttonRef}>
                            <button
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    handleToggle(e, buttonRef); 
                                    setShowDropDown(!showDropDown); 
                                }}
                                className="text-gray-300 hover:bg-gray-100 p-1 cursor-pointer rounded-full transition-colors"
                            >
                                <MoreVertical size={18} />
                            </button>
                            {showDropDown && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setShowDropDown(false); }} />
                                    <div className={`absolute right-0 w-32 bg-white shadow-xl rounded-lg z-50 py-2 border border-gray-50 flex flex-col gap-1 ${isUpward ? 'bottom-full mb-2' : 'mt-2'}`}>
                                        <button onClick={(e) => { e.stopPropagation(); updaBugStatus("pending"); setShowDropDown(false) }} className="px-2 py-1 mx-1 rounded-lg text-[10px] text-red-500 cursor-pointer bg-red-100 hover:bg-red-200 transition-colors text-left">pending</button>
                                        <button onClick={(e) => { e.stopPropagation(); updaBugStatus("in progress"); setShowDropDown(false) }} className="px-2 py-1 mx-1 rounded-lg text-[10px] text-blue-500 cursor-pointer bg-blue-100 hover:bg-blue-200 transition-colors text-left">in progress</button>
                                        <button onClick={(e) => { e.stopPropagation(); updaBugStatus("completed"); setShowDropDown(false) }} className="px-2 py-1 mx-1 rounded-lg text-[10px] text-green-500 cursor-pointer bg-green-100 hover:bg-green-200 transition-colors text-left">completed</button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                    {role === "sqa" && (
                        <div className="relative" ref={buttonRefSqa}>
                            <button
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    handleToggle(e, buttonRefSqa); 
                                    setShow(!show); 
                                }}
                                className="text-gray-300 hover:bg-gray-100 p-1 rounded-full transition-colors"
                            >
                                <MoreVertical size={14} className="cursor-pointer" />
                            </button>
                            {show && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40 cursor-default"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShow(false);
                                        }}
                                    />

                                    <div className={`absolute right-0 w-32 bg-white shadow-xl rounded-lg z-50 py-2 border border-gray-50 ${isUpward ? 'bottom-full mb-2' : 'mt-1'}`}>
                                        <button onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); handleEdit(); setShow(false) }} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors">
                                            <Edit2 size={12} /> Edit
                                        </button>
                                        {item.bug.status === "completed" && !item.bug.isClose && (
                                            <>
                                                <button onClick={(e) => { e.stopPropagation(); handleReview(true); setShow(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-green-600 hover:bg-green-50 transition-colors">
                                                    <CheckCircle size={12} /> Accept
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); handleReview(false); setShow(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-orange-600 hover:bg-orange-50 transition-colors">
                                                    <XCircle size={12} /> Reject
                                                </button>
                                            </>
                                        )}
                                        {item.bug.status === "completed" && item.bug.isClose && (
                                            <button onClick={(e) => { e.stopPropagation(); handleReview(false); setShow(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-green-600 hover:bg-green-50 transition-colors">
                                                <CheckCircle size={12} /> Reopen
                                            </button>
                                        )}
                                        <button onClick={(e) => { e.stopPropagation(); setShow(false); deleteBug() }} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors">
                                            <Trash2 size={12} /> Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>
)
}