import * as Yup from "yup";

const validateCompanyForm = Yup.object({
    companyName: Yup.string()
        .required("Company name is required")
        .min(2, "Company name must be at least 2 characters")
        .max(100, "Company name cannot exceed 100 characters"),

    industry: Yup.string()
        .required("Industry is required")
        .min(2, "Industry must be at least 2 characters")
        .max(50, "Industry cannot exceed 50 characters")
        .nullable(),
    location: Yup.string()
        .required("Location is required")
        .min(2, "Location must be at least 2 characters")
        .max(100, "Location cannot exceed 100 characters"),

    about: Yup.string()
        .max(1000, "Description cannot exceed 1000 characters")
        .nullable(),

    webSite: Yup.string()
        .url("Enter a valid website URL")
        .nullable(),

    address: Yup.string()
        .required("Company address is required")
        .min(5, "Address must be at least 5 characters")
        .max(200, "Address cannot exceed 200 characters")
        .nullable(),

    logo: Yup.mixed()
        .test(
            "fileSize",
            "Logo size must be less than 2MB",
            (value) => !value || (value && value.size <= 2 * 1024 * 1024)
        )
        .test(
            "fileFormat",
            "Only JPG, JPEG, and PNG formats are allowed",
            (value) =>
                !value || (value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type))
        )
        .nullable(),

    companyCertificate: Yup.mixed()
        .test(
            "fileSize",
            "Certificate file size must be less than 5MB",
            (value) => !value || (value && value.size <= 5 * 1024 * 1024)
        )
        .test(
            "fileFormat",
            "Only PDF format is allowed",
            (value) => !value || (value && value.type === "application/pdf")
        )
        .nullable(),

    socialLinks: Yup.object({
        linkedin: Yup.string()
            .url("Enter a valid LinkedIn URL")
            .nullable(),
        twitter: Yup.string()
            .url("Enter a valid Twitter URL")
            .nullable(),
        facebook: Yup.string()
            .url("Enter a valid Facebook URL")
            .nullable(),
    }),
});

export default validateCompanyForm;
