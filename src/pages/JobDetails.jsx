import React from 'react';
import Navbar from '../components/User/Navbar';


const JobDeatils = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <header className="flex-shrink-0">
        <Navbar />
      </header>

      {/* Main Content */}
      <main className="flex overflow-y-auto bg-gray-100 p-6 h-full gap-2">
        <section className='w-3/4 h-full bg-gray-300 '>

        <div className='w-full  h-[24vh] flex gap-2'>
            <div className='w-3/5 h-full bg-green-100 p-3'>
                <h1 className='font-bold text-2xl'>UI/UX Designer</h1>
                <div>
                    
                </div>
            </div>
            <div className='w-2/5 h-full bg-green-100'>
                <button className='w-32 h-12 bg-primary text-white rounded-md text-center text-md font-semibold font-sans'>
                    Apply Now
                </button>
            </div>
        </div>


        </section>
        <section className='w-1/4 h-full bg-gray-300'></section>
      </main>
    </div>
  );
};

export default JobDeatils;
