export type User = {
  id: string;
  name: string;
  email: string;
  contact_number?: string;
  role: string;
  avatarUrl?: string;
};

export type SkillCategory = {
  id: string;
  name: string;
  slug: string;
};
