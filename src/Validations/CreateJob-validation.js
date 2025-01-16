import * as Yup from 'yup'

const validateJobForm = Yup.object({
  jobTitle: Yup.string()
  .matches(/^[a-zA-Z\s]*$/, 'Must contain only letters')
  .min(2, 'Must contain at least 2 characters')
  .required('Job title is required'),
  email: Yup.string()
  .email('Enter a valid email')
  .required('Email is required'),
  phone: Yup.string()
  .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
  .required('Mobile number is required'),
  state: Yup.string()
  .required('State is required'),
  city: Yup.string()
  .required('City is required'),
  description: Yup.string()
  .min(10, 'Enter minimum 10 characters')
  .required('Description is required'),
  requirements: Yup.array()
    .of(Yup.string())
    .min(1, "At least one requirement must be selected"),
})


export default validateJobForm
