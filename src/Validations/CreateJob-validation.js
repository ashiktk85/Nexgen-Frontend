import * as Yup from 'yup'

const validateJobForm = Yup.object({
  jobTitle: Yup.string()
  .required('Job title is required'),
  email: Yup.string()
  .email('Enter a valid email')
  .required('Email is required'),
  phone: Yup.string()
  .required('Mobile number is required'),
  countryCode: Yup.string()
  .required('Country code is required'),
  country: Yup.string()
  .required('Country is required'),
  state: Yup.string()
  .required('State is required'),
  city: Yup.string()
  .required('City is required'),
  description: Yup.string()
  .required('Description is required'),
  requirements: Yup.array()
    .of(Yup.string())
    .min(1, "At least one requirement must be selected"),
})


export default validateJobForm
