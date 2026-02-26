export interface signup {
  name: string;
  email: string;
  password: string;
  userType: string | null;
  phoneNumber: string;
  confirmPassword: string;
}
export type bugForm = {
    title: string,
    description: string,
    type: string,
    developerId: string | number,
    screenshot: img,
    deadline: string,
    isClose: boolean,
    status: string
}
export type imageType = string | File | null
export type projectForm = {
    name: string,
    description: string,
    sqaIds: number[],
    developerIds: number[],
    image: imageType | null,
    id: number | null
};

export type profileForm = {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
};

export enum UserTypes {
  DEVELOPER = 'developer',
  SQA = 'sqa',
  MANAGER = 'manager',
}

export interface loginDetails {
  email: string;
  password: string;
}

export interface UserType {
  id: number;
  name: string;
  image: string | null;
  userType: 'developer' | 'sqa';
}

export interface ProjectType {
  projectId: number;
  name: string;
  description: string;
  image: string | null;
  devTeam: UserType[];
  qaTeam: UserType[];
  createdAt: string;
  updatedAt: string;
  taskComplete: number;
  totalBugs: number;
}

export interface IProject {
  id: number;
  name: string;
  description?: string;
  image?: string;
}
export interface projectToEdit {
  projectId: number;
  name: string;
  description: string;
  image: string | null;
  devTeam: UserType[];
  qaTeam: UserType[];
}

export interface User {
  id: string;
  name: string;
  userType: string;
  image: string;
  email: string;
}

type img = string | null | File;

export interface profile {
  name: string;
  email: string;
  phoneNumber: string;
  image: string;
  role: string;
}
//bug
export interface BugType {
  bugId: number;
  title: string;
  description: string;
  screenshot: string | null;
  deadline: string;
  type: 'bug' | 'feature';
  projectId: number;
  developerId: number;
  sqaId: number;
  status: 'pending' | 'in progress' | 'completed';
  createdAt: string;
  updatedAt: string;
  isClose: boolean;
  developerImage: string | null;
  developerName: string;
  sqaName: string;
  sqaImage: string | null;
}

export interface IBugDTO {
  bugId: number;
  title: string;
  description: string;
  status: string;
  screenshot: string | null;
  projectId: number;
  developerId: number;
  deadline: string;
  sqaId: number;
  type: string;
  createdAt: string;
  updatedAt: string;
  isClose: boolean;
}
interface IAssignedUser {
  id: number;
  name: string;
  image: string;
}

export interface IBugWithDeveloper {
  bug: IBugDTO;
  developer: IAssignedUser;
  sqa: IAssignedUser;
}

export interface IBugs {
  bugs: IBugWithDeveloper[];
}

export interface BugResponse {
  succees: boolean;
  count: number;
  message: string;
  data: BugType[];
}
