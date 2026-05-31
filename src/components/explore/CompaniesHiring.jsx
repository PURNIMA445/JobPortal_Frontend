const COMPANIES = [
    { name: "Stripe", logo: "S", color: "#635BFF", open: 24, location: "Remote · SF", tag: "Fintech" },
    { name: "Vercel", logo: "V", color: "#000000", open: 18, location: "Remote", tag: "Dev Tools" },
    { name: "Notion", logo: "N", color: "#191919", open: 12, location: "SF · Remote", tag: "Productivity" },
    { name: "Linear", logo: "L", color: "#5E6AD2", open: 9, location: "Remote", tag: "Dev Tools" },
    { name: "Loom", logo: "L", color: "#625DF5", open: 7, location: "SF · NY", tag: "Video" },
    { name: "Brex", logo: "B", color: "#FF6B35", open: 15, location: "Remote · NY", tag: "Fintech" },
  ];
  
  export default function CompaniesHiring() {
    return (
      <section className="px-4 py-12 bg-linear-to-b from-white to-rose-50/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 animate-fade-in-up">
            <h2 className="text-xl font-bold text-slate-800">🏢 Companies Hiring Now</h2>
            <p className="text-sm text-slate-500 mt-1">Join teams building the future</p>
          </div>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMPANIES.map((co, i) => (
              <div
                key={co.name}
                className="bg-white border border-rose-100 rounded-2xl p-5 hover:shadow-lg hover:shadow-rose-100 hover:-translate-y-1 hover:border-rose-200 transition-all duration-200 cursor-pointer group flex items-center gap-4 animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"
                  style={{ backgroundColor: co.color }}
                >
                  {co.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="text-sm font-semibold text-slate-800 group-hover:text-rose-500 transition-colors duration-200">
                      {co.name}
                    </h3>
                    <span className="text-xs bg-rose-50 text-rose-500 font-semibold px-2 py-0.5 rounded-full">
                      {co.open} open
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{co.location}</p>
                  <span className="text-xs text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md mt-1.5 inline-block">
                    {co.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }