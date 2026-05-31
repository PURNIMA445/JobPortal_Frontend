// let jobs = [
//   { id: 1, title: "Frontend Developer" },
//   { id: 2, title: "Backend Developer" },
// ];

// export async function GET() {
//   return Response.json(jobs);
// }

// export async function POST(req) {
//   const { title } = await req.json();

//   const newJob = {
//     id: jobs.length + 1,
//     title,
//   };

//   jobs.push(newJob);

//   return Response.json(newJob);
// }
import { NextResponse } from "next/server";

const jobs = [
  { id: 1, title: "Senior Frontend Developer", company: "Stripe", location: "Remote", type: "Full-time", category: "IT", salary: "$120k–$160k", logo: "S", color: "#635BFF", skills: ["React", "TypeScript", "GraphQL"], featured: true, postedAt: "2d ago" },
  { id: 2, title: "Product Designer", company: "Notion", location: "San Francisco", type: "Full-time", category: "Design", salary: "$110k–$140k", logo: "N", color: "#000000", skills: ["Figma", "Prototyping", "UX Research"], featured: true, postedAt: "1d ago" },
  { id: 3, title: "Growth Marketing Manager", company: "Linear", location: "Remote", type: "Full-time", category: "Marketing", salary: "$90k–$120k", logo: "L", color: "#5E6AD2", skills: ["SEO", "Analytics", "Copywriting"], featured: true, postedAt: "3d ago" },
  { id: 4, title: "Data Engineer", company: "Vercel", location: "New York", type: "Full-time", category: "IT", salary: "$130k–$170k", logo: "V", color: "#000000", skills: ["Python", "dbt", "Spark"], featured: true, postedAt: "5h ago" },
  { id: 5, title: "Brand Designer", company: "Loom", location: "Remote", type: "Contract", category: "Design", salary: "$80k–$100k", logo: "L", color: "#625DF5", skills: ["Brand Identity", "Illustrator", "Motion"], featured: false, postedAt: "1w ago" },
  { id: 6, title: "Backend Engineer", company: "PlanetScale", location: "Remote", type: "Full-time", category: "IT", salary: "$140k–$180k", logo: "P", color: "#0EA5E9", skills: ["Go", "MySQL", "Kubernetes"], featured: false, postedAt: "2d ago" },
  { id: 7, title: "Financial Analyst", company: "Brex", location: "New York", type: "Full-time", category: "Finance", salary: "$100k–$130k", logo: "B", color: "#FF6B35", skills: ["Excel", "SQL", "Modeling"], featured: false, postedAt: "3d ago" },
  { id: 8, title: "Content Strategist", company: "Buffer", location: "Remote", type: "Part-time", category: "Marketing", salary: "$60k–$80k", logo: "B", color: "#168EEA", skills: ["Content", "SEO", "Strategy"], featured: false, postedAt: "4d ago" },
  { id: 9, title: "iOS Developer", company: "Superwall", location: "Remote", type: "Full-time", category: "IT", salary: "$125k–$155k", logo: "S", color: "#FF385C", skills: ["Swift", "SwiftUI", "Xcode"], featured: false, postedAt: "6d ago" },
  { id: 10, title: "UX Researcher", company: "Maze", location: "Remote", type: "Full-time", category: "Design", salary: "$95k–$125k", logo: "M", color: "#FF4F64", skills: ["User Testing", "Interviews", "Figma"], featured: false, postedAt: "1w ago" },
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.toLowerCase() || "";
  const type = searchParams.get("type") || "";
  const location = searchParams.get("location") || "";
  const category = searchParams.get("category") || "";

  let filtered = jobs;

  if (search) {
    filtered = filtered.filter(
      (j) =>
        j.title.toLowerCase().includes(search) ||
        j.company.toLowerCase().includes(search)
    );
  }
  if (type) filtered = filtered.filter((j) => j.type === type);
  if (location) {
    filtered = filtered.filter((j) =>
      location === "Remote" ? j.location === "Remote" : j.location !== "Remote"
    );
  }
  if (category) filtered = filtered.filter((j) => j.category === category);

  return NextResponse.json({ jobs: filtered, total: filtered.length });
}