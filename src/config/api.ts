import axios, {AxiosRequestConfig} from "axios"
import { baseUrl } from "./config";

const header ={

}
export default {
    get : async (path: string, token: string) => {
        const config: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Access-Control-Allow-Origin': '*', // Allow requests from any origin
                // Add other headers if needed
            }
        };
    
        try {
            const response = await axios.get(`${baseUrl}api/${path}`, config);
            return response;
        } catch (error) {
            // Handle error
            console.error('Error fetching data:', error);
        }
    },
    post : async (path: string,body:object, token: string)=>{
        const config: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Access-Control-Allow-Origin': '*', // Allow requests from any origin
                // Add other headers if needed
            }
        };
    
        try {
            const response = await axios.post(`${baseUrl}api/${path}`,body, config);
            return response;
        } catch (error) {
            // Handle error
            console.error('Error fetching data:', error);
        }
    }
}