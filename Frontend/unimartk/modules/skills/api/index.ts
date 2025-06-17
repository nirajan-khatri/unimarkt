import axios from "@/lib/axios";
import { Skill } from "../types";

export const fetchSkillById = async (skillId: string): Promise<Skill> => {
  // add logic to ckeck if user is actually superadmin
  const response = await axios.get(`/skills/${skillId}`);
  return response.data;
};
