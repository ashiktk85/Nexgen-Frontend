import * as Yup from 'yup';

const validateJobForm = Yup.object({
  jobTitle: Yup.string()
    .trim()
    .required('Job title is required')
    .min(2, 'Must contain at least 2 characters')
    .matches(/^[a-zA-Z\s&\-',"/,_]*$/, 'Must contain only letters and symbols'),
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
    .required('Mobile number is required'),
  country: Yup.string()
    .required('Country is required'),
  state: Yup.string()
    .required('State/Province is required'),
  city: Yup.string()
    .trim()
    .required('City is required')
    .min(2, 'City must be at least 2 characters'),
  salaryFrom: Yup.string()
    .trim()
    .test('at-least-one-salary', 'Enter a salary amount', function (value) {
      const { salaryTo } = this.parent;
      return Boolean(value?.trim() || salaryTo?.trim());
    }),
  salaryTo: Yup.string()
    .trim()
    .nullable(),
  description: Yup.string()
    .min(10, 'Enter minimum 10 characters')
    .max(4000, 'Description cannot exceed 4000 characters')
    .required('Description is required'),
  requirements: Yup.array()
    .of(Yup.string())
    .min(1, "At least one requirement must be selected"),
  companyId: Yup.string().nullable().optional(),
});

export default validateJobForm;
