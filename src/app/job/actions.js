"use server";

import { revalidateTag } from "next/cache";

let idCounter = 3;

export async function addJob(title) {
  await fetch("http://localhost:3000/api/jobs", {
    method: "POST",
    body: JSON.stringify({ title }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  // 🔥 IMPORTANT: tell Next "job data changed"
  revalidateTag("job");
}