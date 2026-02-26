"use client"
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ImageIcon, Variable, X } from 'lucide-react';
import { projectToEdit, User, ProjectType } from '../types/types';
import { ProjectService } from "../../apiConfig/projectService";
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { LoadingIndicator } from "../loadingIndicator/loadingIndicator";
import { projectForm , imageType } from "../types/types";

interface AddProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    role: string;
    project: projectToEdit | null
    resetEdit: () => void
    users: User[]
    setAllProjects: React.Dispatch<React.SetStateAction<ProjectType[]>>;
}

const baseURL  = process.env.NEXT_BACKEND_URL
export default function Model({ isOpen, onClose, project, resetEdit, users, setAllProjects }: AddProjectModalProps) {
    const [devs, setDevs] = useState(false)
    const [model, setModel] = useState(false)
    const router = useRouter()
    const [user, setUser] = useState({
        name: '',
        image: '',
        role: ''
    })
    const [searchTerm, setSearchTerm] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { register, handleSubmit, setValue, watch, reset, setError, formState: { errors, isSubmitting } } = useForm<projectForm>({
        defaultValues: {
            name: "",
            description: "",
            sqaIds: [] as number[],
            developerIds: [] as number[],
            image: null as imageType,
            id: null as number | null
        }
    });
    const formValues = watch();
    useEffect(() => {
        if (project?.projectId) {
            reset({
                name: project.name || "",
                description: project.description || "",
                developerIds: project.devTeam?.map(d => Number(d.id)) || [],
                sqaIds: project.qaTeam?.map(q => Number(q.id)) || [],
                image: project.image || "",
                id: project.projectId
            });
        } else {
            reset({ name: '', description: '', developerIds: [], sqaIds: [], image: '', id: 0 });
        }
    }, [project, reset]);
    useEffect(() => {
        const user = localStorage.getItem('user_profile')
        if (user) {
            setUser(JSON.parse(user))
        }
    }, [])
    if (!isOpen) {
        return null;
    }
    const handleState = () => {
        reset({ name: '', description: '', image: null, developerIds: [], sqaIds: [], id: null });
        resetEdit();
        onClose();
    }
    const handleSqa = (id: number) => {
        const currentIds = formValues.sqaIds;
        let newIds;
        if (currentIds.includes(id)) {
            newIds = currentIds.filter(item => item !== id);
        } else {
            newIds = [...currentIds, id];
        }
        setValue("sqaIds", newIds, { shouldValidate: true });
    };
    const handleDeveloper = (id: number) => {
        const currentIds = formValues.developerIds;
        let newIds;
        if (currentIds.includes(id)) {
            newIds = currentIds.filter(item => item !== id);
        } else {
            newIds = [...currentIds, id];
        }
        setValue("developerIds", newIds, { shouldValidate: true });
    };
    const onFormSubmit = async (data: any) => {
        try {
            const formDataPayload = new FormData();
            formDataPayload.append("name", data.name);
            formDataPayload.append("description", data.description);
            formDataPayload.append("developerIds", data.developerIds.join(','));
            formDataPayload.append("sqaIds", data.sqaIds.join(','));
            formDataPayload.append("managerName", 'ali');

            if (data.image) {
                formDataPayload.append("image", data.image);
            }

            if (data.id) {

                const response = await ProjectService.updateProject(formDataPayload, data.id);
                toast.success(response.message)
            } else {

                const response = await ProjectService.createProject(formDataPayload);
                toast.success(response.message);
            }
            router.refresh();
            handleState();
            reset();

        } catch (error: any) {

            const backendErrors = error?.response?.data?.errors;
            const genericMessage = error?.response?.data?.message || "Something went wrong";
            if (Array.isArray(backendErrors)) {
                backendErrors.forEach((err: { field: string; message: string }) => {

                    setError(err.field as keyof projectForm ,  {
                        type: "server",
                        message: err.message
                    });

                });
            } else {
                toast.error(genericMessage);
            }
        }
    };
    const getDisplayNames = (type: "sqa" | "developer") => {
        const ids = type === "sqa" ? formValues.sqaIds : formValues.developerIds;
        const filteredUsers = users.filter((u) => {
            return u.userType === type && ids.includes(Number(u.id));
        });
        const names = filteredUsers.map(u => u.name).join(", ");
        if (names) {
            return names;
        } else {
            return type === "sqa" ? "Assign SQA" : "Assign Developers";
        }
    }
    return (
        <>
            <div className={`fixed inset-0 z-50 px-2 lg:px-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px] ${model ? "blur-sm" : ''
                }`}
            >
                <div className="bg-white w-full max-w-2xl rounded-sm shadow-lg p-6">
                    <h2 className="text-lg font-light text-gray-800 mb-6">{project?.projectId ? "Edit project" : "Add new project"}</h2>
                    {/* project form */}
                    <form onSubmit={handleSubmit(onFormSubmit)} className="flex gap-8">
                        <div className="flex-1 flex flex-col gap-4">
                            {/* project Name */}
                            <div>
                                <label className={`block text-[11px] font-light mb-1 ${errors.name ? 'text-red-500' : 'text-gray-500'}`}>
                                    {errors.name ? errors.name.message : "Project name"}
                                </label>
                                <input
                                    {...register("name", { required: "Project name is required" })}
                                    type="text"
                                    autoFocus
                                    className={`w-full border rounded-sm p-2 text-xs font-light outline-none ${errors.name ? 'border-red-500' : 'border-gray-100 focus:border-blue-500'}`}
                                />
                            </div>
                            {/* short details */}
                            <div>
                                <label className={`block text-[11px] font-light mb-1 ${errors.description ? 'text-red-500' : 'text-gray-500'}`}>
                                    {errors.description ? errors.description.message : "Short details"}
                                </label>
                                <textarea
                                    {...register("description", { required: "Description is required" })}
                                    rows={1}
                                    className={`w-full border rounded-sm p-2 text-xs font-light outline-none resize-none ${errors.description ? 'border-red-500' : 'border-gray-100 focus:border-blue-500'}`}
                                />
                            </div>
                            <div className="relative">
                                <label className={`block text-[11px] font-light mb-1 ${errors.sqaIds ? 'text-red-500' : 'text-gray-500'}`}>
                                    {errors.sqaIds ? "Please assign at least one SQA" : "Assign SQA"}
                                </label>
                                <div
                                    tabIndex={0}
                                    onClick={() => { setModel(true); setDevs(false); }}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { setModel(true); setDevs(false); } }}
                                    className={`w-full border rounded-sm p-2 text-xs font-light cursor-pointer min-h-[34px] transition-colors outline-none ${errors.sqaIds ? 'border-red-500 text-red-500' : 'border-gray-100 focus:border-blue-500 text-gray-400'}`}
                                >
                                    {getDisplayNames("sqa")}
                                </div>
                                <input type="hidden" {...register("sqaIds", { validate: val => val.length > 0 })} />
                            </div>
                            <div className="relative">
                                <label className={`block text-[11px] font-light mb-1 ${errors.developerIds ? 'text-red-500' : 'text-gray-500'}`}>
                                    {errors.developerIds ? "Please assign at least one Developer" : "Assign Developers"}
                                </label>
                                <div
                                    tabIndex={0}
                                    onClick={() => { setModel(true); setDevs(true); }}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { setModel(true); setDevs(true); } }}
                                    className={`w-full border rounded-sm p-2 text-xs font-light cursor-pointer min-h-[34px] transition-colors outline-none ${errors.developerIds ? 'border-red-500 text-red-500' : 'border-gray-100 focus:border-blue-500 text-gray-400'}`}
                                >
                                    {getDisplayNames("developer")}
                                </div>
                                <input type="hidden" {...register("developerIds", { validate: val => val.length > 0 })} />
                            </div>
                            <div className="flex gap-3 mt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`bg-blue-600 w-1/2 text-white px-8 py-2 rounded-sm text-sm font-light flex items-center justify-center gap-2 
        ${isSubmitting ? "cursor-not-allowed opacity-80" : "cursor-pointer"}`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <LoadingIndicator />
                                            <span>{project?.projectId ? "Updating..." : "Adding..."}</span>
                                        </>
                                    ) : (
                                        project?.projectId ? "Update" : "Add"
                                    )}
                                </button>
                                <button type="button" onClick={handleState} className="border w-1/2 cursor-pointer hover:border-blue-400 border-gray-200 text-gray-600 px-8 py-2 rounded-sm text-sm font-light">
                                    Cancel
                                </button>
                            </div>
                        </div>
                        {/* Image Logo */}
                        <div className="w-48 flex flex-col items-center pt-5">
                            <input type="file" className="hidden" ref={fileInputRef} onChange={(e) => { if (e.target.files?.[0]) { setValue("image", e.target.files[0]); } }} />
                            <div onClick={() => { fileInputRef.current?.click(); }} className="w-full aspect-square border-2 border-dashed border-gray-200 rounded-md flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                                {formValues.image ? (
                                    <img
                                        src={typeof formValues.image === 'string' ? `${baseURL}${formValues.image}` : URL.createObjectURL(formValues.image)}
                                        className="w-full p-3 h-full object-cover"
                                        alt="logo"
                                    />
                                ) : (
                                    <div className="text-center">
                                        <ImageIcon className="mx-auto text-gray-300 mb-2" size={32} />
                                        <span className="text-[11px] font-light text-gray-400">Upload logo</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {model && (
                <div
                    onClick={() => { setModel(false); setSearchTerm(""); }}
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/10 backdrop-blur-sm"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-[500px] h-[350px] bg-white flex flex-col rounded-md shadow-2xl overflow-hidden"
                    >
                        <div className="w-full h-14 bg-gray-100 px-4 flex items-center gap-3 border-b border-gray-200 shrink-0">
                            <input
                                type="text"
                                autoFocus
                                placeholder={devs ? "Search developers..." : "Search SQAs..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 px-4 py-2 text-sm bg-white border border-gray-200 rounded-md outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => { setModel(false); setSearchTerm(""); }}
                                className="bg-black text-white p-1.5 rounded-md cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="flex flex-wrap gap-3">
                                {users
                                    .filter((u) => devs ? u.userType === "developer" : u.userType === "sqa")
                                    .filter((u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map((user) => {
                                        const isSelected = devs
                                            ? formValues.developerIds.includes(Number(user.id))
                                            : formValues.sqaIds.includes(Number(user.id));
                                        return (
                                            <div
                                                key={user.id}
                                                onClick={() => devs ? handleDeveloper(Number(user.id)) : handleSqa(Number(user.id))}
                                                className={`px-5 h-8 cursor-pointer text-sm rounded-full flex items-center justify-center transition-all ${isSelected
                                                    ? "bg-blue-600 text-white shadow-md scale-105"
                                                    : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                                                    }`}
                                            >
                                                {user.name}
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}