/**
 * Course catalogue — edit this file to add / change courses. No backend needed.
 *
 * A course:   { id, title, category, level, minutes, description, status?, lessons[] }
 *   status: "soon"  -> shows a "Coming soon" card (lessons can be empty)
 * A lesson:   { id, title, minutes, content?: [paragraphs], bullets?: [..], videoUrl?: "https://..." , linkUrl?: "https://..." }
 *   - content/bullets render as text inside the app
 *   - videoUrl / linkUrl show a "Watch video" / "Open resource" button
 */
export const CATEGORIES = ["All", "CV & Applications", "Interviews", "Career Growth", "Digital Skills"];

export const COURSES = [
  {
    id: "cv-shortlist",
    title: "Write a CV That Gets Shortlisted",
    category: "CV & Applications",
    level: "Beginner",
    minutes: 20,
    description: "Learn how recruiters read a CV in seconds and how to make yours pass both the human and the software.",
    lessons: [
      {
        id: "l1", title: "How recruiters really read your CV", minutes: 4,
        content: [
          "A recruiter often spends less than 30 seconds on a first look. They scan the top third of page one: your name, current or latest role, and a short summary.",
          "If they can't see in that time that you match the job, the CV moves to the 'no' pile, even when you are qualified.",
        ],
        bullets: ["Put your strongest, most relevant information first.", "Use a clean layout: one column, clear headings, normal fonts.", "Aim for 2 pages maximum (1 page if you have under 5 years' experience)."],
      },
      {
        id: "l2", title: "Your professional summary", minutes: 5,
        content: ["The summary is 3-4 lines at the top that answer: Who are you? What are you good at? What do you bring?"],
        bullets: [
          "Formula: [Job title] with [X years] in [field]. Skilled in [2-3 skills]. Known for [one result].",
          "Example: 'Accountant with 5 years in retail finance. Skilled in reconciliations, payroll and Excel reporting. Cut month-end close time from 8 days to 5.'",
          "Avoid empty phrases like 'hardworking team player'. Show it with facts instead.",
        ],
      },
      {
        id: "l3", title: "Turn duties into achievements", minutes: 6,
        content: ["Don't list what you were responsible for. Show what changed because of you."],
        bullets: [
          "Weak: 'Responsible for customer service.'",
          "Strong: 'Resolved 40+ customer queries daily with a 95% satisfaction score.'",
          "Start each bullet with an action verb: led, built, reduced, increased, trained, saved.",
          "No exact number? Use a safe estimate or scale: team size, budget, clients, frequency.",
        ],
      },
      {
        id: "l4", title: "Beat the ATS (CV scanning software)", minutes: 5,
        content: ["Many companies use software that scans CVs for keywords before a human sees them."],
        bullets: [
          "Copy exact skill words from the job advert (if you really have them).",
          "Use standard headings: Work Experience, Education, Skills.",
          "Avoid tables, text boxes, images and headers/footers: the software can misread them.",
          "Save as PDF (or DOCX if the advert asks) and name it: FirstName_LastName_CV.",
        ],
      },
    ],
  },
  {
    id: "interview-confidence",
    title: "Interview Confidence Bootcamp",
    category: "Interviews",
    level: "Beginner",
    minutes: 25,
    description: "Prepare for common questions, tell your story with the STAR method, and handle nerves on the day.",
    lessons: [
      {
        id: "l1", title: "Prepare before you walk in", minutes: 5,
        bullets: [
          "Research the company: what they do, recent news, their values.",
          "Re-read the job advert and pick 3 requirements you can prove with examples.",
          "Prepare 3-4 stories from your work or studies that show results.",
          "Plan your route and arrive 10-15 minutes early (or test your link for online interviews).",
        ],
      },
      {
        id: "l2", title: "The STAR method", minutes: 7,
        content: ["For 'Tell me about a time when...' questions, use STAR so your answer is clear and short (about 90 seconds)."],
        bullets: [
          "Situation: set the scene in one or two sentences.",
          "Task: what was your responsibility?",
          "Action: what YOU did, step by step (use 'I', not only 'we').",
          "Result: what happened, with a number if possible. Add what you learned.",
        ],
      },
      {
        id: "l3", title: "Answering the classic questions", minutes: 8,
        bullets: [
          "'Tell me about yourself': 60 seconds. Present (your role now), past (key experience), future (why this job).",
          "'Why do you want this job?': link their needs to your strengths.",
          "'What is your weakness?': a real, small weakness plus what you are doing to improve it.",
          "'Why are you leaving?': stay positive. Talk about growth, never complain about your employer.",
        ],
      },
      {
        id: "l4", title: "Salary questions and your questions", minutes: 5,
        bullets: [
          "Research the typical salary range for the role before the interview.",
          "If asked early, you can say: 'I'm flexible and focused on the right fit. What range is budgeted for this role?'",
          "Always prepare 2-3 questions: What does success look like in the first 6 months? What are the biggest challenges of this role?",
          "Send a short thank-you email within 24 hours.",
        ],
      },
    ],
  },
  { id: "linkedin-africa", title: "LinkedIn for the African Job Market", category: "Career Growth", level: "Beginner", minutes: 30, status: "soon", description: "Build a profile that recruiters find, and network without feeling awkward.", lessons: [] },
  { id: "salary-negotiation", title: "Salary Negotiation Basics", category: "Career Growth", level: "Intermediate", minutes: 25, status: "soon", description: "Know your worth, research the range, and ask with confidence.", lessons: [] },
  { id: "excel-job-seekers", title: "Excel for Job Seekers", category: "Digital Skills", level: "Beginner", minutes: 60, status: "soon", description: "The spreadsheet skills employers ask for most, explained step by step.", lessons: [] },
  { id: "workplace-communication", title: "Communication at Work", category: "Career Growth", level: "Beginner", minutes: 30, status: "soon", description: "Write clear emails, speak up in meetings and handle feedback.", lessons: [] },
];
