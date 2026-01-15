import type { Education } from "../types/education";

export const EDUCATION: Education[] = [
  {
    id: "thuyloi-university",
    institutionName: "Thuy Loi University",
    institutionLogo: "/assets/images/institutions/thuyloi.webp",
    degree: "Bachelor's Degree",
    major: "Information Systems",
    period: {
      start: "2021",
      end: "2025",
    },
    grade: "Distinction (Very Good)",
    description: `- Bachelor's degree in Information Systems, Faculty of Information Technology.
- Graduated with Distinction (Very Good).
- Achieved high grades in core and specialized subjects.`,
    skills: [
      "Information Systems",
      "System Analysis & Design",
      "Database Design",
      "Software Engineering",
      "UI/UX Fundamentals",
      "Teamwork",
      "Self-learning",
    ],
    isExpanded: false,
    isCurrent: false,
  },
];
