import axiosRetry from 'axios-retry';
import axios, {AxiosRequestConfig} from "axios";

import { baseUrl } from "./config";

axiosRetry(axios, {
    retries: 3, // Number of retry attempts

    retryDelay: (retryCount) => {
      console.log(`Retry attempt #${retryCount}`);
      return retryCount * 500; // Delay between retries (in ms)
    },
    retryCondition: (error:any) => {
      // Retry only for network errors or 5xx server errors
      return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response.status >= 500;
    },
  });

export default {
    get : async (path: string, token: string) => {
        const config: AxiosRequestConfig = {
            timeout:10000,
            headers: {
                Authorization: `Bearer ${token}`,
                'Access-Control-Allow-Origin': '*', // Allow requests from any origin
                // Add other headers if needed
            }
        };
    
        try {
            const response = await axios.get(`${baseUrl}/api/v1/${path}`, config);
            return response;
        } catch (error) {
            // Handle error
            console.error('Error fetching data:', error);
        }
    },
    post : async (path: string,body:object, token: string)=>{
        const config: AxiosRequestConfig = {
            timeout:10000,
            headers: {
                Authorization: `Bearer ${token}`,
                'Access-Control-Allow-Origin': '*', // Allow requests from any origin
                // Add other headers if needed
            }
        };
    
        try {
            const response = await axios.post(`${baseUrl}/api/v1/${path}`,body, config);
            return response;
        } catch (error:any) {
            return error.response
           
        }
    },
    patch : async (path: string,body:object, token: string)=>{
        const config: AxiosRequestConfig = {
            timeout:10000,
            headers: {
                Authorization: `Bearer ${token}`,
                'Access-Control-Allow-Origin': '*', // Allow requests from any origin
                // Add other headers if needed
            }
        };
    
        try {
            const response = await axios.patch(`${baseUrl}/api/v1/${path}`,body, config);
            return response;
        } catch (error:any) {
            return error.response
           
        }
    },
    postForm : async (path: string,body:object, token: string)=>{
        const config: AxiosRequestConfig = {
            timeout:10000,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type":'multipart/form-data;'
            }
        };
    
        try {
            const response = await axios.post(`${baseUrl}/api/v1/${path}`,body, config);
            return response;
        } catch (error:any) {
            return error.response
           
        }
    }
}