import adminAxiosInstance from "@/config/axiosConfig/adminAxiosInstance";

import { toast } from "sonner";


export const getAllUsersSerive = async (page, limit) => {

    try {
        const response = await adminAxiosInstance.get(`/getUsers?page=${page}&limit=${limit}`)
        return response
    } catch (error) {
        console.error('Error in get all users at admin Api service: ', error)
        let errorMessage = "An unexpected error occurred";
        if(error.response){
            errorMessage = error.response.data.message || `Error ${error.response.status}: ${error.response.statusText}`
        }
        toast.error(errorMessage)
    }
}


export const userChangeStatusService = async (userId) => {
    try {
        const response = await adminAxiosInstance.put(`/changeStatus/${userId}`)
        return response
    } catch (error) {
        console.error('Error in get all users at admin Api service: ', error)
        let errorMessage = "An unexpected error occurred";
        if(error.response){
            errorMessage = error.response.data.message || `Error ${error.response.status}: ${error.response.statusText}`
        }
        toast.error(errorMessage)
    }
}


export const getAllEmployers = async (page, limit) => {
    try {
        const response = await adminAxiosInstance.get(`/getEmployers?page=${page}&limit=${limit}`)
        return response
    } catch (error) {
        console.error('Error in get all employers at admin Api service: ', error)
        let errorMessage = "An unexpected error occurred";
        if(error.response){
            errorMessage = error.response.data.message || `Error ${error.response.status}: ${error.response.statusText}`
        }
        toast.error(errorMessage)
    }
}


export const employerListUnList = async (employerId) => {
    try {
        const response = await adminAxiosInstance.put(`/changeEmployerStatus/${employerId}`)
        return response
    } catch (error) {
        console.error('Error in employerListUnList at admin Api service: ', error)
        let errorMessage = "An unexpected error occurred";
        if(error.response){
            errorMessage = error.response.data.message || `Error ${error.response.status}: ${error.response.statusText}`
        }
        toast.error(errorMessage)
    }
}

