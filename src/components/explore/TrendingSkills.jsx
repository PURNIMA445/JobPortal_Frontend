"use client";

const SKILLS = [
  { name: "React", hot: true }, { name: "TypeScript", hot: true }, { name: "Python", hot: false },
  { name: "Figma", hot: true }, { name: "Next.js", hot: true }, { name: "Node.js", hot: false },
  { name: "SQL", hot: false }, { name: "Tailwind CSS", hot: false }, { name: "AWS", hot: true },
  { name: "Go", hot: false }, { name: "Docker", hot: false }, { name: "Kubernetes", hot: false },
  { name: "GraphQL", hot: false }, { name: "Swift", hot: false }, { name: "Rust", hot: true },
  { name: "Prompt Engineering", hot: true }, { name: "LLMs", hot: true }, { name: "dbt", hot: false },
];

export default function TrendingSkills({ onSkillClick }) {
  return (
    <section className="px-4 py-12 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6 animate-fade-in-left">
        <div>
          <h2 className="text-xl font-bold text-slate-800">⚡ Trending Skills</h2>
          <p className="text-sm text-slate-500 mt-0.5">Most in-demand skills right now</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {SKILLS.map((skill, i) => (
          <button
            key={skill.name}
            onClick={() => onSkillClick?.(skill.name)}
            className={`
              text-sm font-medium px-4 py-2 rounded-full border transition-all duration-200
              hover:scale-105 active:scale-95 animate-fade-in-up
              ${skill.hot
                ? "bg-linear-to-r from-rose-50 to-pink-50 border-rose-200 text-rose-600 hover:from-rose-100 hover:to-pink-100 hover:border-rose-300 hover:shadow-md hover:shadow-rose-100"
                : "bg-white border-slate-200 text-slate-600 hover:border-rose-200 hover:text-rose-500 hover:bg-rose-50 hover:shadow-sm"
              }
            `}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            {skill.hot && <span className="mr-1 text-xs">🔥</span>}
            {skill.name}
          </button>
        ))}
      </div>
    </section>
  );
}