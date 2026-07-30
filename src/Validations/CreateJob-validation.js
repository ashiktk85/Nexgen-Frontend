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
  countryCode: Yup.string()
    .trim()
    .required('Country code is required')
    .matches(/^\+\d{1,4}$/, 'Enter a valid country dial code'),
  phone: Yup.string()
    .required('Mobile number is required')
    .matches(/^[0-9]{6,15}$/, 'Enter a valid phone number (6–15 digits)'),
  country: Yup.string().nullable().trim().optional(),
  state: Yup.string().nullable().trim().optional(),
  city: Yup.string()
    .nullable()
    .trim()
    .optional()
    .test('city-min', 'City must be at least 2 characters', (value) => {
      if (!value) return true;
      return value.length >= 2;
    }),
  salaryCurrency: Yup.string().trim().optional(),
  salaryFrom: Yup.string().trim().nullable().optional(),
  salaryTo: Yup.string().trim().nullable().optional(),
  salaryInrFrom: Yup.string().trim().nullable().optional(),
  salaryInrTo: Yup.string().trim().nullable().optional(),
  shopName: Yup.string().trim().nullable().optional(),
  description: Yup.string()
    .nullable()
    .trim()
    .optional()
    .test('desc-min', 'Enter minimum 10 characters', (value) => {
      if (!value) return true;
      return value.length >= 10;
    })
    .max(4000, 'Description cannot exceed 4000 characters'),
  requirements: Yup.array()
    .of(Yup.string())
    .min(1, "At least one requirement must be selected"),
  companyId: Yup.string().nullable().optional(),
});

export default validateJobForm;
