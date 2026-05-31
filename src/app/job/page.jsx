import { getJobs } from "@/lib/api";
import AddJob from "./AddJob";

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <div>
      <h1>Jobs</h1>

      <AddJob />

      {jobs.map((job) => (
        <div key={job.id}>{job.title}</div>
      ))}
    </div>
  );
}