import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  GraduationCap,
  Laptop,
  MapPin,
  Monitor,
  Search,
  School,
} from "lucide-react";

const CATEGORIES = [
  {
    title: "Books",
    icon: BookOpen,
    text: "Textbooks, academic books and study materials",
  },
  {
    title: "Calculators",
    icon: Calculator,
    text: "Scientific and academic calculators",
  },
  {
    title: "Electronics",
    icon: Laptop,
    text: "Laptops, accessories and student devices",
  },
  {
    title: "Study Setup",
    icon: Monitor,
    text: "Monitors, tables, chairs and study essentials",
  },
];

const UNIVERSITIES = [
  "University of Dhaka",
  "University of Rajshahi",
  "BRAC University",
  "North South University",
  "AIUB",
  "Daffodil International University",
];

export const metadata = {
  title: "Student Exchange Zone | ReSellHub",
  description:
    "A student-focused exchange space for affordable pre-owned products in Bangladesh.",
};

export default function StudentZonePage() {
  return (
    <main className="min-h-screen bg-[#f7faf8]">
      {/* HERO */}
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_.9fr] lg:px-8 lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-black text-blue-700">
              <GraduationCap size={15} />
              Student Exchange Zone
            </div>

            <h1 className="mt-5 max-w-2xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">
              Pass useful student essentials
              <span className="text-emerald-600"> forward.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
              Buy and sell books, calculators, electronics and study
              essentials within student communities across Bangladesh.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-black text-white transition hover:bg-slate-800"
              >
                Explore products
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-black text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
              >
                Join Student Zone
              </Link>
            </div>
          </div>

          {/* CAMPUS CARD */}
          <div className="rounded-[2rem] border border-slate-200 bg-[#f8fbf9] p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">
              Find your campus
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-950">
              Discover what students around you are selling.
            </h2>

            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search university..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="mt-5 space-y-2">
              {UNIVERSITIES.slice(0, 4).map((university) => (
                <button
                  key={university}
                  type="button"
                  className="flex w-full items-center justify-between rounded-xl border border-slate-100 bg-white px-4 py-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                      <School size={16} />
                    </div>

                    <span className="text-sm font-bold text-slate-700">
                      {university}
                    </span>
                  </div>

                  <ArrowRight size={15} className="text-slate-300" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">
            Student essentials
          </p>

          <h2 className="mt-2 text-3xl font-black text-slate-950">
            Useful items for campus life.
          </h2>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Icon size={19} />
                </div>

                <h3 className="mt-4 text-base font-black text-slate-950">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* WHY */}
      <section className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            <InfoCard
              icon={GraduationCap}
              title="Student focused"
              text="A dedicated space for products students regularly need."
            />

            <InfoCard
              icon={MapPin}
              title="Campus based"
              text="Discover listings connected to your university community."
            />

            <InfoCard
              icon={ArrowRight}
              title="Reuse naturally"
              text="A senior's unused item can become useful for another student."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-[#f8fbf9] p-5">
      <Icon size={20} className="text-emerald-600" />

      <h3 className="mt-3 text-base font-black text-slate-950">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {text}
      </p>
    </div>
  );
}