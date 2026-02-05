"use client"
import { useState, useRef } from "react";
import { ImageIcon } from 'lucide-react';
import { useEffect } from "react";
import { projectToEdit, User } from "../types/types";
import { UserService } from "../../apiConfig/userService";
import { ProjectService } from "../../apiConfig/projectService";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import toast from 'react-hot-toast'
interface AddProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    role: string;
    project: projectToEdit | null
    resetEdit: () => void
}
type imageType = string | File | null

export default function Model({ isOpen, onClose, project, role, resetEdit }: AddProjectModalProps) {
    console.log('project in model :: ', project)
    const [users, setUsers] = useState<User[]>([])
    const [developers, setdevelopers] = useState<string[]>([])
    const [devs, setDevs] = useState(false)
    const [assignedDev, setAssignedDev] = useState<User[] | []>([])
    const [model, setModel] = useState(false)
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter()

    const [formData, setFormData] = useState({
        name: project?.name || "",
        description: project?.description || "",
        sqaIds: [] as number[],
        developerIds: [] as number[],
        image: project?.image as imageType,
        id: project?.id || null
    });
    const getUsers = async () => {
        try {
            const users: User[] = await UserService.getUsers()
            setUsers(users)
            console.log('fetched all users...')
        } catch (error: any) {
            console.log(error?.response?.data?.message)
        }
    }
    const getImageValue = () => {
        if (!formData.image) {
            return null

        }
        if (typeof formData.image === "string") {
            return formData.image
        }
        if (formData.image instanceof File) {
            return URL.createObjectURL(formData.image)
        }
        return null
    }

    const getAllassigned = async () => {
        try {
            const devs: User[] | [] = await UserService.getDevelopers(String(project?.id))
            setAssignedDev(devs)
        } catch (error: any) {
            toast.error(error?.response?.data?.message)
        }
    }
    useEffect(() => {
        const fetch = () => {
            if (isOpen) {
                getUsers()
            }
            if (project?.id && isOpen) {
                getAllassigned()
            }
        }
        fetch()
    }, [isOpen])

    useEffect(() => {
        const update = () => {
            if (project?.id) {
                setFormData({
                    name: project.name || "",
                    description: project.description || "",
                    sqaIds: assignedDev.filter((dev) => dev.userType === "sqa").map((dev) => Number(dev.id)),
                    developerIds: assignedDev.filter((dev) => dev.userType === "developer").map((dev) => Number(dev.id)),
                    image: project?.image ?? null,
                    id: project.id
                });
            }
        }
        update()
    }, [project, assignedDev]);

    console.log('developer names: ', developers)
    const [openSqa, setOpenSqa] = useState(false);
    const [openDev, setOpenDev] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;
    const handleState = () => {
        setFormData({
            name: '',
            description: '',
            image: null,
            developerIds: [],
            sqaIds: [],
            id: null

        })
        resetEdit()
        onClose()
    }
    const handleSqa = (id: number) => {
        if (formData.sqaIds.includes(id)) {
            setFormData({ ...formData, sqaIds: formData.sqaIds.filter(item => item !== id) });
        } else {
            setFormData({ ...formData, sqaIds: [...formData.sqaIds, id] });
        }
    };

    const handleDeveloper = (id: number) => {
        if (formData.developerIds.includes(id)) {
            setFormData({ ...formData, developerIds: formData.developerIds.filter(item => item !== id) });
        } else {
            setFormData({ ...formData, developerIds: [...formData.developerIds, id] });
        }
    };

    const handleSumbite = async () => {
        try {
            const data = new FormData()
            data.append("name", formData.name)
            data.append("description", formData.description)
            data.append("developerIds", formData.developerIds.join(','))
            data.append("sqaIds", formData.sqaIds.join(','))
            if (formData.id) {
                data.append("image", String(formData.image))
            }
            if (formData.image) {
                data.append("image", formData.image)
            }
            if (formData.id) {

                await ProjectService.updateProject(data, formData.id)
                toast.success('Project updated')


            } else {
                await ProjectService.createProject(data)
                toast.success('Project added')

            }
            router.refresh()
            resetEdit()
            handleState()


        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "Something went wrong";
            toast.error(errorMessage);
        }

    }
    const imgValue = getImageValue()
    return (
        <>
            <div className={`fixed inset-0 z-50 px-2 lg:px-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px] ${model ? "blur-sm" : ''}`}>
                <div className="bg-white w-full max-w-2xl rounded-sm shadow-lg p-6">
                    <h2 className="text-lg font-light text-gray-800 mb-6">{project?.id ? "Edit project" : "Add new project"}</h2>

                    <div className="flex gap-8">
                        <div className="flex-1 flex flex-col gap-4">
                            <div>
                                <label className="block text-[11px] font-light text-gray-500 mb-1">Project name</label>
                                <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} type="text" placeholder="Enter project name" className="w-full border border-gray-100 rounded-sm p-2 text-xs font-light outline-none" />
                            </div>

                            <div>
                                <label className="block text-[11px] font-light text-gray-500 mb-1">Short details</label>
                                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Enter details" rows={1} className="w-full border border-gray-100 rounded-sm p-2 text-xs font-light outline-none resize-none" />
                            </div>


                            <div className="relative">
                                <p className="block text-[11px] font-light text-gray-500 mb-1">Assign SQA</p>
                                <div onClick={() => { setOpenSqa(!openSqa); setOpenDev(false); setDevs(false); setModel(true) }} className="w-full border border-gray-100 rounded-sm p-2 text-xs font-light flex justify-start items-center cursor-pointer text-gray-400">
                                    {
                                        formData.sqaIds.length > 0 ? users.filter((user) => user.userType === "sqa" && formData.sqaIds.includes(Number(user.id))).map((user) => {
                                            return <p key={user.id} className="font-inter text-[10px] p-1">{user.name}</p>
                                        })
                                            : "Assign Sqa"

                                    }

                                </div>
                            </div>

                            <div className="relative">
                                <p className="block text-[11px] font-light text-gray-500 mb-1">Assign Developers</p>
                                <div onClick={() => { setModel(!openDev); setOpenSqa(false); setDevs(true) }} className="w-full border border-gray-100 rounded-sm p-2 text-xs font-light flex justify-start items-center cursor-pointer text-gray-400">
                                    {
                                        formData.developerIds.length > 0 ? users.filter((user) => user.userType === "developer" && formData.developerIds.includes(Number(user.id))).map((user) => {
                                            return <p key={user.id} className="font-inter text-[10px] p-1">{user.name}</p>
                                        })
                                            : "Assign develoepers"

                                    }
                                </div>
                            </div>

                            <div className="flex gap-3 mt-4">
                                <button type="button" className="bg-blue-600 w-1/2 cursor-pointer text-white px-8 py-2 rounded-sm text-sm font-light" onClick={handleSumbite}>Add</button>
                                <button type="button" onClick={handleState} className="border w-1/2 cursor-pointer border-gray-200 text-gray-600 px-8 py-2 rounded-sm text-sm font-light">Cancel</button>
                            </div>
                        </div>

                        <div className="w-48 flex flex-col items-center pt-5">
                            <input type="file" className="hidden" ref={fileInputRef} onChange={(e) => e.target.files && setFormData({ ...formData, image: e.target.files[0] })} />
                            <div onClick={() => fileInputRef.current?.click()} className="w-full aspect-square border-2 border-dashed border-gray-200 rounded-md flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                                {imgValue ? (
                                    <img
                                        src={imgValue.startsWith('blob:') ? imgValue : `http://localhost:3000${imgValue}`}
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
                    </div>
                </div>

            </div>
            {model && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
                    <div className="w-full max-w-[500px] h-1/2 bg-gray-50 flex flex-col rounded-md shadow-2xl overflow-hidden">

                        {/* Top Bar: Search and Close */}
                        <div className="w-full h-14 bg-gray-100 px-4 flex items-center gap-3 border-b border-gray-200 shrink-0">
                            <input
                                type="text"
                                autoFocus
                                placeholder={devs ? "Search developers..." : "Search SQAs..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 px-4 py-2 text-sm bg-white border border-gray-200 rounded-md outline-none focus:border-gray-200 font-poppins"
                            />
                            <button
                                onClick={() => {
                                    setModel(false);
                                    setSearchTerm("");
                                }}
                                className="bg-black text-white p-1.5 rounded-md hover:bg-gray-800 transition-colors shrink-0"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Content Body */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                            <div className="flex flex-wrap gap-3">
                                {users
                                    .filter((user) => devs ? user.userType === "developer" : user.userType === "sqa")
                                    .filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map((user) => {
                                        const isSelected = devs
                                            ? formData.developerIds.includes(Number(user.id))
                                            : formData.sqaIds.includes(Number(user.id));

                                        return (
                                            <div
                                                key={user.id}
                                                onClick={() => devs ? handleDeveloper(Number(user.id)) : handleSqa(Number(user.id))}
                                                className={`px-5 h-8 cursor-pointer text-sm font-poppins rounded-full flex items-center justify-center transition-all duration-200 ${isSelected
                                                    ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-400 ring-offset-2 scale-105"
                                                    : "bg-gray-200 text-gray-700 hover:bg-blue-100 hover:text-blue-700 hover:scale-105"
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