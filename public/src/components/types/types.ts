export interface signup {
    
    name: string,
    email: string,
    password: string,
    userType: string | null
    phoneNumber: string,
    confirmPassword: string
}
 


export enum UserTypes {
  DEVELOPER = 'developer',
  SQA = 'sqa',
  MANAGER = 'manager',
}

export interface loginDetails{
    email : string,
    password: string
}


export interface ProjectType {
  projectId: number;
  managerId: number;
  name: string;
  image: string ;
  createdAt: Date;
  updatedAt?: Date;
  description?: string

}

export interface IProject{
    id: number,
    name: string,
    description?: string,
    image?: string;
}

export interface  projectToEdit{
  name: string,
  id: number,
  description?: string,
  image?: string 
}

export interface User {
  id: string;
  name: string;
  userType: string;
  image?: string 
}

type img = string | null | File

export interface profile {
   email: string,
   password?: string,
   phoneNumber: string,
   image: img,
   name: string
}
//bug

export interface BugType {
    bugId: number;
    title: string;
    description: string;
    screenshot?: string | null;
    deadline: string;
    type: 'bug' | 'feature'; 
    projectId?: number;
    developerId?: number;
    sqaId?: number;
    status: 'pending' | 'in progress' | 'completed'; 
    createdAt?: string;
    updatedAt?: string;
}

export interface BugResponse {
    succees: boolean; 
    count: number;
    message: string;
    data: BugType[];
}

