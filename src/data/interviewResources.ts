export interface InterviewExternalResource {
  organization: string;
  title: string;
  description: string;
  url: string;
  buttonLabel: string;
  category: string;
  /** Rendered directly under this one card only. */
  note?: string;
}

// Every link below was opened and confirmed live before publishing. If an
// organization later moves or retires a page, update the url here rather
// than touching the printed book (see the reader note on the page itself).
export const interviewExternalResources: InterviewExternalResource[] = [
  {
    organization: 'U.S. Office of Personnel Management (OPM)',
    title: 'Structured Interviews',
    description: 'Official guidance explaining structured interviews, job-related competencies, consistent questioning, and standardized candidate assessment.',
    url: 'https://www.opm.gov/policy-data-oversight/assessment-and-selection/structured-interviews/',
    buttonLabel: 'Visit OPM Resource',
    category: 'Structured Interviews',
  },
  {
    organization: 'CIPD',
    title: 'Selection Methods',
    description: 'Professional guidance covering interview methods, structured selection, work samples, assessment centers, and fair candidate evaluation.',
    url: 'https://www.cipd.org/uk/knowledge/factsheets/selection-factsheet/',
    buttonLabel: 'Visit CIPD Resource',
    category: 'Recruitment & Selection',
  },
  {
    organization: 'LinkedIn Talent Solutions',
    title: 'Future of Recruiting 2025',
    description: 'Research and insights into changing recruitment practices, skills-based hiring, quality of hire, and evolving talent priorities.',
    url: 'https://www.linkedin.com/business/talent/blog/talent-acquisition/future-of-recruiting-2025',
    buttonLabel: 'Visit LinkedIn Resource',
    category: 'Recruiting Trends',
  },
  {
    organization: 'LinkedIn Talent Solutions',
    title: 'How to Conduct an Effective Skills-Based Interview',
    description: 'Practical guidance on skills-first interviewing, behavioral questions, and evaluating candidates through evidence rather than credentials alone.',
    url: 'https://www.linkedin.com/business/talent/blog/talent-acquisition/how-to-conduct-effective-skills-based-interview',
    buttonLabel: 'Visit LinkedIn Resource',
    category: 'Skills-Based Hiring',
  },
  {
    organization: 'McKinsey & Company Careers',
    title: 'Interviewing at McKinsey',
    description: 'Candidate guidance covering personal experience interviews, problem-solving interviews, and preparation for structured selection processes.',
    url: 'https://www.mckinsey.com/careers/interviewing/en',
    buttonLabel: 'Visit McKinsey Careers',
    category: 'Case & Experience Interviews',
  },
  {
    organization: 'Microsoft Careers',
    title: 'How We Hire',
    description: "Official information about Microsoft's hiring process, interview preparation, candidate expectations, and skills-based assessment.",
    url: 'https://careers.microsoft.com/v2/global/en/hiring-tips',
    buttonLabel: 'Visit Microsoft Careers',
    category: 'Hiring Process',
  },
  {
    organization: 'Microsoft Careers',
    title: 'Technical Interviewing',
    description: 'Official guidance for candidates preparing for technical interviews, including problem-solving, technical thinking, and communication.',
    url: 'https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing.html',
    buttonLabel: 'View Technical Interview Guidance',
    category: 'Technical Interviews',
  },
  {
    organization: 'Microsoft Careers',
    title: 'Interview Tips for All Roles',
    description: 'Practical interview guidance covering preparation, clarifying questions, assumptions, reasoning, and structured examples.',
    url: 'https://careers.microsoft.com/v2/global/en/hiring-tips/interview-tips.html',
    buttonLabel: 'View Microsoft Interview Tips',
    category: 'Interview Preparation',
  },
  {
    organization: 'U.S. Equal Employment Opportunity Commission (EEOC)',
    title: 'Prohibited Employment Policies/Practices and Pre-Employment Inquiries',
    description: 'U.S.-specific official information regarding employment practices, pre-employment inquiries, and protected characteristics.',
    url: 'https://www.eeoc.gov/prohibited-employment-policiespractices',
    buttonLabel: 'Visit EEOC Resource',
    category: 'Employment Guidance',
    note: 'Employment laws vary by country and jurisdiction. This resource provides U.S.-specific guidance and should not be treated as universal legal advice.',
  },
  {
    organization: 'HireVue',
    title: 'Candidate FAQ',
    description: 'Information for candidates preparing for digital, recorded, and on-demand interview experiences.',
    url: 'https://www.hirevue.com/candidates/faq',
    buttonLabel: 'Visit HireVue Candidate Resources',
    category: 'Video Interviews',
  },
  {
    organization: 'Amazon Jobs',
    title: 'Interview Preparation (Behavioral Interviewing)',
    description: 'Official interview-preparation guidance covering behavioral questions, STAR-based answers, examples of success and failure, and evidence-based responses.',
    url: 'https://amazon.jobs/content/en/how-we-hire/tpm-interview-prep',
    buttonLabel: 'Visit Amazon Interview Prep',
    category: 'Behavioral Interviews',
  },
];

export interface BookTool {
  title: string;
  points: string[];
  buttonLabel: string;
  /** Left unset until a real file exists — the card shows "Coming Soon"
   * rather than a fake download link. */
  fileUrl?: string;
}

export const interviewBookTools: BookTool[] = [
  { title: 'STAR-R Story Builder', points: ['Situation', 'Task', 'Action', 'Result', 'Reflection'], buttonLabel: 'Download STAR-R Worksheet' },
  { title: '8-Story Interview Bank', points: ['Achievement', 'Problem solving', 'Conflict', 'Failure and learning', 'Leadership', 'Initiative', 'Adaptability', 'Influence and communication'], buttonLabel: 'Build Your Story Bank' },
  { title: 'Job Description Decoder', points: ['Employer priorities', 'Required skills', 'Evidence needed', 'Experience gaps', 'Likely risk questions'], buttonLabel: 'Download Job Description Decoder' },
  { title: '30-60-90 Day Interview Planner', points: [], buttonLabel: 'Download Planner' },
  { title: 'Interview-Day Cheat Sheet', points: [], buttonLabel: 'Download Cheat Sheet' },
];
