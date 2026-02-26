"use client"
import { useState, useRef, useEffect } from "react";
import { X, Plus, CloudUpload, Calendar, ChevronDown, RotateCcw } from 'lucide-react';
import { IBugDTO, IBugWithDeveloper, User } from '../types/types';
import { BugService } from "../../apiConfig/bugService";
import toast from "react-hot-toast";
import { LoadingIndicator } from "../loadingIndicator/loadingIndicator";
import { useForm } from "react-hook-form";
import { bugForm } from "../types/types";
type img = string | null | File
interface bugModelProps {
    isOpen: boolean;
    onClose: () => void;
    role: string;
    projectId?: string
    bugToEdit: IBugDTO
    edit: boolean
    developers: User[]
    resetEdit: () => void;
    setAllBugs: React.Dispatch<React.SetStateAction<IBugWithDeveloper[]>>;
}

export default function BugModel({ isOpen, onClose, projectId, bugToEdit, edit, resetEdit, developers, setAllBugs }: bugModelProps) {
    const baseUrl  = process.env.NEXT_BACKEND_URL
    const [images, setImages] = useState<(string | undefined)[]>([])
    const [openDev, setOpenDev] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [openType, setOpenType] = useState(false);
    const { register, handleSubmit, setValue, watch, setError, reset, formState: { errors, isSubmitting } } = useForm<bugForm>({
        defaultValues: {
            title: "",
            description: "",
            type: "feature",
            developerId: "" as string | number,
            screenshot: null as img,
            deadline: "",
            isClose: false,
            status: ''
        }
    });
    const formValues = watch();
    const getImageValue = () => {
        if (!formValues.screenshot) return null
        if (typeof formValues.screenshot === "string" && formValues.screenshot !== "null") {
            return formValues.screenshot
        }
        if (formValues.screenshot instanceof File) return URL.createObjectURL(formValues.screenshot)
        return null
    }
    const getImageUrl = () => {
        const imgs = developers.filter((dev) => (dev?.image !== null && dev?.image !== "null")).map((dev) => (dev.image))
        setImages(imgs)
    }
    useEffect(() => {
        getImageUrl()
    }, [developers])
    useEffect(() => {
        if (isOpen) {
            reset({
                title: bugToEdit.title || "",
                description: bugToEdit.description || "",
                type: bugToEdit.type || "feature",
                developerId: bugToEdit.developerId || "",
                screenshot: bugToEdit.screenshot || null,
                deadline: bugToEdit.deadline || '',
                isClose: bugToEdit.isClose || false,
                status: bugToEdit.status || ''
            });
        }
    }, [bugToEdit, isOpen, reset])
    const handleState = () => {
        reset({ title: "", description: "", type: "feature", developerId: "", screenshot: null, deadline: "", isClose: false });
        resetEdit();
        onClose();
    }
    const onFormSubmit = async (formData: any) => {
        try {
            const updatedBug = new FormData()
            updatedBug.append("title", formData.title)
            updatedBug.append("description", formData.description)
            updatedBug.append("deadline", formData.deadline)
            updatedBug.append("type", formData.type)
            updatedBug.append("developerId", String(formData.developerId))
            updatedBug.append("projectId", String(projectId))
            updatedBug.append("isClose", String(formData.isClose))
            updatedBug.append("status", String(!formData.isClose && bugToEdit.status === 'completed' ? 'in progress' : bugToEdit.status))
            if (formData.screenshot instanceof File) {
                updatedBug.append("screenshot", formData.screenshot)
            }
            if (edit) {
                const response = await BugService.updateBug(updatedBug, String(bugToEdit.bugId))
                toast.success(response.message);
                setAllBugs((prev) =>
                    prev.map((item) => item.bug.bugId === response.bug.bugId ? response : item)
                );
            } else {
                const data = await BugService.createBug(updatedBug)
                setAllBugs((prev) => [data, ...prev])
                toast.success(formData.type === 'feature' ? "Feature added" : "Bug added")
            }
            handleState()
        } catch (error: any) {
            const backendErrors = error?.response?.data?.errors;
            const genericMessage = error?.response?.data?.message || "Something went wrong";
            if (Array.isArray(backendErrors)) {
                backendErrors.forEach((err: { field: string; message: string }) => {
                    setError(err.field as keyof bugForm, {
                        type: "server",
                        message: err.message
                    });
                });
            } else {
                toast.error(genericMessage);
            }

        }
    }
    if (!isOpen) return null;
    const imgValue = getImageValue()
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
            <div
                className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-[-1]"
                onClick={handleState}
            />
            <div className="bg-white w-full max-w-lg h-[550px] rounded-md shadow-lg flex flex-col overflow-hidden">
                <div className="w-full h-10 bg-gray-100 p-2 flex justify-end items-center">
                    <button type="button" onClick={handleState} className="bg-gray-900 p-1 rounded-sm cursor-pointer">
                        <X size={16} color="white" />
                    </button>
                </div>
                <form onSubmit={handleSubmit(onFormSubmit)} className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 flex flex-col">
                        <h2 className="text-lg font-medium text-gray-800 p-4 pb-2">{edit ? `Edit ${bugToEdit.type}` : "Add new task"} </h2>
                        <div className="w-full h-[1px] bg-gray-200"></div>
                        <div className="flex flex-col px-6 py-4">
                            <div className="flex items-center gap-4 relative">
                                <p className={`text-[10px] font-medium ${errors.developerId ? 'text-red-500' : 'text-gray-900'}`}>
                                    {errors.developerId ? errors.developerId.message : "Dev"}
                                </p>
                                <div className="flex items-center gap-2">
                                    <div onClick={() => { setOpenDev(!openDev) }} className="flex items-center cursor-pointer">
                                        <div className="flex -space-x-1">
                                            <div className="flex -space-x-2">
                                                <img src={images[0] ? `${baseUrl}${images[0]}` : '/icons/user.png'} alt="dev-1" className="size-6 rounded-full ring-2 ring-white object-cover bg-black" />
                                                <img src={images[1] ? `${baseUrl}${images[1]}` : '/icons/user.png'} alt="dev-2" className="size-6 rounded-full ring-2 ring-white object-contain bg-black/70" />
                                            </div>
                                            <div className="flex items-center justify-center w-6 h-6 rounded-full border border-dotted border-black bg-gray-50 relative cursor-pointer hover:bg-gray-100 transition-colors">
                                                <Plus size={12} className="text-white bg-gray-400 rounded-full absolute top-3 left-3" />
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-medium truncate max-w-[80px] capitalize font-poppins ${errors.developerId ? 'text-red-500' : 'text-gray-600'}`}>
                                        {developers.find(d => d.id === formValues.developerId)?.name || ""}
                                    </span>
                                    <input type="hidden" {...register("developerId", { required: "Select Dev" })} />
                                </div>
                                <div className="flex justify-center items-center gap-2">
                                    <p className={`text-[10px] font-medium relative font-inter ml-5 ${errors.deadline ? 'text-red-500' : 'text-gray-900'}`}>
                                        {errors.deadline ? errors.deadline.message : "Add due date"}
                                    </p>
                                    <div className={`cursor-pointer relative flex items-center justify-center w-6 h-6 rounded-full border border-dotted bg-gray-50 hover:bg-gray-100 transition-colors ${errors.deadline ? 'border-red-500' : 'border-gray-400'}`}>
                                        <Calendar size={12} className={`${errors.deadline ? 'text-red-500 text-xs' : 'text-gray-600'}`} />
                                        <input
                                            type="date"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            {...register("deadline", {
                                                required: "Deadline is required",
                                                validate: (value) => {
                                                    const selectedDate = new Date(value);
                                                    const today = new Date();
                                                    today.setHours(0, 0, 0, 0);
                                                    return selectedDate >= today || "Deadline can't be past";
                                                }
                                            })}
                                        />
                                    </div>
                                    <p className={`text-[10px] ${errors.deadline ? 'text-red-500' : 'text-gray-600'}`}>{formValues.deadline}</p>
                                </div>
                                {edit && !formValues.isClose && formValues.status === 'completed' && (
                                    <button
                                        type="button"
                                        onClick={() => setValue("isClose", false)}
                                        className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors ml-auto ${!formValues.isClose ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                    >
                                        <RotateCcw size={10} />
                                        Rejected
                                    </button>
                                )}
                                {openDev && (
                                    <div className="absolute z-20 top-8 left-16 w-30 bg-white border border-gray-200 shadow-xl rounded-md py-1 max-h-40 overflow-y-auto overflow-x-hidden font-poppins">
                                        {developers.map(user => (
                                            <div
                                                key={user.id}
                                                onClick={() => {
                                                    setValue("developerId", user.id, { shouldValidate: true });
                                                    setOpenDev(false);
                                                }}
                                                className={`px-3 py-2 text-[11px] cursor-pointer transition-colors flex items-center justify-between
                                    ${formValues.developerId === user.id ? 'bg-gray-100 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}
                                `}
                                            >
                                                <span className="truncate capitalize">{user.name}</span>
                                                {formValues.developerId === user.id && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="mt-7">
                                {errors.title && <p className="text-[10px] text-red-500 font-medium font-poppins">{errors.title.message}</p>}
                                <input
                                    type="text"
                                    placeholder={errors.title ? "" : "Add title here"}
                                    className={`w-full text-2xl font-poppins outline-none border-b pb-1 ${errors.title ? 'border-red-500' : 'border-transparent'}`}
                                    {...register("title", { required: "Title is required" })}
                                />
                            </div>
                            <div className="relative">
                                <label className="block mb-1 mt-5 text-[10px] text-gray-900 font-medium font-poppins">Task type</label>
                                <div
                                    onClick={() => setOpenType(!openType)}
                                    className="w-full border border-gray-200 rounded-md p-2 text-xs flex justify-between items-center cursor-pointer bg-gray-50 text-gray-700 font-poppins hover:bg-gray-100 transition-colors"
                                >
                                    <span className="capitalize">{formValues.type}</span>
                                    <ChevronDown size={14} className={`text-gray-500 transition-transform ${openType ? 'rotate-180' : ''}`} />
                                </div>
                                {openType && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden font-poppins">
                                        {["bug", "feature"].map((type) => (
                                            <div
                                                key={type}
                                                onClick={() => {
                                                    setValue("type", type as "bug" | "feature");
                                                    setOpenType(false);
                                                }}
                                                className={`px-3 py-2 text-xs cursor-pointer capitalize transition-colors
                                    ${formValues.type === type ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-50'}
                                `}
                                            >
                                                {type}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className={`block text-[10px] font-medium mt-3 mb-1 font-poppins ${errors.description ? 'text-red-500' : 'text-gray-900'}`}>
                                    {errors.description ? errors.description.message : "Add here"}
                                </label>
                                <input
                                    placeholder="Describe the issue..."
                                    className={`w-full border rounded-md p-2 text-xs outline-none font-poppins ${errors.description ? 'border-red-500' : 'border-gray-200'}`}
                                    {...register("description", { required: "Description is required" })}
                                />
                            </div>
                            <div className="w-full h-25 mt-5">
                                <input
                                    type="file"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            setValue("screenshot", e.target.files[0])
                                        }
                                    }}
                                />
                                <div onClick={() => fileInputRef.current?.click()} className="w-full h-full rounded-md flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                                    {imgValue ? (
                                        <img src={imgValue.startsWith('blob:') ? imgValue : `${baseUrl}${imgValue}`} className="w-full h-full object-cover" alt="Preview" />
                                    ) : (
                                        <div className="flex items-center space-x-3">
                                            <CloudUpload className="text-gray-900 mb-1" size={24} />
                                            <span className="text-[10px] font-medium text-gray-400 font-poppins">Drop any file here</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-12 bg-gray-100 border-t border-gray-100 p-3 flex justify-end items-center gap-3 shadow-2xl">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`bg-blue-600 text-white text-xs font-semibold px-5 py-1.5 rounded transition-colors font-poppins flex items-center justify-center min-w-[80px]
             ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700 cursor-pointer"}`}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <LoadingIndicator />
                                    <span>{edit ? "Updating..." : "Adding..."}</span>
                                </div>
                            ) : (
                                edit ? "Update" : "Add"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}