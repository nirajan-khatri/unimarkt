import axios from "@/lib/axios";
import { Job } from "../types";

export const fetchJobById = async (jobId: string): Promise<Job> => {
  // add logic to ckeck if user is actually superadmin
  const response = await axios.get(`/jobs/${jobId}`);
  return response.data;
};
