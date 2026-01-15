import type { Experience } from "../types/experiences";

export const EXPERIENCES: Experience[] = [
  {
    id: "2nf-software",
    companyName: "2NF Software",
    companyLogo: "/assets/images/companies/2nf.svg",
    isCurrentEmployer: false,
    positions: [
      {
        id: "frontend-2nf",
        title: "Frontend Developer",
        employmentPeriod: {
          start: "12.2023",
          end: "05.2024",
        },
        employmentType: "Full-time",
        description: `- Developed and maintained user interfaces for internal systems and client-facing products.
- Implemented reusable UI components to ensure consistency and scalability.
- Collaborated with backend developers to integrate APIs and handle data flow.
- Focused on performance, maintainability, and clean UI structure.`,
        icon: "code",
        skills: [
          "Vue.js",
          "Nuxt.js",
          "Ant Design Vue",
          "GitHub",
          "SVN",
          "REST API Integration",
          "Teamwork",
        ],
      },
      {
        id: "backend-2nf",
        title: "Backend Developer",
        employmentPeriod: {
          start: "06.2024",
          end: "06.2025",
        },
        employmentType: "Full-time",
        description: `- Built and maintained backend services and RESTful APIs.
- Designed API logic to support frontend features and third-party integrations.
- Worked with cloud infrastructure to deploy and operate backend services.
- Integrated external services such as SMS and communication APIs.`,
        icon: "code",
        skills: [
          "Ruby",
          "Ruby on Rails",
          "RESTful API Design",
          "AWS",
          "Twilio",
          "Database Design",
          "System Thinking",
        ],
      },
    ],
  },
  {
    id: "career-break",
    companyName: "Career Break",
    companyLogo: "/assets/images/companies/not_found.svg",
    isCurrentEmployer: true,
    positions: [
      {
        id: "job-seeking",
        title: "Self-learning",
        employmentPeriod: {
          start: "07.2025",
          end: "Present",
        },
        employmentType: "Career Break",
        description: `- Actively seeking new opportunities in Frontend / Backend / Fullstack roles.
- Reviewing and strengthening core knowledge in web development.
- Building and refining personal projects and portfolio.
- Exploring new technologies and improving problem-solving and system thinking skills.`,
        icon: "business",
        skills: [
          "Self-learning",
          "Problem Solving",
          "System Thinking",
          "Research",
          "Portfolio Building",
        ],
      },
    ],
  },
];
