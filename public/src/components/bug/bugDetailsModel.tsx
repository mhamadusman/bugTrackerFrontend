"use client"
import { X, ChevronDown, User as UserIcon } from 'lucide-react';
import { BugType, ProjectType, User } from '../types/types';
import { useEffect, useState } from 'react';
import { UserService } from '../../apiConfig/userService';
import { baseUrl } from '../../apiConfig/api';
import toast from 'react-hot-toast';
import { LoadingIndicator } from '../loadingIndicator/loadingIndicator';

interface BugDetailsProps {
    bug?: BugType;
    onClose: () => void;
    role: string;
    project?: ProjectType | null;
}

export default function BugDetailsModel({ bug, onClose, role, project }: BugDetailsProps) {
    const [developers, setDevelopers] = useState<User[]>([]);
    const [sqas, setSqas] = useState<User[]>([]);
    const [showDevDropdown, setShowDevDropdown] = useState(false);
    const [showSqaDropdown, setShowSqaDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const assignedDev = developers.find(d => String(d.id) === String(bug?.developerId));
    const createdBySqa = sqas.find(s => String(s.id) === String(bug?.sqaId));

    const fetchProjectTeam = async (id: string) => {
        setIsLoading(true);
        try {
            const team: User[] = await UserService.getDevelopers(id);
            setDevelopers(team.filter((u) => u.userType === "developer"));
            setSqas(team.filter((u) => u.userType === "sqa"));
        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || "Failed to fetch team members";
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (project?.projectId) {
            fetchProjectTeam(String(project.projectId));
        } else if (bug?.projectId) {
            fetchProjectTeam(String(bug.projectId));
        }
    }, [bug?.projectId, project?.projectId]);

    if (isLoading) return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/10 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-2xl h-[400px] rounded-sm shadow-lg flex flex-col items-center justify-center gap-3">
                <LoadingIndicator />

            </div>
        </div>
    );

    if (project?.projectId) {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/10 backdrop-blur-sm p-2 sm:p-4 font-poppins">
                <div className="bg-white w-full max-w-2xl rounded-sm shadow-lg overflow-y-auto max-h-[95vh] flex flex-col">
                    <div className="bg-gray-50 px-4 sm:px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3 sm:gap-6">
                            <button className="px-2 sm:px-3 lg:py-3 py-1 font-poppins rounded-sm text-[10px] font-bold uppercase bg-gray-100  text-gray-500">
                                Project Details
                            </button>
                            <div className="flex items-center gap-3 sm:gap-4 border-l border-gray-200 pl-3 sm:pl-4">
                                {(role === 'manager' || role === 'developer') && (
                                    <div className="relative">
                                        <p className="text-[9px] text-gray-400 uppercase font-bold">QA Team</p>
                                        <div onClick={() => setShowSqaDropdown(!showSqaDropdown)} className="flex items-center gap-1 cursor-pointer group">
                                            <p className="text-[10px] sm:text-[11px] text-gray-700 font-medium group-hover:text-blue-600">{sqas.length} SQAs</p>
                                            <ChevronDown size={12} className="text-gray-400" />
                                        </div>
                                        {showSqaDropdown && (
                                            <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-xl z-50 py-2 rounded-sm border-t border-gray-100">
                                                {sqas.length > 0 ? sqas.map(s => (
                                                    <div key={s.id} className="px-3 py-2 flex items-center gap-2 hover:bg-gray-50 text-[11px]">
                                                        <UserIcon size={10} className="text-blue-500" /> {s.name}
                                                    </div>
                                                )) : <div className="px-3 py-2 text-[10px] text-gray-400">No SQAs assigned</div>}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {(role === 'manager' || role === 'sqa') && (
                                    <div className="relative">
                                        <p className="text-[9px] text-gray-400 uppercase font-bold">Dev Team</p>
                                        <div onClick={() => setShowDevDropdown(!showDevDropdown)} className="flex items-center gap-1 cursor-pointer group">
                                            <p className="text-[10px] sm:text-[11px] text-gray-700 font-medium group-hover:text-blue-600">{developers.length} Devs</p>
                                            <ChevronDown size={12} className="text-gray-400" />
                                        </div>
                                        {showDevDropdown && (
                                            <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-xl z-50 py-2 rounded-sm border-t border-gray-100">
                                                {developers.length > 0 ? developers.map(d => (
                                                    <div key={d.id} className="px-3 py-2 flex items-center gap-2 hover:bg-gray-50 text-[11px]">
                                                        <UserIcon size={10} className="text-blue-500" /> {d.name}
                                                    </div>
                                                )) : <div className="px-3 py-2 text-[10px] text-gray-400">No Devs assigned</div>}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-4 ml-auto">
                            <div className="text-right">
                                <p className="text-[9px] text-gray-400 uppercase font-bold">Created Date</p>
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
                                    <img src={`${baseUrl}${project.image}`} alt="project" className="w-full h-full object-contain" />
                                </div>
                            ) : <div className="w-full h-24 border border-dashed border-gray-200 rounded-sm flex items-center justify-center text-gray-400 italic text-[11px]">No image provided</div>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- return bug details---
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/10 backdrop-blur-sm p-2 sm:p-4 font-poppins">
            <div className="bg-white w-full max-w-2xl rounded-sm shadow-lg overflow-y-auto max-h-[95vh] flex flex-col">
                <div className="bg-gray-50 px-4 sm:px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-6">
                        <button className="px-2 sm:px-3 py-1 rounded-sm text-[10px] font-bold uppercase bg-blue-100 text-blue-700">
                            {bug?.status || "Bug"}
                        </button>
                        <div className="flex items-center gap-3 sm:gap-4 border-l border-gray-200 pl-3 sm:pl-4">
                            {/* for manger and dev*/}
                            {(role === 'manager' || role === 'developer') && (
                                <div className="relative">
                                    <p className="text-[9px] text-gray-400 uppercase font-bold">Created By</p>
                                    <p className="text-[10px] sm:text-[11px] text-gray-700 font-medium">
                                        {createdBySqa ? createdBySqa.name : "unassigned"}
                                    </p>
                                </div>
                            )}

                            {/* for sqa */}
                            {(role === 'manager' || role === 'sqa') && (
                                <div className="relative">
                                    <p className="text-[9px] text-gray-400 uppercase font-bold">Assigned To</p>
                                    <p className="text-[10px] sm:text-[11px] text-gray-700 font-medium">
                                        {assignedDev ? assignedDev.name : "unassigned"}
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
                                    {bug?.createdAt && bug.createdAt !== "null" ? new Date(bug.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A"}
                                </p>
                            </div>
                            <div className="h-8 w-[1px] bg-gray-200"></div>
                            <div className="text-right">
                                <p className="text-[9px] text-gray-400 uppercase font-bold">Deadline</p>
                                <p className="text-[10px] sm:text-[11px] text-red-500 font-medium whitespace-nowrap">
                                    {bug?.deadline && bug.deadline !== "null" ? new Date(bug.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A"}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-1.5 bg-black text-white rounded-sm shrink-0"><X size={14} /></button>
                    </div>
                </div>
                <div className="p-4 sm:p-6 space-y-6">
                    <h1 className="text-base sm:text-lg font-semibold text-gray-900">{bug?.title}</h1>
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Bug Description</p>
                        <div className="text-sm text-gray-600 leading-relaxed">{bug?.description || "No description."}</div>
                    </div>
                    <div className="pt-4 mt-auto">
                        <p className="text-[10px] text-gray-400 uppercase font-bold mb-2">Screenshot</p>
                        {bug?.screenshot && bug?.screenshot !== "null" ? (
                            <div className="w-full h-40 sm:h-48 bg-gray-50 border border-gray-100 rounded-sm overflow-hidden">
                                <img src={`${baseUrl}${bug.screenshot}`} alt="bug" className="w-full h-full object-contain" />
                            </div>
                        ) : <div className="w-full h-24 border border-dashed border-gray-200 rounded-sm flex items-center justify-center text-gray-400 italic text-[11px]">No screenshot provided</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}