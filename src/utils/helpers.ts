import axios, { AxiosPromise } from "axios"
import apiUnAuth from "../config/apiUnAuth"
import { toast } from "react-toastify";

const getCountries = async () :Promise<AxiosPromise>=>{
   try {
    const res = await axios.get('https://restcountries.com/v3.1/all');
   return res
    
   } catch (error:any) {
    return error
   }
}

export {getCountries}

export const calculatePercent = (ownersShares: any[],newPecentage:number) => {

   let total = 0;
   for (let x = 0; x < ownersShares.length; x++) {
       total = total + newPecentage + (ownersShares[x].PercentageHolding ? ownersShares[x].PercentageHolding : 0) || 0
   }

   if (total >= 100) {
       toast.error('Already 100% no more shares');
   } else {
       return true
   }
   return total
}