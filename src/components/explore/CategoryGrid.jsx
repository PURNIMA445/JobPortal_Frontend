const CATEGORIES = [
    { name: "Technology", icon: "💻", count: "4,200+ jobs", color: "from-violet-50 to-purple-50", border: "border-violet-100", text: "text-violet-600", hover: "hover:border-violet-300 hover:shadow-violet-100" },
    { name: "Design", icon: "🎨", count: "1,800+ jobs", color: "from-pink-50 to-rose-50", border: "border-pink-100", text: "text-pink-600", hover: "hover:border-pink-300 hover:shadow-pink-100" },
    { name: "Marketing", icon: "📣", count: "2,100+ jobs", color: "from-orange-50 to-amber-50", border: "border-orange-100", text: "text-orange-600", hover: "hover:border-orange-300 hover:shadow-orange-100" },
    { name: "Finance", icon: "📊", count: "1,500+ jobs", color: "from-emerald-50 to-green-50", border: "border-emerald-100", text: "text-emerald-600", hover: "hover:border-emerald-300 hover:shadow-emerald-100" },
    { name: "Healthcare", icon: "🏥", count: "3,000+ jobs", color: "from-sky-50 to-blue-50", border: "border-sky-100", text: "text-sky-600", hover: "hover:border-sky-300 hover:shadow-sky-100" },
    { name: "Education", icon: "📚", count: "900+ jobs", color: "from-yellow-50 to-lime-50", border: "border-yellow-100", text: "text-yellow-600", hover: "hover:border-yellow-300 hover:shadow-yellow-100" },
    { name: "Sales", icon: "🤝", count: "2,800+ jobs", color: "from-rose-50 to-red-50", border: "border-rose-100", text: "text-rose-600", hover: "hover:border-rose-300 hover:shadow-rose-100" },
    { name: "Legal", icon: "⚖️", count: "600+ jobs", color: "from-slate-50 to-gray-50", border: "border-slate-100", text: "text-slate-600", hover: "hover:border-slate-300 hover:shadow-slate-100" },
  ];
  
  export default function CategoryGrid() {
    return (
      <section className="px-4 py-12 bg-slate-50/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 animate-fade-in-up">
            <h2 className="text-xl font-bold text-slate-800">Browse by Category</h2>
            <p className="text-sm text-slate-500 mt-1">Explore opportunities in your field</p>
          </div>
  
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat.name}
                className={`bg-linear-to-br ${cat.color} border ${cat.border} rounded-2xl p-5 text-left hover:shadow-lg ${cat.hover} hover:-translate-y-1 hover:scale-[1.02] active:scale-95 transition-all duration-200 group animate-fade-in-up`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Icon bounces gently on hover */}
                <span className="text-2xl mb-3 block group-hover:scale-125 group-hover:-rotate-6 transition-transform duration-300">
                  {cat.icon}
                </span>
                <p className={`text-sm font-semibold ${cat.text} mb-0.5`}>{cat.name}</p>
                <p className="text-xs text-slate-400">{cat.count}</p>
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  }