export type EducationPeriod = {
  /** Start year (e.g., "2021" or "09.2021"). */
  start: string;
  /** End year; leave undefined for "Present" or ongoing. */
  end?: string;
};

export type Education = {
  id: string;
  /** Name of the institution (e.g., "Harvard University"). */
  institutionName: string;
  /** URL to the institution logo (absolute URL or path under /public). */
  institutionLogo?: string;
  /** Degree earned (e.g., "Bachelor of Science"). */
  degree: string;
  /** Field of study or major (e.g., "Computer Science"). */
  major: string;
  /** Time period of education. */
  period: EducationPeriod;
  /** GPA or grade (e.g., "3.8/4.0" or "Distinction"). */
  grade?: string;
  /** Description of achievements, coursework, etc. */
  description?: string;
  /** Relevant skills or subjects learned. */
  skills?: string[];
  /** Whether the education item is expanded by default in the UI. */
  isExpanded?: boolean;
  /** Marks as current education for highlighting. */
  isCurrent?: boolean;
};
