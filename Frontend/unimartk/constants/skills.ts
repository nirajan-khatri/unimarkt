import { Skill } from "@/modules/skills/types";

export const skills: Skill[] = [
  {
    skill_id: "17",
    status: "approved",
    module: "yoga",
    description: "Hatha yoga for stress relief and flexibility",
    charge_per_hour: "18.00",
    department: {
      id: "6",
      name: "Department of Sports Science",
    },
    degree: {
      id: "6",
      department: {
        id: "6",
        name: "Department of Sports Science",
      },
      name: "Bachelor Sports Science",
    },
    user: {
      id: "2",
      name: "Bob Lee",
      email: "bob@example.com",
      contact_number: "0987654321",
      role: 2,
    },
    available_time_week: [
      {
        day: "Tuesday",
        start_time: "18:00:00",
        end_time: "19:30:00",
        status: "open",
      },
      {
        day: "Thursday",
        start_time: "18:00:00",
        end_time: "19:30:00",
        status: "open",
      },
    ],
    skill_category: {
      id: "6",
      name: "Fitness",
    },
    created_at: "2025-05-30T07:30:00Z",
  },

  {
    skill_id: "3",
    status: "rejected",
    module: "javascript",
    description: "Frontend web development with JavaScript",
    charge_per_hour: "28.00",
    department: {
      id: "1",
      name: "Department of Applied Computer Science",
    },
    degree: {
      id: "1",
      department: {
        id: "1",
        name: "Department of Applied Computer Science",
      },
      name: "Bachelor Angewandte Informatik",
    },
    user: {
      id: "3",
      name: "Ccin Lee",
      email: "cin@example.com",
      contact_number: "0987654321",
      role: 2,
    },
    available_time_week: [
      {
        day: "Monday",
        start_time: "16:00:00",
        end_time: "18:00:00",
        status: "open",
      },
      {
        day: "Friday",
        start_time: "10:00:00",
        end_time: "12:00:00",
        status: "open",
      },
    ],
    skill_category: {
      id: "1",
      name: "Programming",
    },
    created_at: "2025-05-16T11:30:00Z",
  },
  {
    skill_id: "1",
    status: "rejected",
    module: "python",
    description: "Python programming for beginners",
    charge_per_hour: "25.00",
    department: {
      id: "1",
      name: "Department of Applied Computer Science",
    },
    degree: {
      id: "1",
      department: {
        id: "1",
        name: "Department of Applied Computer Science",
      },
      name: "Bachelor Angewandte Informatik",
    },
    user: {
      id: "2",
      name: "Bob Lee",
      email: "bob@example.com",
      contact_number: "0987654321",
      role: 2,
    },
    available_time_week: [
      {
        day: "Monday",
        start_time: "09:00:00",
        end_time: "11:00:00",
        status: "open",
      },
      {
        day: "Wednesday",
        start_time: "14:00:00",
        end_time: "16:00:00",
        status: "open",
      },
    ],
    skill_category: {
      id: "1",
      name: "Programming",
    },
    created_at: "2025-05-01T10:00:00Z",
  },
];
