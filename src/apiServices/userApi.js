import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance"


const generateId = () => {
    return Math.floor(Math.random() * 1000).toString()
}

export const employerJobCreation = async (data) => {
    try {
        const jobData = {...data, employerId: generateId()}

        const respose = await userAxiosInstance.post('/employer/createOrUpdateJob', jobData)
        console.log('Respose after job creation: ', respose)
    } catch (error) {
        console.error('Error in createJob at api services: ', error)
    }
}