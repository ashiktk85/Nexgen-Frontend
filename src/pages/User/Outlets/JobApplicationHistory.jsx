import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@mui/material"
import { MoreVertical } from "lucide-react"
import { useEffect } from "react"
import useRequestUser from "@/hooks/useRequestUser"

export default function JobApplicationHistory() {
  const { data, loading, error, sendRequest } = useRequestUser()

  const fetchData=async()=>{
    sendRequest({
      url: `/job-applications/${userId}`,
      method: "POST",
      data: applicationStatusData,
      onSuccess: (data) => {
        setSelectedData(null);
        fetchApplications();
        console.log("Application status successfully:", data);
      },
      onError: (err) =>
        console.error("Error application status change:", err),
  })}
    useEffect(()=>{
      fetchData()
    },[])

  return (
    <div className="max-w-5xl mx-auto p-4 mt-16">
      <h1 className="text-2xl font-semibold mb-4">My Jobs</h1>

      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="recent">Recent Apply</TabsTrigger>
          <TabsTrigger value="hired" >Hired</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="flex items-start gap-4 p-4 border rounded-lg">
              <img
                src={job.logo || "/placeholder.svg"}
                alt={`${job.company} logo`}
                width={48}
                height={48}
                className="rounded"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium">{job.title}</h3>
                <p className="text-sm text-muted-foreground">{job.company}</p>
                <p className="text-sm text-muted-foreground">{job.location}</p>
                {job.lastModified ? (
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-muted-foreground">Last modified {job.lastModified}</p>
                    <span className="text-blue-600">·</span>
                    <div className="flex items-center gap-1">
                      <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-AIqYThYSI1nCRNNRtXwIGRnMnyx4Cm.png"
                        alt="LinkedIn"
                        width={16}
                        height={16}
                      />
                      <span className="text-sm text-blue-600">Easy Apply</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">No longer accepting applications</p>
                )}
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </Tabs>
    </div>
  )
}

const jobs = [
  {
    id: 1,
    title: "Python Developer",
    company: "Acorn Globus",
    location: "India (Remote)",
    logo: "/placeholder.svg?height=48&width=48",
    status: "closed",
  },
  {
    id: 2,
    title: "Python developer",
    company: "Algorithma",
    location: "Kochi (On-site)",
    logo: "/placeholder.svg?height=48&width=48",
    lastModified: "1mo ago",
    status: "active",
  },
  {
    id: 3,
    title: "Junior Full Stack Developer",
    company: "Troibits",
    location: "India (Remote)",
    logo: "/placeholder.svg?height=48&width=48",
    status: "closed",
  },
  {
    id: 4,
    title: "Django Developer",
    company: "Deepsense Digital",
    location: "Chennai (On-site)",
    logo: "/placeholder.svg?height=48&width=48",
    status: "closed",
  },
  {
    id: 5,
    title: "Software Engineer - Python",
    company: "Aviso AI",
    location: "India (Remote)",
    logo: "/placeholder.svg?height=48&width=48",
    status: "closed",
  },
]

