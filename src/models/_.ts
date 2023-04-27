export interface IPerson {
  name: string;
  familyName: string;
  universityId: string;
  email: string;
  phoneNumber: string;
}

export interface IStudent extends IPerson {
  educationDegree: string;
  enteranceYear: string;
  semester: string;
  average: number;
  faculty: string;
  field: string;
}

export interface ITeacher extends IPerson {
  faculty: string;
  field: string;
  rank: string;
}

export interface IManager extends IPerson {
  faculty: string;
}

export interface ISubject {
  name: string;
  value: number;
  preRequests: string;
  sameRequests: string;
}

export interface ISemesterSubject extends ISubject {
  classTime: string;
  examTime: string;
  examLocation: string;
  teacher: ITeacher;
  capacity: number;
  semester: number;
}

export const PersonSchemaType = {
  name: { type: String, required: true },
  familyName: { type: String, required: true },
  universityId: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
};
