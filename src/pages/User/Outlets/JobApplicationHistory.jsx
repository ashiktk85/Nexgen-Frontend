import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@mui/material";
import { MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";
import useRequestUser from "@/hooks/useRequestUser";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { format } from "date-fns";

export default function JobApplicationHistory() {
  const { data, loading, error, sendRequest } = useRequestUser();
  const userData = useSelector((state) => state.user.seekerInfo);
  const [allJobs, setAllJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])

  const formatDate = (isoDate) => {
    if (!isoDate) return "Unknown date";
    return format(new Date(isoDate), "do MMMM yyyy, h:mm a"); // Example: "17th February 2025, 8:46 AM"
  };

  const handleTab = (value) =>{
    console.log('value', value);
    let filtered = [];
    
    switch(value){
      case "recent":
        filtered = allJobs;
        break;
      case "hired":
        filtered = allJobs.filter((job)=>job.applicationStatus === "Hired");
        break;
      case "in-progress":
        filtered = allJobs.filter((job)=>job.applicationStatus === "Pending");
        break;
      case "rejected":
        filtered = allJobs.filter((job)=>job.applicationStatus === "Rejected");
        break;
      default:
        filtered = allJobs;
    }
    setFilteredJobs(filtered)
  }

  const fetchData = async () => {
    if (userData) {
      sendRequest({
        url: `/job-applications/${userData.userId}`,
        method: "GET",
        onSuccess: (data) => {
          console.log("Job applications fetched successfully", data);
          console.log('data',data)
          setAllJobs(data.allApplicationsOfAUser)
          setFilteredJobs(data.allApplicationsOfAUser)
        },
        onError: (err) =>
          console.error("Error job applications:", err),
      });
    }else{
      toast.error('User data not found in state.')
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="md:w-3/6 w-full mx-auto p-4 mt-16">
      <h1 className="text-2xl font-semibold mb-4">My Jobs</h1>

      <Tabs defaultValue="recent" onValueChange={ handleTab } className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="recent">Recent Apply</TabsTrigger>
          <TabsTrigger value="hired">Hired</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <div className="space-y-4">
          {filteredJobs.map((job, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 border rounded-lg"
            >
              <img
                src={job?.companyLogo || "/placeholder.svg"}
                alt={`${job?.companyName} logo`}
                width={48}
                height={48}
                className="rounded"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium">{job?.jobTitle}</h3>
                <p className="text-sm text-muted-foreground">{job?.companyName}</p>
                <p className="text-sm text-muted-foreground">{`${job?.city}, ${job?.country}`}</p>
                <p className="text-sm text-muted-foreground">
                      Applied on {formatDate(job?.appliedAt)}
                    </p>
                {job.jobStatus ===  'open' ? (
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-muted-foreground">
                      Last modified {formatDate(job?.updatedAt)}
                    </p>
                    <span className="text-blue-600">·</span>
                    <div className="flex items-center gap-1">
                      {/* <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-AIqYThYSI1nCRNNRtXwIGRnMnyx4Cm.png"
                        alt="LinkedIn"
                        width={16}
                        height={16}
                      /> */}
                      <span className={(job.applicationStatus === 'Hired')?"text-sm text-green-600":(job.applicationStatus === 'Pending')? "text-sm text-yellow-300": "text-sm text-red-500"}>{job.applicationStatus}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    No longer accepting applications
                  </p>
                )}
              </div>
              {/* <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button> */}
            </div>
          ))}
        </div>
      </Tabs>
    </div>
  );
}

// const jobs = [
//   {
//     id: 1,
//     title: "Python Developer",
//     company: "Acorn Globus",
//     location: "India (Remote)",
//     logo: "/placeholder.svg?height=48&width=48",
//     status: "closed",
//   },
//   {
//     id: 2,
//     title: "Python developer",
//     company: "Algorithma",
//     location: "Kochi (On-site)",
//     logo: "/placeholder.svg?height=48&width=48",
//     lastModified: "1mo ago",
//     status: "active",
//   },
//   {
//     id: 3,
//     title: "Junior Full Stack Developer",
//     company: "Troibits",
//     location: "India (Remote)",
//     logo: "/placeholder.svg?height=48&width=48",
//     status: "closed",
//   },
//   {
//     id: 4,
//     title: "Django Developer",
//     company: "Deepsense Digital",
//     location: "Chennai (On-site)",
//     logo: "/placeholder.svg?height=48&width=48",
//     status: "closed",
//   },
//   {
//     id: 5,
//     title: "Software Engineer - Python",
//     company: "Aviso AI",
//     location: "India (Remote)",
//     logo: "/placeholder.svg?height=48&width=48",
//     status: "closed",
//   },
// ];
