import axiosRetry from 'axios-retry';
import axios, {AxiosRequestConfig, AxiosResponse} from "axios";

import { baseUrl,publicBaseUrl } from "./config";

axiosRetry(axios, {
    retries: 3, // Number of retry attempts
    retryDelay: (retryCount) => {
      console.log(`Retry attempt #${retryCount}`);
      return retryCount * 1000; // Delay between retries (in ms)
    },
    retryCondition: (error:any) => {
      // Retry only for network errors or 5xx server errors
      return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response.status >= 500;
    },
  });

export default {
    get : async (path: string):Promise<AxiosResponse> => {
        const config: AxiosRequestConfig = {
            timeout:5000,
            headers: {
                // Authorization: `Bearer ${token}`,
                'Access-Control-Allow-Origin': '*', // Allow requests from any origin
                // Add other headers if needed
            }
        };
    
        try {
            const response = await axios.get(`${publicBaseUrl}${path}`, config);
            return response;
        } catch (error:any) {
            console.log(error)
            return error;
            console.error('Error fetching data:', error);
        }
    },
    getNoToken : async (url:string) => {
        const config: AxiosRequestConfig = {
            timeout:5000,
            headers: {
                // Authorization: `Bearer ${token}`,
                'Access-Control-Allow-Origin': '*', // Allow requests from any origin
                // Add other headers if needed
            }
        };
    
        try {
            const response = await axios.get(`${baseUrl}/BeneficialOwner`, config);
            return response;
        } catch (error) {
            // Handle error
            console.error('Error fetching data:', error);
        }
    },
    post : async (path: string,body:object)=>{
        const config: AxiosRequestConfig = {
            timeout:5000,
            headers: {
                // Authorization: `Bearer ${token}`,
                'Access-Control-Allow-Origin': '*', // Allow requests from any origin
                // Add other headers if needed
            }
        };
    
        try {
            const response = await axios.post(`${baseUrl}/api/v1/${path}`,body, config);
            return response;
        } catch (error) {
            // Handle error
            console.error('Error fetching data:', error);
        }
    }
}