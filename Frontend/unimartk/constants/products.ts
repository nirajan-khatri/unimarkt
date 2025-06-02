import { categories } from "./product-categories";

export const products: Product[] = [
  {
    id: "p001",
    name: "Mastering Personal Finance",
    description:
      "A comprehensive guide to managing your money, budgeting, and saving effectively.",
    price: "29.99",
    category: categories[1],
    status: "pending",
    user: {
      id: "u001",
      name: "John Doe",
      email: "john.doe@hs-fulda.de",
      role: {
        id: 1,
        name: "faculty",
      },
    },
    created_at: new Date().toISOString(),
    subCategory: categories[1].subcategories[0],
  },
  {
    id: "p002",
    name: "Introduction to AI",
    description:
      "An engaging starter guide to the world of artificial intelligence and machine learning.",
    price: "39.99",
    category: categories[1],
    status: "rejected",
    user: {
      id: "u002",
      name: "Alice Smith",
      email: "alice.smith@hs-fulda.de",
      role: {
        id: 2,
        name: "faculty",
      },
    },
    created_at: new Date().toISOString(),
    subCategory: categories[1].subcategories[0],
  },
  {
    id: "p003",
    name: "JavaScript Essentials",
    description:
      "Master the fundamentals of JavaScript for web development with hands-on examples.",
    price: "24.99",
    category: categories[2],
    status: "pending",
    user: {
      id: "u003",
      name: "Bob Johnson",
      email: "bob.johnson@hs-fulda.de",
      role: {
        id: 2,
        name: "faculty",
      },
    },
    created_at: new Date().toISOString(),
    subCategory: categories[2].subcategories[1],
  },
  {
    id: "p004",
    name: "Cybersecurity Basics",
    description:
      "Protect your digital assets with this beginner course in cybersecurity principles.",
    price: "34.50",
    category: categories[3],
    status: "pending",
    user: {
      id: "u004",
      name: "David Lee",
      email: "david.lee@hs-fulda.de",
      role: {
        id: 1,
        name: "faculty",
      },
    },
    created_at: new Date().toISOString(),
    subCategory: categories[3].subcategories[0],
  },
  {
    id: "p005",
    name: "Data Structures in Python",
    description:
      "Explore arrays, linked lists, stacks, and more with this Python-centric course.",
    price: "19.99",
    category: categories[2],
    status: "pending",
    user: {
      id: "u005",
      name: "Evelyn Brown",
      email: "evelyn.brown@hs-fulda.de",
      role: {
        id: 1,
        name: "faculty",
      },
    },
    created_at: new Date().toISOString(),
    subCategory: categories[2].subcategories[2],
  },
  {
    id: "p006",
    name: "Ethical Hacking 101",
    description:
      "Learn the foundations of ethical hacking, penetration testing, and security assessment.",
    price: "44.00",
    category: categories[3],
    status: "pending",
    user: {
      id: "u006",
      name: "Fiona White",
      email: "fiona.white@hs-fulda.de",
      role: {
        id: 2,
        name: "faculty",
      },
    },
    created_at: new Date().toISOString(),
    subCategory: categories[3].subcategories[1],
  },
  {
    id: "p007",
    name: "UI/UX Design Principles",
    description:
      "A visual and practical course on creating beautiful and user-friendly interfaces.",
    price: "27.95",
    category: categories[4],
    status: "rejected",
    user: {
      id: "u007",
      name: "George Clark",
      email: "george.clark@hs-fulda.de",
      role: {
        id: 1,
        name: "faculty",
      },
    },
    created_at: new Date().toISOString(),
    subCategory: categories[4].subcategories[0],
  },
  {
    id: "p008",
    name: "DevOps Simplified",
    description:
      "Understand CI/CD, Docker, and automation pipelines in this quick DevOps guide.",
    price: "31.99",
    category: categories[4],
    status: "pending",
    user: {
      id: "u008",
      name: "Hannah Green",
      email: "hannah.green@hs-fulda.de",
      role: {
        id: 2,
        name: "faculty",
      },
    },
    created_at: new Date().toISOString(),
    subCategory: categories[4].subcategories[1],
  },
  {
    id: "p009",
    name: "Discrete Mathematics",
    description:
      "Perfect for CS students, covering logic, set theory, and combinatorics.",
    price: "22.00",
    category: categories[1],
    status: "pending",
    user: {
      id: "u009",
      name: "Ivan Novak",
      email: "ivan.novak@hs-fulda.de",
      role: {
        id: 1,
        name: "faculty",
      },
    },
    created_at: new Date().toISOString(),
    subCategory: categories[1].subcategories[1],
  },
  {
    id: "p010",
    name: "Cloud Computing with AWS",
    description:
      "Deploy and manage scalable applications using Amazon Web Services.",
    price: "49.99",
    category: categories[4],
    status: "pending",
    user: {
      id: "u010",
      name: "Julia Wilson",
      email: "julia.wilson@hs-fulda.de",
      role: {
        id: 2,
        name: "faculty",
      },
    },
    created_at: new Date().toISOString(),
    subCategory: categories[4].subcategories[2],
  },
  {
    id: "p011",
    name: "Machine Learning Crash Course",
    description:
      "Jump into supervised and unsupervised learning with this accelerated course.",
    price: "59.99",
    category: categories[1],
    status: "pending",
    user: {
      id: "u011",
      name: "Karl Meier",
      email: "karl.meier@hs-fulda.de",
      role: {
        id: 1,
        name: "faculty",
      },
    },
    created_at: new Date().toISOString(),
    subCategory: categories[1].subcategories[2],
  },
];
