import { baseUrl } from "../config/config";
import api from "../config/api";

export const getAllDepartments = async(url:string,userToken:string)=>{
try {
    const res = await api.get(url,userToken);
    return res;
} catch (error) {
    throw error
}
}

export const getPolicyByADepartment = async(url:string,userToken:string)=>{
    try {
        const res = await api.get(url,userToken);
        return res;
    } catch (error) {
        throw error
    }
    }