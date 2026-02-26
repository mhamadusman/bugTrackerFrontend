"use client"
import { X, ChevronDown, User as UserIcon } from 'lucide-react';
import { IBugWithDeveloper, ProjectType } from '../types/types';
import Image from 'next/image';
import { useState } from 'react';


interface BugDetailsProps {
    item?: IBugWithDeveloper;
    onClose: () => void;
    role: string;
    project?: ProjectType | null;
}

export default function BugDetailsModel({ item, onClose, role, project }: BugDetailsProps) {
    const [showDevDropdown, setShowDevDropdown] = useState(false);
    const [showSqaDropdown, setShowSqaDropdown] = useState(false);
    const getStatusStyles = (status: string) => {
        switch (status) {
            case "pending": return "text-red-500 bg-red-100 py-1 px-2";
            case "in progress": return "text-blue-500 bg-blue-100 py-1 px-2";
            case "completed": return "text-green-500 bg-green-100 py-1 px-2";
            default: return "text-gray-500 bg-gray-100 py-1 px-2";
        }
    }
    if (project?.projectId) {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/10 backdrop-blur-sm p-2 sm:p-4 font-poppins">
                <div
                    className="fixed inset-0 bg-black/10 backdrop-blur-sm z-[-1]"
                    onClick={onClose}
                />
                <div className="bg-white w-full max-w-2xl rounded-sm shadow-lg overflow-y-auto max-h-[95vh] flex flex-col">
                    <div className="bg-gray-50 px-4 sm:px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3 sm:gap-6">
                            <button className="px-2 sm:px-3 lg:py-3 py-1 font-poppins rounded-sm text-[10px] font-bold uppercase bg-gray-100  text-blue-700">
                                Project Details
                            </button>
                            <div className="flex items-center gap-3 sm:gap-4 border-l border-gray-200 pl-3 sm:pl-4">
                                {(role === 'manager' || role === 'developer') && (
                                    <div className="relative">
                                        <p className="text-[9px] text-gray-400 uppercase font-bold">QA Team</p>
                                        <div onClick={() => { setShowSqaDropdown(!showSqaDropdown); setShowDevDropdown(false) }} className="flex items-center gap-1 cursor-pointer group">
                                            <p className="text-[10px] sm:text-[11px] text-gray-700 font-medium group-hover:text-blue-600">{project.qaTeam.length} SQAs</p>
                                            <ChevronDown size={12} className="text-gray-400" />
                                        </div>
                                        {showSqaDropdown && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-10 cursor-default"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShowSqaDropdown(false);
                                                    }}
                                                />

                                                <div className="absolute top-full -right-8 mt-2 w-24 bg-white shadow-xl z-50 py-2 rounded-sm border-t border-gray-100">
                                                    {project.qaTeam.length > 0 ? project.qaTeam.map(s => (
                                                        <div key={s.id} className="px-3 py-2 flex items-center gap-2 hover:bg-gray-50 text-[11px]">
                                                            {s.image ? (
                                                                <>
                                                                    <Image
                                                                        unoptimized={true}
                                                                        src={`/api${s.image}`}
                                                                        alt='qaImage'
                                                                        width={100}
                                                                        height={100}
                                                                        className="inline-block size-6 w-5 h-5 rounded-full "
                                                                    />
                                                                    {s.name}
                                                                </>

                                                            ) : (
                                                                <>
                                                                    <Image
                                                                        unoptimized={true}
                                                                        width={100}
                                                                        height={100}
                                                                        src='/images/Profile.png'
                                                                        alt='qaImage'
                                                                        className="inline-block size-6 w-5 h-5 rounded-full "
                                                                    />
                                                                    {s.name}
                                                                </>
                                                            )}


                                                        </div>
                                                    )) : <div className="px-3 py-2 text-[10px] text-gray-400">No SQAs assigned</div>}
                                                </div>

                                            </>

                                        )}
                                    </div>
                                )}

                                {(role === 'manager' || role === 'sqa') && (
                                    <div className="relative">
                                        <p className="text-[9px] text-gray-400 uppercase font-bold">Dev Team</p>
                                        <div onClick={() => { setShowDevDropdown(!showDevDropdown); setShowSqaDropdown(false) }} className="flex items-center gap-1 cursor-pointer group">
                                            <p className="text-[10px] sm:text-[11px] text-gray-700 font-medium group-hover:text-blue-600">{project.devTeam.length} Devs</p>
                                            <ChevronDown size={12} className="text-gray-400" />
                                        </div>
                                        {showDevDropdown && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-10 cursor-default"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShowDevDropdown(false);
                                                    }}
                                                />

                                                <div className="absolute top-full -right-8 mt-2 w-24 bg-white shadow-xl z-50 py-2 rounded-sm border-t border-gray-100">
                                                    {project.devTeam.length > 0 ? project.devTeam.map(d => (
                                                        <div key={d.id} className="px-3 py-2 flex items-center gap-2 hover:bg-gray-50 text-[11px]">
                                                            {d.image ? (
                                                                <>
                                                                    <Image
                                                                        unoptimized={true}
                                                                        width={100}
                                                                        height={100}
                                                                        src={`/api${d.image}`}
                                                                        alt='devImage'
                                                                        className="inline-block size-6 w-5 h-5 rounded-full "
                                                                    />
                                                                    {d.name}

                                                                </>

                                                            ) : (
                                                                <>
                                                                    <Image
                                                                        unoptimized={true}
                                                                        width={100}
                                                                        height={100}
                                                                        src='/images/Profile.png'
                                                                        alt='devImage'
                                                                        className="inline-block size-6 w-5 h-5 rounded-full "
                                                                    />
                                                                    {d.name}
                                                                </>
                                                            )}
                                                        </div>
                                                    )) : <div className="px-3 py-2 text-[10px] text-gray-400">No Devs assigned</div>}
                                                </div>

                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-4 ml-auto">
                            <div className="text-right">
                                <p className="text-[9px] text-gray-400 uppercase font-bold">Created</p>
                                <p className="text-[10px] sm:text-[11px] text-gray-700 font-medium">
                                    {project.createdAt && project.createdAt !== null ? new Date(project.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A"}
                                </p>
                            </div>
                            <button onClick={onClose} className="p-1.5 bg-black text-white rounded-sm shrink-0"><X size={14} /></button>
                        </div>
                    </div>
                    {/* ... prooject deteals ... */}
                    <div className="p-4 sm:p-6 space-y-6">
                        <h1 className="text-base sm:text-lg font-semibold text-gray-900">{project.name}</h1>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Project Description</p>
                            <div className="text-sm text-gray-600 leading-relaxed">{project.description}</div>
                        </div>
                        <div className="pt-4 mt-auto">
                            <p className="text-[10px] text-gray-400 uppercase font-bold mb-2">Project Image</p>
                            {project.image && project.image !== "null" ? (
                                <div className="w-full h-40 sm:h-48 bg-gray-50 border border-gray-100 rounded-sm overflow-hidden">
                                    <img src={`/api${project.image}`} alt="project" className="w-full h-full object-contain" />
                                </div>
                            ) : <div className="w-full h-24 border border-dashed border-gray-200 rounded-sm flex items-center justify-center text-gray-400 italic text-[11px]">No image provided</div>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- return item?.bug details---
    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/10 backdrop-blur-sm p-2 sm:p-4 font-poppins"

        >
            <div
                className="fixed inset-0 bg-black/10 backdrop-blur-sm z-[-1]"
                onClick={onClose}
            />
            <div className="bg-white w-full max-w-2xl rounded-sm shadow-lg overflow-y-auto max-h-[95vh] flex flex-col">
                <div className="bg-gray-50 px-4 sm:px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-6">
                        <button className={`px-2 sm:px-3 py-1 rounded-sm text-[10px] font-bold uppercase bg-blue-100 text-blue-700 ${getStatusStyles(item?.bug?.status as string)}`}>
                            {item?.bug?.isClose ? "Closed" : item?.bug?.status}
                        </button>
                        <div className="flex items-center gap-3 sm:gap-4 border-l border-gray-200 pl-3 sm:pl-4">
                            {/* for manger and dev*/}
                            {(role === 'manager' || role === 'developer') && (
                                <div className="relative">
                                    <p className="text-[9px] text-gray-400 uppercase font-poppins font-bold">QA</p>
                                    <p className="text-[10px] sm:text-[11px] text-gray-700 font-inter font-medium">
                                        {item?.sqa.name}
                                    </p>
                                </div>
                            )}

                            {/* for sqa */}
                            {(role === 'manager' || role === 'sqa') && (
                                <div className="relative">
                                    <p className="text-[9px] text-gray-400 uppercase font-poppins  font-bold">Dev</p>
                                    <p className="text-[10px] sm:text-[11px] text-gray-700 font-inter font-medium">
                                        {item?.developer.name}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-4 ml-auto">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="text-right">
                                <p className="text-[9px] text-gray-400 uppercase font-bold">Created</p>
                                <p className="text-[10px] sm:text-[11px] text-gray-700 font-medium whitespace-nowrap">
                                    {item?.bug?.createdAt && item?.bug.createdAt !== "null" ? new Date(item?.bug.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A"}
                                </p>
                            </div>
                            <div className="h-8 w-px bg-gray-200"></div>
                            <div className="text-right">
                                <p className="text-[9px] text-gray-400 uppercase font-bold">Deadline</p>
                                <p className="text-[10px] sm:text-[11px] text-red-500 font-medium whitespace-nowrap">
                                    {item?.bug?.deadline && item?.bug.deadline !== "null" ? new Date(item?.bug.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A"}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-1.5 bg-black text-white rounded-sm shrink-0"><X size={14} /></button>
                    </div>
                </div>
                <div className="p-4 sm:p-6 space-y-6">
                    <h1 className="text-base sm:text-lg font-semibold text-gray-900">{item?.bug?.title}</h1>
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Bug Description</p>
                        <div className="text-sm text-gray-600 leading-relaxed">{item?.bug?.description || "No description."}</div>
                    </div>
                    <div className="pt-4 mt-auto">
                        <p className="text-[10px] text-gray-400 uppercase font-bold mb-2">Screenshoot</p>
                        {item?.bug?.screenshot && item?.bug?.screenshot !== "null" ? (
                            <div className="w-full h-40 sm:h-48 bg-gray-50 border border-gray-100 rounded-sm overflow-hidden">
                                <img src={`/api${item?.bug.screenshot}`} alt="item?.bug" className="w-full h-full object-contain" />
                            </div>
                        ) : <div className="w-full h-24 border border-dashed border-gray-200 rounded-sm flex items-center justify-center text-gray-400 italic text-[11px]">No screenshot provided</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}