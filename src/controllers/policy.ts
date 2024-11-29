import { baseUrl } from "../config/config";
import api from "../config/api";

export const getPolicies = async(url:string,userToken:string)=>{
try {
    const res = await api.get(url,userToken);
    return res;
} catch (error) {
    throw error
}
}

export const getAPolicy = async(url:string,userToken:string)=>{
    try {
        const res = await api.get(url,userToken);
        return res;
    } catch (error) {
        throw error
    }
    }