import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
// import { Star } from 'lucide-react'
import { CiStar } from "react-icons/ci";
import Navbar from "../components/User/Navbar";
import candidate from "../assets/Candidate.png";
import employer from "../assets/Employer.png";
import { FaLocationDot } from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa";

export default function Home() {
  const jobs = [
    {
      id: 1,
      title: "Product Designer",
      company: "Tech Company",
      logo: candidate,
      location: "Kochi, kerala",
    },
    {
      id: 2,
      title: "UX/UI Designer",
      company: "Design Studio",
      logo: candidate,
      location: "Kochi, kerala",
    },
    {
      id: 3,
      title: "Senior Designer",
      company: "Creative Agency",
      logo: candidate,
      location: "Kochi, kerala",
    },
  ];

  const companies = [
    {
      id: 1,
      name: "Tech Company",
      rating: 4.5,
      logo: { candidate },
      location: "San Francisco, CA",
    },
    {
      id: 2,
      name: "Design Studio",
      rating: 4.7,
      logo: "/placeholder.svg?height=40&width=40",
      location: "New York, NY",
    },
    {
      id: 3,
      name: "Creative Agency",
      rating: 4.3,
      logo: "/placeholder.svg?height=40&width=40",
      location: "London, UK",
    },
    {
      id: 4,
      name: "Digital Agency",
      rating: 4.6,
      logo: "/placeholder.svg?height=40&width=40",
      location: "Berlin, DE",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Nexgen</span>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/jobs" className="text-sm font-medium">
              Jobs
            </Link>
            <Link href="/companies" className="text-sm font-medium">
              Companies
            </Link>
            <Button variant="default" size="sm">
              Sign In
            </Button>
          </nav>
        </div>
      </header> */}
      <Navbar />

      <main className="w-full py-8">
        <section className="mb-12 px-10">
          <h2 className="text-2xl font-bold text-center mb-8">
            Start Your Job Journey
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="flex items-center p-6">
                <img
                  src={candidate}
                  alt="Candidate"
                  className="mb-4 w-[150px] lg:w-[200px]"
                />
                <div>
                  <h3 className="text-lg font-bold mb-2 ">I am a Candidate</h3>
                  <h3 className="text-md font-semibold mb-2 text-gray-500">
                    Find your perfect job
                  </h3>
                  <Button variant="contained">Browse Jobs</Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6 gap-2">
                <img
                  src={employer}
                  alt="Employer"
                  className="mb-4 w-[150px] lg:w-[200px]"
                />
                <div>
                  <h3 className="text-lg font-bold mb-2 ">I am an Employer</h3>
                  <h3 className="text-md font-semibold mb-2 text-gray-500">
                    Find your perfect job
                  </h3>
                  <Button variant="contained">Post Jobs</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12 px-10">
          <h2 className="text-2xl font-bold mb-6 text-center">Top Jobs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Card key={job.id}>
                <CardContent className="p-6">
                  <div className="flex justify-start items-center gap-3 mb-4">
                    <img
                      src={job.logo}
                      alt={job.company}
                      width={40}
                      height={40}
                      className="rounded"
                    />
                    <p className="text-sm text-muted-foreground  text-gray-500">
                      {job.company}
                    </p>
                  </div>
                  <h3 className="font-semibold mb-2">{job.title}</h3>
                  <div className=" flex items-center gap-2 mb-4">
                    <FaLocationDot className="w-4 h-4 fill-gray-500" />
                    <p className="text-sm text-muted-foreground  text-gray-500">
                      {job.location}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="contained" size="sm" className="">
                      Apply Now
                    </Button>
                    <div className=" flex items-center gap-2">
                      <FaRegClock className="w-4 h-4 fill-gray-500" />
                      <p className="text-sm text-muted-foreground text-gray-500">
                        {job.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="relative py-20 mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" />
          <div className="relative text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Connecting Talent With Opportunity, Seamlessly.
            </h2>
          </div>
        </section>

        <section className="px-10 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Top Companies</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companies.map((company) => (
              <Card key={company.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <img
                      src={company.logo}
                      alt={company.name}
                      width={40}
                      height={40}
                      className="rounded"
                    />
                    <div className="flex items-center">
                      <CiStar className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm ml-1">{company.rating}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">{company.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {company.location}
                  </p>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    View Jobs
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
