import { useEffect } from "react";
import axios  from "../../api/axios";
import { refresh_token } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

const useAxiosPrivate  = ()=>{
    const dispatch = useAppDispatch()
    const {jwt} = useAppSelector(state=>state.auth)
    useEffect(()=>{
        const requestInterceptor = axios.interceptors.request.use(
            (config)=>{
                if(!config?.headers) return config;
                if(!config.headers['Authorization']){
                    config.headers['Authorization'] = `Bearer ${jwt}`;
                }
                return config;
            },
            error => Promise.reject(error)
        )
        const responseInterceptor = axios.interceptors.response.use(
            response => response, // normal case
            async (error)=>{
                const previousRequest = error?.config;
                if((error?.response?.status !== 403 || error?.response?.status !== 401) && previousRequest?.sent) return  Promise.reject(error);
               
                    previousRequest.sent = true;
                    const data = await dispatch(refresh_token());
                    //@ts-ignore
                    previousRequest.headers['Authorization'] = `Bearer ${data.payload.jwt}`
                    return axios(previousRequest);
            }
        )

        return ()=>{
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        }
    },[])
    return axios;
}

export default useAxiosPrivate;