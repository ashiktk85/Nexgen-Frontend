import employerAxiosInstnce from "@/config/axiosConfig/employerAxiosInstance"
import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance"


const generateId = () => {
    return Math.floor(Math.random() * 1000).toString()
}

export const employerJobCreation = async (data) => {
    try {
        
        const id = generateId()
        const respose = await employerAxiosInstnce.post(`/createOrUpdateJob/:${id}`, data)
        console.log('Respose after job creation: ', respose)
    } catch (error) {
        console.error('Error in createJob at api services: ', error)
    }
}