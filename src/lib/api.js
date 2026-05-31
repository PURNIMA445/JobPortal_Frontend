export async function getJobs() {
  'use cache'
  const res = await fetch("http://localhost:3000/api/jobs", {
    next: { tags: ["job"] },
  });

  return res.json();
}