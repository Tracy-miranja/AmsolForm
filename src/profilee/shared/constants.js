export const completionFields = [
  "firstName", "lastName", "email", "phoneNumber", "nationality",
  "location", "specialization", "highestEducationLevel", "savedCvFileId",
];

export const ACADEMIC_LEVELS = [
  "Doctorate (PhD)", "Master's Degree", "Postgraduate Diploma", "Bachelor's Degree",
  "Associate's Degree", "Diploma", "Professional Certificate", "Certificate", "Others",
];

// Used by the Professional Summary modal (kept exactly as it was)
export const HIGHEST_EDU_LEVELS = [
  "Doctorate(PhD)", "Master's Degree", "Postgraduate Diploma", "Bachelor's Degree",
  "Associate's Degree", "Diploma", "Professional Certificate", "Certificate", "others",
];

export const INDUSTRIES = [
  "Technology & ICT", "Finance & Banking", "Insurance", "Healthcare & Pharmaceuticals",
  "Education & Training", "Engineering & Construction", "Manufacturing & Production",
  "Retail & Consumer Goods", "Hospitality & Tourism", "Media & Communications",
  "Telecommunications", "Government & Public Sector", "Agriculture & Agribusiness",
  "Human Resources & Recruitment", "Legal & Professional Services",
  "Real Estate & Property Management", "Energy & Utilities",
  "Logistics, Transportation & Supply Chain", "Mining, Oil & Gas", "Non-Profit & NGO",
  "Arts, Entertainment & Recreation", "Environmental & Sustainability Services",
  "Security Services", "Other",
];

export const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export const FALLBACK_KENYA_COUNTIES = [
  "Baringo","Bomet","Bungoma","Busia","Elgeyo-Marakwet","Embu","Garissa","Homa Bay","Isiolo",
  "Kajiado","Kakamega","Kericho","Kiambu","Kilifi","Kirinyaga","Kisii","Kisumu","Kitui","Kwale",
  "Laikipia","Lamu","Machakos","Makueni","Mandera","Marsabit","Meru","Migori","Mombasa","Murang'a",
  "Nairobi","Nakuru","Nandi","Narok","Nyamira","Nyeri","Samburu","Siaya","Taita-Taveta",
  "Tana River","Tharaka-Nithi","Trans Nzoia","Turkana","Uasin Gishu","Vihiga","Wajir","West Pokot",
];

export const REQUIRED_FOR_APPLY = [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "email", label: "Email" },
  { key: "phoneNumber", label: "Phone Number" },
  { key: "whatsAppNo", label: "WhatsApp Number" },
  { key: "nationality", label: "Nationality" },
  { key: "location", label: "Current Location" },
  { key: "idNumber", label: "ID Number" },
  { key: "specialization", label: "Specialization (Professional Summary)" },
  { key: "highestEducationLevel", label: "Highest Education Level" },
  { key: "savedCvFileId", label: "Uploaded CV" },
  { key: "workExperience", label: "Work Experience (at least one entry)" },
];

export const PAGE_TITLES = {
  profile: "Profile Update", dashboard: "Dashboard", jobs: "Jobs", cv: "Uploaded CV",
  saved: "Saved Jobs", settings: "Job Settings", applications: "Applications",
  messages: "Messages", terms: "Terms & Conditions",
};
