import data from './projects.json';
export interface Project {id:string;name:string;platform:string;kind:string;color:string;url:string;description:string;scope:string;note:string;extra?:string;}
export const projects:Project[]=data;
export const featuredProjects=projects.slice(0,4);
