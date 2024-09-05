import axios, { AxiosPromise } from "axios"
import apiUnAuth from "../config/apiUnAuth"

const getCountries = async () :Promise<AxiosPromise>=>{
   try {
    const res = await axios.get('https://restcountries.com/v3.1/all');
   return res
    
   } catch (error:any) {
    return error
   }
}

export {getCountries}