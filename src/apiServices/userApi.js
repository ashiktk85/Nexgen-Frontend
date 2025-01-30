import employerAxiosInstnce from "@/config/axiosConfig/employerAxiosInstance"
import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance"




export const employerJobCreation = async (data , id) => {
    try {
        const respose = await employerAxiosInstnce.post(`/createJobPost/${id}`, data)
        console.log('Respose after job creation: ', respose)
        return respose.data.status
    } catch (error) {
        console.error('Error in createJob at api services: ', error)
    }
}