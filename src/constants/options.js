export const KERALA_DISTRICTS = [
  "Ernakulam",
  "Thrissur",
  "Kottayam",
  "Alappuzha",
  "Pathanamthitta",
  "Idukki",
  "Malappuram",
  "Kozhikode",
  "Wayanad",
  "Kannur",
  "Kasaragod",
];

export const JOB_CATEGORIES = [
  "Chip-Level Android Technician",
  "Chip-Level iPhone Technician",
  "Android Mobile Repair Technician",
  "iPhone Repair Technician",
  "OCA Glass Changing Technician",
  "Edge Master Technician",
  "Mobile Software Expert",
  "Mobile Phone Sales Executive",
  "Mobile Service Center Manager",
  "Customer Support & Service Advisor",
  "Mobile Technician Faculty / Trainer",
  "Other",
];

export const CATEGORY_COLORS = {
  "Chip-Level": "bg-purple-100 text-purple-700",
  "Android Repair": "bg-green-100 text-green-700",
  "iPhone Repair": "bg-blue-100 text-blue-700",
  Sales: "bg-yellow-100 text-yellow-700",
  Software: "bg-indigo-100 text-indigo-700",
  Management: "bg-red-100 text-red-700",
};

export function getJobCategory(jobTitle = "") {
  const title = jobTitle.toLowerCase();
  if (title.includes("chip-level") || title.includes("chip level")) return "Chip-Level";
  if (title.includes("iphone")) return "iPhone Repair";
  if (title.includes("android")) return "Android Repair";
  if (title.includes("software")) return "Software";
  if (title.includes("sales")) return "Sales";
  if (title.includes("manager") || title.includes("management")) return "Management";
  return null;
}
