"use client"
import { useState, useRef, useEffect } from "react";
import { X, Plus, CloudUpload, Calendar } from 'lucide-react';
import { BugType, User } from '../types/types';
import { UserService } from "../../apiConfig/userService";
import { useRouter } from "next/navigation";
import { BugService } from "../../apiConfig/bugService";
import { baseUrl } from "../../apiConfig/api";
import toast from "react-hot-toast";
import { LoadingIndicator } from "../loadingIndicator/loadingIndicator";
type img = string | null | File
interface bugModelProps {
    isOpen: boolean;
    onClose: () => void;
    role: string;
    projectId?: string
    data: BugType
    edit: boolean
    resetEdit: () => void;
}

export default function BugModel({ isOpen, onClose, projectId, data, role, edit, resetEdit }: bugModelProps) {
    const [images, setImages] = useState<(string | undefined)[]>([])
    const [developers, setDevelopers] = useState<User[] | []>([])
    const [loading , setLoading] = useState(false)
    console.log('data in bug model :: ', data)
    const [openDev, setOpenDev] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    console.log('this is the project id .... ', projectId)
    const router = useRouter()
    const [formData, setFormData] = useState({
        title: data.title || "",
        description: data.description || "",
        type: data.type || "",
        developerIds: data.developerId || "",
        screenshot: data.screenshot || null as img,
        deadline: data.deadline || ''
    });

    const getImageValue = () => {
        if (!formData.screenshot) {
            return null
        }
        if (typeof formData.screenshot === "string") {
            return formData.screenshot
        }
        if (formData.screenshot instanceof File) {
            return URL.createObjectURL(formData.screenshot)
        }
        return null
    }
    const getImageUrl = () => {
        const imgs = developers.filter((dev) => (dev?.image !== null && dev?.image !== "null")).map((dev) => (dev.image))
        setImages(imgs)
    }
    const getDevelopers = async () => {
        console.log('going to call develoepr to assign a task..... ')
        const developers = await UserService.getDevelopers(String(projectId))
        const devs: User[] | [] = developers.filter((dev) => dev.userType === "developer")
        setDevelopers(devs)
    }

    useEffect(() => {
        const fetchDevs = async () => {
            if (isOpen && role === "sqa" && projectId) {
                await getDevelopers();
            }
        };
        fetchDevs();
    }, [isOpen, projectId, role]);
    useEffect(() => {
        const getDevsImages = () => {
            getImageUrl()
        }
        getDevsImages()

    }, [developers])

    useEffect(() => {
        if (edit) {
            setFormData({
                title: data.title || "",
                description: data.description || "",
                type: data.type || "",
                developerIds: data.developerId || "",
                screenshot: data.screenshot || null as img,
                deadline: data.deadline || ''
            });
        }

    }, [data])

    const handleState = () => {
        onClose();
        resetEdit();
        setFormData({ title: "", description: "", type: "feature", developerIds: "", screenshot: null, deadline: "" });
    }

    const handdlTask = async () => {
        try {
            setLoading(true)
            const updatedBug = new FormData()
            updatedBug.append("title", formData.title)
            updatedBug.append("description", formData.description)
            updatedBug.append("deadline", formData.deadline)
            updatedBug.append("type", formData.type)
            updatedBug.append("developerId", String(formData.developerIds))
            updatedBug.append("projectId", String(projectId))
            if (formData.screenshot) {
                updatedBug.append("screenshot", formData.screenshot)
            }
            if (edit) {
                await BugService.updateBug(updatedBug, String(data.bugId))
                handleState()
                toast.success('Bug updated');

            } else {

                await BugService.createBug(updatedBug)
                toast.success("Bug added!")
                setFormData({ title: "", description: "", type: "feature", developerIds: "", screenshot: null, deadline: "" });

            }
            handleState()
            router.refresh()

        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "Something went wrong";
                toast.error(errorMessage);
        }finally{
            setLoading(false)
        }

    }

    if(loading) return <LoadingIndicator />
    if (!isOpen) return null;
    const imgValue = getImageValue()
    console.log('developers to assign a task :: ', developers)
    console.log('images are :: ', images)


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
            <div className="bg-white w-full max-w-lg h-[550px] rounded-md shadow-lg flex flex-col overflow-hidden">
                {/* header */}
                <div className="w-full h-10 bg-gray-100 p-2 flex justify-end items-center">
                    <button onClick={handleState} className="bg-gray-900 p-1 rounded-sm cursor-pointer">
                        <X size={16} color="white" />
                    </button>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handdlTask();
                    }}
                    className="flex-1 flex flex-col overflow-hidden"
                >
                    <div className="flex-1 flex flex-col">
                        <h2 className="text-lg font-medium text-gray-800 p-4 pb-2">{edit ? "Edit task" : "Add new task"} </h2>
                        <div className="w-full h-[1px] bg-gray-200"></div>

                        <div className="flex flex-col px-6 py-4">

                            {/* assigned to section */}
                            <div className="flex items-center gap-4 relative">
                                <p className="text-[10px] text-gray-900 font-medium">Assigned to</p>
                                <div onClick={() => { setOpenDev(!openDev) }} className="flex items-center cursor-pointer">
                                    <div className="flex -space-x-1">
                                        <div className="flex -space-x-2">
                                            <img
                                                src={images[0] && images[0] !== "null" && images[0] != undefined ? `${baseUrl}${images[0]}` : '/icons/user.png'}
                                                alt="dev-1"
                                                className="size-6 rounded-full ring-2 ring-white object-cover bg-black"
                                            />
                                            <img
                                                src={images[1] && images[1] !== "null" && images[0] != undefined ? `${baseUrl}${images[1]}` : '/icons/user.png'}
                                                alt="dev-2"
                                                className="size-6 rounded-full ring-2 ring-white object-contain bg-black/70"
                                            />
                                        </div>
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full border border-dotted border-black bg-gray-50 relative cursor-pointer hover:bg-gray-100 transition-colors">
                                            <Plus size={12} className="text-white bg-gray-400 rounded-full absolute top-3 left-3" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center items-center gap-2">
                                    <p className="text-[10px] text-gray-900 font-medium relative font-inter ml-5">Add due date</p>
                                    <div>
                                        <div className="cursor-pointer relative flex items-center justify-center w-6 h-6 rounded-full border border-dotted border-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <Calendar size={12} className="text-gray-600 cursor-pointer" />
                                            <input
                                                type="date"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div><p className="text-gray-600 text-[10px]">{formData.deadline}</p></div>
                                </div>

                                {openDev && (
                                    <div className="absolute z-20 top-8 left-16 w-40 bg-white border border-gray-200 shadow-xl rounded-md p-2 max-h-32 overflow-y-auto">
                                        {developers.map(user => (
                                            <label key={user.id} className="flex items-center gap-2 py-1.5 text-[10px] text-gray-600 cursor-pointer hover:bg-gray-50 px-1 rounded">
                                                <input
                                                    type="checkbox"
                                                    className="size-3 accent-blue-600"
                                                    checked={formData.developerIds === user.id}
                                                    onChange={() => { setFormData({ ...formData, developerIds: user.id }); setOpenDev(!openDev) }}
                                                />
                                                {user.name}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <input
                                type="text"
                                placeholder="Add title here"
                                value={formData.title}
                                className="w-full text-2xl mt-7 font-poppins outline-none border-b border-transparent pb-1"
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />

                            <div>
                                <label className="block mb-1 mt-5 text-[10px] text-gray-900 font-medium font-poppins">Task type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full border border-gray-200 rounded-md p-2 text-xs outline-none bg-gray-50/50 cursor-pointer "
                                >
                                    <option value="bug">Bug</option>
                                    <option value="feature">Feature</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] text-gray-900 font-medium mt-3 mb-1 font-poppins">Add here</label>
                                <input
                                    placeholder="Describe the issue..."
                                    value={formData.description}
                                    className="w-full border border-gray-200 rounded-md p-2 text-xs outline-none"
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="w-full h-25 mt-5">
                                <input type="file" className="hidden" ref={fileInputRef} onChange={(e) => e.target.files && setFormData({ ...formData, screenshot: e.target.files[0] })} />
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full h-full rounded-md flex flex-col items-center justify-center cursor-pointer overflow-hidden "
                                >
                                    {imgValue ? (
                                        <img
                                            src={imgValue.startsWith('blob:') ? imgValue : `http://localhost:3000${imgValue}`}
                                            className="w-full h-full object-cover"
                                            alt="Preview"
                                        />
                                    ) : (
                                        <div className="flex items-center space-x-3">
                                            <CloudUpload className="text-gray-900 mb-1" size={24} />
                                            <span className="text-[10px] font-medium text-gray-400">Drop any file here</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-12 bg-gray-100 border-t border-gray-100 p-3 flex justify-end items-center gap-3 shadow-2xl">
                        <button type="submit" className="bg-blue-600 text-white text-xs font-semibold px-5 py-1.5 rounded hover:bg-blue-700 transition-colors">
                            {edit ? "Update" : "Add"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}