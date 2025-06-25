"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface JobDetail {
  job_id: number;
  title: string;
  description: string;
  qualifications: string;
  department: {
    id: number;
    name: string;
  };
  job_type: string;
  remuneration: string;
  contact_email: string;
  contact_name: string;
  contact_phone: string | null;
  status: string;
  status_display: string;
  posted_by: {
    id: number;
    name: string;
    email: string;
    contact_number: string | null;
    role: string | null;
  };
  created_at: string;
  updated_at: string;
  rejection_reason: string | null;
  can_archive: boolean;
  is_archived: boolean;
}

export default function JobDetailPage() {
  const { job_id } = useParams();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJob() {
      setLoading(true);
      setError(null);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000/api/";
        const res = await fetch(`${baseUrl}jobs/${job_id}/`);
        if (!res.ok) throw new Error("Failed to fetch job details");
        const data = await res.json();
        setJob(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    if (job_id) fetchJob();
  }, [job_id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!job) return <div className="p-8">No job found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
      <div className="mb-4 text-gray-600">{job.department?.name} &middot; {job.job_type}</div>
      <div className="mb-4">{job.description}</div>
      <div className="mb-4">
        <strong>Qualifications:</strong> {job.qualifications}
      </div>
      <div className="mb-4">
        <strong>Remuneration:</strong> {job.remuneration}
      </div>
      <div className="mb-4">
        <strong>Contact:</strong> {job.contact_name} ({job.contact_email})
        {job.contact_phone && <span> &middot; {job.contact_phone}</span>}
      </div>
      <div className="text-xs text-gray-400">Posted: {new Date(job.created_at).toLocaleDateString()}</div>
    </div>
  );
} 