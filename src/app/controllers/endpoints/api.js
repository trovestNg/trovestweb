import axios from "axios";
import { host2 } from "../../../config";
const baseUrl = `${host2}/api/v1`;
const config = (token) => {
    return token ?
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "Access-Control-Allow-Origin": "*"
            }
        }
        :
        {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        }
}

export default {
    get: async (url, token) => {
        {
            try {
                const res = await axios.get(`${baseUrl}${url}`, config(token))
                return res
            } catch (error) {
                const status = error.response?.data?.statusCode
                if (status == 401 || status == 403) {
                    localStorage.clear();
                    if (!window.location?.pathname?.includes("/login")) {
                        return window.location.href = "/login";
                    }
                }
                return error.response
            }
        }

    },

    post: async (url, token) => {
        {
            try {
                const res = await axios.post(`${baseUrl}${url}`, config(token))
                return res
            } catch (error) {
                const status = error.response?.data?.statusCode
                if (status == 401 || status == 403) {
                    localStorage.clear();
                    if (!window.location?.pathname?.includes("/login")) {
                        return window.location.href = "/login";
                    }
                }
                return error.response
            }
        }
    }
}