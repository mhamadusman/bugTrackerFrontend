"use client"
import { MoreVertical, Calendar, Edit2, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { IBugDTO, IBugWithDeveloper } from "../types/types";
import { BugService } from "../../apiConfig/bugService";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
interface bugProps {
    item: IBugWithDeveloper,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    handleBugData: (bugData: IBugDTO) => void
    setEdit: React.Dispatch<React.SetStateAction<boolean>>
    role: string | null
    handleViewDetails: (bug: IBugWithDeveloper) => void
    setAllBugs: React.Dispatch<React.SetStateAction<IBugWithDeveloper[]>>;
}
export default function BugCard({ item, setIsModalOpen, handleBugData, setEdit, role, handleViewDetails, setAllBugs }: bugProps) {
  
    const router = useRouter()
    const [show, setShow] = useState<boolean>(false)
    const [showDropDown, setShowDropDown] = useState<boolean>(false)
    const updaBugStatus = async (bugStatus: string) => {
        try {
            await BugService.updateBugStatus(bugStatus, String(item.bug.bugId));
            setAllBugs((prevBugs) =>
                prevBugs.map((bugItem) =>
                    bugItem.bug.bugId === item.bug.bugId
                        ? {
                            ...bugItem,
                            bug: { ...bugItem.bug, status: bugStatus }
                        }
                        : bugItem
                )
            );
            toast.success(`${item.bug.type} status is updated`);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    };
    const handleReview = async (isCloseValue: boolean) => {
        try {
            const formData = new FormData();
            const newStatus = (item.bug.status === 'completed' && isCloseValue) ? 'completed' : 'in progress';
            const bugType = item.bug.type === 'feature' ? 'Feature' : 'Bug';
            formData.append("isClose", String(isCloseValue));
            formData.append("status", newStatus);
            await BugService.updateBug(formData, String(item.bug.bugId));
            setAllBugs((prevBugs) =>
                prevBugs.map((bugItem) =>
                    bugItem.bug.bugId === item.bug.bugId
                        ? {
                            ...bugItem,
                            bug: {
                                ...bugItem.bug,
                                isClose: isCloseValue,
                                status: newStatus
                            }
                        }
                        : bugItem
                )
            );
            if (isCloseValue) {
                toast.success(`${bugType} Accepted & Closed`);
            } else if (item.bug.isClose) {
                toast.success(`${bugType} Reopened`);
            } else {
                toast.success(`${bugType} Rejected`);
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to update review status");
        }
    };
    const getStatusStyles = (status: string) => {
        switch (status) {
            case "pending": return "text-red-500 bg-red-100 py-1 px-2";
            case "in progress": return "text-blue-500 bg-blue-100 py-1 px-2";
            case "completed": return "text-green-500 bg-green-100 py-1 px-2";
            default: return "text-gray-500 bg-gray-100 py-1 px-2";
        }
    }
    const deleteBug = async () => {
        try {
            const response = await BugService.deleteBug(item.bug.bugId)
            setAllBugs((prev) => prev.filter((p) => p.bug.bugId !== item.bug.bugId))
            toast.success(response.data.message)
        } catch (error: any) {
            toast.error(error?.response?.data?.message)
        }
    }
    const handleEdit = async () => {
        setEdit((pre) => !pre);
        handleBugData(item.bug)
    }
    const imgUrl = item.developer.image ? `${item.developer.image}` : '/images/Profile.png'
    return (
        <div className="bg-gray-100 py-3 border border-gray-100 px-6 mt-1 rounded-md shadow-sm relative cursor-pointer hover:bg-white hover:shadow-md transition-all">
            {role === "developer" && !item.bug.isClose && (
                <div className="absolute top-1 right-4">
                    <button
                        onClick={() => setShowDropDown(!showDropDown)}
                        className="text-gray-300 top-3 cursor-pointer transition-colors"
                    >
                        <MoreVertical size={20} />
                    </button>
                    {showDropDown && (
                        <>
                            <div
                                className="fixed inset-0 z-10 cursor-default"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDropDown(false);
                                }}
                            />
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
                        </>
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
                        <>
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
                                    handleEdit();
                                    setShow(false)
                                }} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors">
                                    <Edit2 size={12} /> Edit
                                </button>
                                {item.bug.status === "completed" && !item.bug.isClose && (
                                    <button onClick={(e) => { e.stopPropagation(); handleReview(true); setShow(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-green-600 hover:bg-green-50 transition-colors">
                                        <CheckCircle size={12} /> Accept
                                    </button>
                                )}
                                {item.bug.status === "completed" && !item.bug.isClose && (
                                    <button onClick={(e) => { e.stopPropagation(); handleReview(false); setShow(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-orange-600 hover:bg-orange-50 transition-colors">
                                        <XCircle size={12} /> Reject
                                    </button>
                                )}
                                {item.bug.status === "completed" && item.bug.isClose && (
                                    <button onClick={(e) => { e.stopPropagation(); handleReview(false); setShow(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-green-600 hover:bg-green-50 transition-colors">
                                        <CheckCircle size={12} /> Reopen
                                    </button>
                                )}
                                <button onClick={(e) => { e.stopPropagation(); deleteBug() }} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors">
                                    <Trash2 size={12} /> Delete
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
            <h3 className="font-poppins font-semibold text-gray-800 mb-0 text-sm">{item.bug.title}</h3>
            <span className={`font-inter text-[10px] inline-block rounded-lg mb-1 leading-relaxed ${getStatusStyles(item.bug.status)}`}>
                {item.bug.isClose ? "Closed" : item.bug.status}
            </span>
            <hr className="border-gray-200 mb-2" />
            <div className="flex justify-between items-center">
                <p className="text-[12px] text-gray-500">Due Date</p>
                <div className="flex items-center gap-2 px-3 py-1 rounded-md text-gray-500">
                    <Calendar size={14} className="text-gray-900" />
                    <span className="text-[11px] font-medium text-gray-900">{new Date(item.bug.deadline).toLocaleDateString()}</span>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <p className="text-[12px] text-gray-500">Assigned to</p>
                <div className="flex items-center relative">
                    <div className="flex items-center space-x-1 overflow-hidden lg:mr-1">
                        <Image src={imgUrl} width={20}  height={20} unoptimized={true} alt="" className="inline-block size-6 w-5 h-5 rounded-full  bg-black outline -outline-offset-1 " />
                        <p className="capitalize text-gray-800 font-inter text-xs mr-3">{item.developer.name}</p>
                    </div>
                </div>
            </div>
            <hr className="border-gray-200 mt-2" />
            <div className="flex items-center justify-center mt-2">
                <button className="text-gray-800 bg-gray-200 w-full rounded-md py-1 font-medium text-sm cursor-pointer hover:bg-gray-100" onClick={() => handleViewDetails(item)}>
                    View Details
                </button>
            </div>
        </div>
    )
}
