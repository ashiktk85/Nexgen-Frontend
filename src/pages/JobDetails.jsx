import React from 'react';
import Navbar from '../components/User/Navbar';
import { CiShare2 } from "react-icons/ci";
import { CiBookmarkCheck } from "react-icons/ci";
import JobCard from '../components/User/JobCard';


const JobDeatils = () => {
  return (
<div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="flex-shrink-0">
        <Navbar />
      </header>

      {/* Main Content */}
      <main className="flex flex-col lg:flex-row p-4 lg:p-6 flex-grow gap-4 lg:gap-8">
        <section className='w-full lg:w-3/4 space-y-6'>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
              <div className='space-y-2'>
                <h1 className='font-bold text-2xl lg:text-3xl'>UI/UX Designer</h1>
                <div className='space-y-1'>
                  <h2 className='text-xl'>tenX solutions</h2>
                  <p className='text-sm'>Location: <span className='font-semibold'>Canada</span></p>
                  <p className='text-sm'>Email: <span className='font-semibold'>tenx@gmail.com</span></p>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <button className='px-4 py-2 bg-primary text-white rounded-md text-center text-sm font-semibold font-sans hover:bg-primary-dark transition-colors'>
                  Apply Now
                </button>
                <div className='flex gap-4'>
                  <CiBookmarkCheck className='text-2xl text-gray-700 cursor-pointer hover:text-primary transition-colors' />
                  <CiShare2 className='text-2xl text-gray-700 cursor-pointer hover:text-primary transition-colors' />
                </div>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-md p-6 space-y-4'>
            <h5 className='text-lg font-semibold text-gray-700'>Job Description</h5>
            <div className='space-y-2 text-sm lg:text-base'>
              <p>A supportive manager who cares about your well-being and is invested in your professional growth.</p>
              <p>A culture of continuous learning with clear targets and feedback.</p>
              <p>A global company with over 2600 employees located in more than 26 countries, including offices in 3 countries.</p>
            </div>
            <div className='space-y-2 text-sm lg:text-base'>
            <h5 className='text-lg font-semibold text-gray-700'>Requirements</h5>
            <p className='text-sm lg:text-base'>
              As a UX Designer on our team, you will shape user experiences by leading the design of key features and projects.
              Your responsibilities include defining user experience flows, developing new product concepts, and crafting user stories.
              You will design detailed UI layouts, create benchmarks, and develop high-fidelity prototypes while documenting UX and UI strategies.
              Collaborating with technical teams, you will transform designs into impactful, industry-leading products. This role combines creativity
              and problem-solving to create meaningful user experiences. Your journey with us is an opportunity to drive innovation and make a significant impact.
            </p>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-md p-6 space-y-4'>
            <h5 className='text-lg font-semibold text-gray-700'>Overview</h5>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm lg:text-base'>
              <div className='space-y-2'>
                <p><span className='font-medium'>Size:</span> 510 to 1000 Employees</p>
                <p><span className='font-medium'>Type:</span> Company - Private</p>
                <p><span className='font-medium'>Sector:</span> Financial Service</p>
              </div>
              <div className='space-y-2'>
                <p><span className='font-medium'>Founded:</span> 1999</p>
                <p><span className='font-medium'>Industry:</span> Financial Transaction</p>
                <p><span className='font-medium'>Revenue:</span> $5 to $25 million</p>
              </div>
            </div>
          </div>
        </section>
        
        <aside className='w-full lg:w-1/4 space-y-4'>
          <h2 className='text-xl font-semibold'>Related Jobs</h2>
          <div className='space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto overflow-x-hidden pr-2'>
            {Array.from({length: 3}).map((_, index) => (
              <JobCard key={index} />
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
};

export default JobDeatils;
