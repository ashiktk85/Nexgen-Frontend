import React, { useEffect, useState } from 'react';
import { CiShare2, CiBookmarkCheck } from "react-icons/ci";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import userAxiosInstance from '@/config/axiosConfig/userAxiosInstance';
import Navbar from '../components/User/Navbar';
import { useSelector } from 'react-redux';

const JobDetails = () => {
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const { id } = useParams();
  const user = useSelector((state) => state.user.seekerInfo)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await userAxiosInstance.get(`/job-details/${id}`, { params: { userId: user.userId } });
        setJob(data.jobDetails);
        setCompany(data.employerDetails);
      } catch (error) {
        toast.warning(error.response.data.message || "An error occurred");
        navigate('/home');
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleApplyJob = () => {
    navigate(`/job-application/${id}`, {
      state: {
        companyName: company?.name,
        phone: job?.phone,
        companyLocation: `${job?.state}, ${job?.city}`
      }
    })
  }

  if (!job || !company) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex-shrink-0">
        <Navbar />
      </header>

      <main className="flex flex-col lg:flex-row p-4 lg:p-6 flex-grow gap-4 lg:gap-8">
        <section className="w-full lg:w-3/4 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-2">
                <h1 className="font-bold text-2xl lg:text-3xl">{job.name}</h1>
                <div className="space-y-1">
                  <p className="text-sm">Location: <span className="font-semibold">{job.city}, {job.state}</span></p>
                  <p className="text-sm">Email: <span className="font-semibold">{job.email}</span></p>
                  <p className="text-sm">Phone: <span className="font-semibold">{job.countryCode} {job.phone}</span></p>
                  <p className="text-sm">Salary: <span className="font-semibold">₹{job.salary[0]} - ₹{job.salary[1]}</span></p>
                  <p className="text-sm">Experience: <span className="font-semibold">{job.experience[0]}-{job.experience[1]} years</span></p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  className={`px-4 py-2 text-white rounded-md text-center text-sm font-semibold font-sans transition-colors ${job.applied
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-primary hover:bg-primary-dark'
                    }`}
                  onClick={!job.applied ? handleApplyJob : null}
                  disabled={job.applied}
                >
                  {job.applied ? 'Applied' : 'Apply Now'}
                </button>
                <div className="flex gap-4">
                  <CiBookmarkCheck className="text-2xl text-gray-700 cursor-pointer hover:text-primary transition-colors" />
                  <CiShare2 className="text-2xl text-gray-700 cursor-pointer hover:text-primary transition-colors" />
                </div>
              </div>

            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <h5 className="text-lg font-semibold text-gray-700">Job Description</h5>
            <p className="text-sm lg:text-base whitespace-pre-wrap">{job.description}</p>

            <h5 className="text-lg font-semibold text-gray-700 mt-6">Requirements</h5>
            <ul className="list-disc pl-5 space-y-2">
              {job.requirements.map((requirement, index) => (
                <li key={index} className="text-sm lg:text-base">{requirement}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <h5 className="text-lg font-semibold text-gray-700">Company Details</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm lg:text-base">
              <div className="space-y-2">
                <p><span className="font-medium">Email:</span> {company.email}</p>
                <p><span className="font-medium">Phone:</span> {company.phone}</p>
                <p><span className="font-medium">Status:</span> {job.status}</p>
              </div>
              <div className="space-y-2">
                <p><span className="font-medium">Posted:</span> {new Date(job.postedAt).toLocaleDateString()}</p>
                <p><span className="font-medium">Location:</span> {job.city}, {job.state}</p>
                <p><span className="font-medium">Country:</span> {job.country}</p>
              </div>
            </div>
          </div>
        </section>

        <aside className="w-full lg:w-1/4 space-y-4">
          <h2 className="text-xl font-semibold">Related Jobs</h2>
          <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto overflow-x-hidden pr-2">
            {/* Add related jobs here if available */}
          </div>
        </aside>
      </main>
    </div>
  );
};

export default JobDetails;