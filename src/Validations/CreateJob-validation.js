import * as Yup from 'yup';

const validateJobForm = Yup.object({
  jobTitle: Yup.string()
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
  salaryFrom: Yup.number()
    .typeError('Salary must be a number')
    .min(0, 'Salary cannot be negative')
    .required('Starting salary is required')
    .test('is-less-than-to', 'Starting salary must be less than ending salary', 
      function(value) {
        const { salaryTo } = this.parent;
        return !salaryTo || value === undefined || value <= salaryTo;
    }),
  salaryTo: Yup.number()
    .typeError('Salary must be a number')
    .min(0, 'Salary cannot be negative')
    .required('Ending salary is required')
    .test('is-greater-than-from', 'Ending salary must be greater than starting salary',
      function(value) {
        const { salaryFrom } = this.parent;
        return !salaryFrom || value === undefined || value >= salaryFrom;
    }),
  description: Yup.string()
    .min(10, 'Enter minimum 10 characters')
    .required('Description is required'),
  requirements: Yup.array()
    .of(Yup.string())
    .min(1, "At least one requirement must be selected"),
});

export default validateJobForm;