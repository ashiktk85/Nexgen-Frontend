import React, { useState } from "react";
import ListingTable from "../../../components/common/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateJobForm from "@/components/Employer/CreateJobForm";
import Switch from "@mui/material/Switch";

const initialDummyUsers = [
  {
    id: "1",
    title: "Software Engineer",
    email: "hr@techcorp.com",
    phone: "1234567890",
    countryCode: "+91",
    location: "Bangalore, India",
    experienceRequired: [1, 3],
    description:
      "We are looking for a passionate software engineer to join our dynamic team. You will work on cutting-edge projects and contribute to our innovative software solutions.",
    requirements:
      "Proficiency in JavaScript, React, and Node.js. Familiarity with Agile methodologies and version control tools like Git.",
    active: true,
  },
  {
    id: "2",
    title: "Data Analyst",
    email: "recruitment@datasense.com",
    phone: "9876543210",
    countryCode: "+1",
    location: "New York, USA",
    experienceRequired: [2, 5],
    description:
      "Join our data analytics team to help transform data into actionable insights. Ideal candidates will have a strong background in data visualization and analysis.",
    requirements:
      "Experience with SQL, Python, and Tableau. Strong analytical and problem-solving skills.",
    active: false,
  },
  {
    id: "3",
    title: "Digital Marketing Specialist",
    email: "careers@marketmedia.com",
    phone: "5551234567",
    countryCode: "+44",
    location: "London, UK",
    experienceRequired: [3, 6],
    description:
      "We are hiring a digital marketing specialist to create, implement, and optimize our online marketing campaigns across various channels.",
    requirements:
      "Expertise in SEO, SEM, and social media marketing. Hands-on experience with Google Analytics and PPC campaigns.",
    active: true,
  },
  {
    id: "4",
    title: "Product Manager",
    email: "jobs@innovatepm.com",
    phone: "8765432109",
    countryCode: "+49",
    location: "Berlin, Germany",
    experienceRequired: [5, 10],
    description:
      "Lead our product development efforts and collaborate with cross-functional teams to deliver world-class products.",
    requirements:
      "Proven experience in product management. Strong understanding of market research and Agile development.",
    active: true,
  },
  {
    id: "5",
    title: "Graphic Designer",
    email: "designteam@creativespace.com",
    phone: "6677889900",
    countryCode: "+61",
    location: "Sydney, Australia",
    experienceRequired: [1, 4],
    description:
      "Join our creative team to design visually appealing content for various platforms, ensuring brand consistency and aesthetic appeal.",
    requirements:
      "Proficiency in Adobe Photoshop, Illustrator, and InDesign. A strong portfolio showcasing creative work.",
    active: false,
  },
  {
    id: "6",
    title: "Digital Marketing Specialist",
    email: "careers@marketmedia.com",
    phone: "5551234567",
    countryCode: "+44",
    location: "London, UK",
    experienceRequired: [3, 6],
    description:
      "We are hiring a digital marketing specialist to create, implement, and optimize our online marketing campaigns across various channels.",
    requirements:
      "Expertise in SEO, SEM, and social media marketing. Hands-on experience with Google Analytics and PPC campaigns.",
    active: true,
  },
];
const dummyColumns = (handleActiveToggle) => [
  { key: "title", label: "Title" },
  { key: "location", label: "Location" },
  {
    key: "active",
    label: "Active Status",
    render: (active, row) => (
      <>
        <span
          className={`px-2 py-1 rounded font-bold ${
            active ? "text-green-500" : "text-red-500"
          }`}
        >
          {active ? "Active" : "Inactive"}
        </span>

        <Switch
          checked={active}
          onChange={() => handleActiveToggle(row.id)} // Call the passed function with the row ID
          inputProps={{ "aria-label": "Active Status" }}
        />
      </>
    ),
  },
];

function JobList() {
  const [users, setUsers] = useState(initialDummyUsers); // State for users
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const handleEdit = (id) => {
    const user = users.find((user) => user.id === id);
    setSelectedData(user);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
    setIsDeleteDialogOpen(false);
  };

  const handleActiveToggle = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, active: !user.active } : user
      )
    );
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedData(null);
  };

  const formSubmittionURL = "http:localhost:3000/api/edit_job";

  return (
    <div className="my-6 px-2">
      <h1>Job List</h1>
      <div>
        <ListingTable
          users={users}
          columns={dummyColumns(handleActiveToggle)}
          rowsPerPage={5}
          onEdit={handleEdit}
          onDelete={(id) => {
            const user = users.find((user) => user.id === id);
            setSelectedData(user);
            setIsDeleteDialogOpen(true);
          }}
        />
      </div>

      {/* Edit Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[1000px] h-3/4 overflow-scroll">
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <CreateJobForm
              formSubmittionURL={formSubmittionURL}
              selectedData={selectedData}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Deletion confirmation modal */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="w-[1000px] overflow-scroll">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p>
              Are you sure you want to delete this job? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(selectedData?.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default JobList;
