export const skillCategories = [
  {
    name: "All",
    slug: "all",
    parent: null,
    subcategories: [],
    id: "681675a3b076a0eff2a196eb",
  },
  {
    id: "cs",
    name: "Computer Science",
    slug: "computer-science",
    color: "#3B82F6", // blue
    parent: null,
    subcategories: [
      {
        id: "cs101",
        name: "Data Structures",
        slug: "data-structures",
        color: "#60A5FA",
        subcategories: [],
        parent: "cs",
      },
      {
        id: "cs102",
        name: "Algorithms",
        slug: "algorithms",
        color: "#60A5FA",
        subcategories: [],
        parent: "cs",
      },
      {
        id: "cs103",
        name: "Operating Systems",
        slug: "operating-systems",
        color: "#60A5FA",
        subcategories: [],
        parent: "cs",
      },
    ],
  },
  {
    id: "ee",
    name: "Electrical Engineering",
    slug: "electrical-engineering",
    color: "#F59E0B", // amber
    parent: null,
    subcategories: [
      {
        id: "ee101",
        name: "Circuit Theory",
        slug: "circuit-theory",
        color: "#FBBF24",
        subcategories: [],
        parent: "ee",
      },
      {
        id: "ee102",
        name: "Electromagnetics",
        slug: "electromagnetics",
        color: "#FBBF24",
        subcategories: [],
        parent: "ee",
      },
    ],
  },
  {
    id: "me",
    name: "Mechanical Engineering",
    slug: "mechanical-engineering",
    color: "#10B981", // green
    parent: null,
    subcategories: [
      {
        id: "me101",
        name: "Thermodynamics",
        slug: "thermodynamics",
        color: "#34D399",
        subcategories: [],
        parent: "me",
      },
      {
        id: "me102",
        name: "Fluid Mechanics",
        slug: "fluid-mechanics",
        color: "#34D399",
        subcategories: [],
        parent: "me",
      },
    ],
  },
  {
    id: "math",
    name: "Mathematics",
    slug: "mathematics",
    color: "#8B5CF6", // violet

    parent: null,
    subcategories: [
      {
        id: "math101",
        name: "Linear Algebra",
        slug: "linear-algebra",
        color: "#A78BFA",
        subcategories: [],
        parent: "math",
      },
      {
        id: "math102",
        name: "Calculus",
        slug: "calculus",
        color: "#A78BFA",
        subcategories: [],
        parent: "math",
      },
    ],
  },
];
