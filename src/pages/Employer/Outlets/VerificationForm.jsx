import * as React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
import { Button, Input, TextField } from "@mui/material";
import GrapeAnimation from "../../../components/GrapeAnimation";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import { toast } from "sonner";
import employerAxiosInstnce from "@/config/axiosConfig/employerAxiosInstance";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_PDF_TYPES = ["application/pdf"];

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  address: Yup.string()
    .min(10, "Please enter complete address")
    .required("Address is required"),
  aadharFront: Yup.mixed()
    .required("Aadhar front image is required")
    .test(
      "fileSize",
      "Max file size is 5MB",
      (value) => value?.size <= MAX_FILE_SIZE
    )
    .test(
      "fileType",
      "Only .jpg, .jpeg, .png, and .webp formats are supported",
      (value) => ACCEPTED_PDF_TYPES.includes(value?.type)
    ),
  aadharBack: Yup.mixed()
    .required("Aadhar back image is required")
    .test(
      "fileSize",
      "Max file size is 5MB",
      (value) => value?.size <= MAX_FILE_SIZE
    )
    .test(
      "fileType",
      "Only .jpg, .jpeg, .png, and .webp formats are supported",
      (value) => ACCEPTED_PDF_TYPES.includes(value?.type)
    ),
  shopCertificate: Yup.mixed()
    .required("Shop certificate is required")
    .test(
      "fileSize",
      "Max file size is 5MB",
      (value) => value?.size <= MAX_FILE_SIZE
    )
    .test(
      "fileType",
      "Only .jpg, .jpeg, .png, and .webp formats are supported",
      (value) => ACCEPTED_PDF_TYPES.includes(value?.type)
    ),
});

const steps = [
  { id: 1, title: "Basic Info" },
  { id: 2, title: "Aadhar Card" },
  { id: 3, title: "Shop Details" },
];

export default function VerificationForm() {
  const Employer = useSelector((state) => state.employer.employer);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [preview, setPreview] = React.useState({
    aadharFront: null,
    aadharBack: null,
    shopCertificate: null,
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      aadharFront: null,
      aadharBack: null,
      shopCertificate: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if(!Employer){
          toast.error('Please login')
          navigate('/employer-login')
        }
        console.log("result", values);
        const formData = new FormData();
        formData.append('email', Employer?.email)
        formData.append('name', values.name)
        formData.append('address', values.address)
        // Append multiple files
        formData.append('pdf', new File([values.aadharFront], "aadharFront.pdf", { type: "application/pdf" }))
        formData.append('pdf', new File([values.aadharBack], "aadharBack.pdf", { type: "application/pdf" }))
        formData.append('pdf', new File([values.shopCertificate], "certificate.pdf", { type: "application/pdf" }))

        console.log("formData", formData);
        // Handle form submission

        const res = await employerAxiosInstnce.post(
          "/employer-verification",
          formData,
          {
            headers:{
              'Content-Type':'multipart/form-data'
            }
          }
        );
        console.log(res);
        if (res) {
          toast.success("Verification request sended");
          setTimeout(() => {
            navigate("/employer/company_details");
          }, 1500);
        }

        // if (loading) return <p>Loading...</p>;
        // if (error) return <p>Error: {error}</p>;
      } catch (err) {
        console.log(err, "dhinuuu");

        toast.error(err.response?.data?.message || "An error occurred");
      }
    },
  });
  // const handleSubmit = formik.handleSubmit

  const handleFilePreview = (file, type) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview((prev) => ({
        ...prev,
        [type]: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const nextStep = () => {
    const fields =
      currentStep === 1
        ? ["name", "address"]
        : currentStep === 2
        ? ["aadharFront", "aadharBack"]
        : ["shopCertificate"];

    const errors = fields.filter((field) => formik.errors[field]);
    if (!errors.length) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className=" w-full bg-white flex flex-col justify-center items-center p-6 lg:p-10">
        <div className="w-full ">
          {/* Logo */}
          <div className="max-w-2xl mx-auto p-4 overflow-auto">
            <h1 className="text-2xl font-bold text-primary mb-8 text-center lg:text-left">
              Nexgen
            </h1>

            {/* Welcome Text */}
            <h2 className="text-3xl font-semibold mb-4 text-center lg:text-left">
              Verify your Account
            </h2>
            <p className="text-gray-500 mb-6 text-center lg:text-left">
              Welcome back!
            </p>
          </div>
          {/* Email and Password Form */}
          <div className="max-w-2xl mx-auto p-4 overflow-auto">
            <Card>
              <CardHeader>
                <CardTitle>Verification Details</CardTitle>
                <div className=" flex justify-between items-center mt-4">
                  {steps.map((step) => (
                    <div key={step.id} className="flex  items-center ">
                      <div
                        className={`rounded-full h-8 w-8 flex items-center justify-center border-2 
                    ${
                      currentStep > step.id
                        ? "bg-primary border-primary text-primary-foreground"
                        : currentStep === step.id
                        ? "border-primary text-primary"
                        : "border-muted text-muted-foreground"
                    }`}
                      >
                        {currentStep > step.id ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          step.id
                        )}
                      </div>
                      <div
                        className={`hidden sm:block text-sm ml-2 
                    ${
                      currentStep >= step.id
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                      >
                        {step.title}
                      </div>
                    </div>
                  ))}
                </div>
              </CardHeader>

              <form onSubmit={formik.handleSubmit}>
                <CardContent className="space-y-4 mt-4">
                  {currentStep === 1 && (
                    <>
                      <div>
                        <label>Full Name</label>
                        <Input
                          className=" md:ml-2 mt-1 block px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Enter your full name"
                          name="name"
                          value={formik.values.name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.name && formik.errors.name && (
                          <div className="text-red-500 text-sm">
                            {formik.errors.name}
                          </div>
                        )}
                      </div>
                      <div>
                        <label>Address</label>
                        <Input
                          className="md:ml-2 mt-1 block px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Enter your complete address"
                          name="address"
                          value={formik.values.address}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.address && formik.errors.address && (
                          <div className="text-red-500 text-sm">
                            {formik.errors.address}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {currentStep === 2 && (
                    <>
                      <div>
                        <label>Aadhar Card Front</label>
                        <input
                          className="md:ml-2"
                          type="file"
                          accept={ACCEPTED_PDF_TYPES.join(",")}
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) {
                              formik.setFieldValue("aadharFront", file);
                              handleFilePreview(file, "aadharFront");
                            }
                          }}
                        />
                        {preview.aadharFront && (
                          <img
                            className="mt-2"
                            src={preview.aadharFront}
                            alt="Preview"
                          />
                        )}
                        {formik.errors.aadharFront && (
                          <div className="text-red-500 text-sm">
                            {formik.errors.aadharFront}
                          </div>
                        )}
                      </div>
                      <div>
                        <label>Aadhar Card Back</label>
                        <input
                          className="md:ml-2"
                          type="file"
                          accept={ACCEPTED_PDF_TYPES.join(",")}
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) {
                              formik.setFieldValue("aadharBack", file);
                              handleFilePreview(file, "aadharBack");
                            }
                          }}
                        />
                        {preview.aadharBack && (
                          <img
                            className="mt-2"
                            src={preview.aadharBack}
                            alt="Preview"
                          />
                        )}
                        {formik.errors.aadharBack && (
                          <div className="text-red-500 text-sm">
                            {formik.errors.aadharBack}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {currentStep === 3 && (
                    <div>
                      <label>Shop Certificate</label>
                      <input
                        className="md:ml-2"
                        type="file"
                        accept={ACCEPTED_PDF_TYPES.join(",")}
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) {
                            formik.setFieldValue("shopCertificate", file);
                            handleFilePreview(file, "shopCertificate");
                          }
                        }}
                      />
                      {preview.shopCertificate && (
                        <img
                          className="mt-2"
                          src={preview.shopCertificate}
                          alt="Preview"
                        />
                      )}
                      {formik.errors.shopCertificate && (
                        <div className="text-red-500 text-sm">
                          {formik.errors.shopCertificate}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep === steps.length ? (
                    <Button type="submit">
                      Submit
                      <Check className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button type="button" onClick={nextStep}>
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </CardFooter>
              </form>
            </Card>
          </div>

          {/* Create Account */}
          {/* <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{" "}
            <a
              onClick={() => navigate("/employer/register")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Create an account
            </a>
          </p> */}
        </div>
      </div>

      {/* Right Section */}
      {/* <div className="lg:w-1/2 w-full bg-primary flex flex-col justify-center items-center text-center text-white p-6 lg:p-10">
        <div className="max-w-md">
         
          <GrapeAnimation className="sm:hidden" />

          <h2 className="text-2xl lg:text-3xl font-semibold mb-4">
            Connecting Talent with Opportunity—Post Jobs, Build Futures.
          </h2>

          <p className="text-base lg:text-lg text-gray-200 mb-4">
            Empowering Careers, One Opportunity at a Time.
          </p>

          
        </div>
      </div> */}
    </div>
  );
}
