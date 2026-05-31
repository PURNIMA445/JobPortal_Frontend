"use client";

import { useState } from "react";
import { addJob } from "./actions";

export default function AddJob() {
  const [title, setTitle] = useState("");

  async function handleAdd() {
    if (!title) return;

    await addJob(title);

    setTitle("");
  }

  return (
    <div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New job"
      />

      <button onClick={handleAdd}>
        Add Job
      </button>
    </div>
  );
}